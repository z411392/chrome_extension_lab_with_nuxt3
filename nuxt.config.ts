// https://nuxt.com/docs/api/configuration/nuxt-config

import { build } from 'esbuild'
import path from 'path'
import fs from 'fs'
import glob from 'glob'

const beforeBuilding = async () => {
  const srcDir = path.resolve('./standalones')
  const publicDir = path.resolve('./public')

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
  const tsFiles = glob.sync('**/*.ts', { cwd: srcDir })
  if (tsFiles.length === 0) return

  for (const tsFile of tsFiles) {
    const srcPath = path.join(srcDir, tsFile)
    const outputPath = path.join(publicDir, tsFile.replace(/\.ts$/, '.js'))
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    try {
      await build({
        entryPoints: [srcPath],
        bundle: true,
        outfile: outputPath,
        format: 'esm',
        platform: 'browser',
        minify: true
      })
    } catch (error) { }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    buildAssetsDir: '/assets/',
    head: {
      link: [
        {
          rel: "icon",
          href: "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII="
        }
      ]
    }
  },
  hooks: {
    "build:before": beforeBuilding
  },
  nitro: {
    prerender: {
      ignore: ['/200', '/404']
    }
  }
})