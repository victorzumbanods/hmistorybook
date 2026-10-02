#!/usr/bin/env node
// Pulls local variables from a Figma file through the REST API and writes tokens/figma-variables.json.
// Requires a Figma Enterprise plan and a personal access token with the `file_variables:read` scope.
//
//   FIGMA_TOKEN=figd_xxx FIGMA_FILE_KEY=AbC123 npm run tokens:pull
//
// FIGMA_FILE_KEY is the part after /design/ in the file URL.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { normalize, serialize } from './lib/normalize.mjs'
import { SOURCE } from './build-tokens.mjs'

const token = process.env.FIGMA_TOKEN
const fileKey = process.env.FIGMA_FILE_KEY
if (!token || !fileKey) {
  console.error('Missing FIGMA_TOKEN and/or FIGMA_FILE_KEY.')
  process.exit(1)
}

const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, { headers: { 'X-Figma-Token': token } })
if (!res.ok) {
  console.error(`Figma API ${res.status}: ${await res.text()}`)
  if (res.status === 403) console.error('403 usually means the file is not on an Enterprise plan or the token lacks file_variables:read.')
  process.exit(1)
}

const next = serialize(normalize(await res.json()))
const prev = existsSync(SOURCE) ? readFileSync(SOURCE, 'utf8') : ''
if (prev === next) {
  console.log('✓ Figma variables unchanged.')
} else {
  writeFileSync(SOURCE, next)
  console.log('✓ Figma variables updated → tokens/figma-variables.json')
}
