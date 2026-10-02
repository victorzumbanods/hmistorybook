import type { StorybookConfig } from '@storybook/react-vite'
import type { Plugin } from 'vite'
import { resolve } from 'node:path'
// @ts-expect-error — plain ESM build script
import { buildTokens, SOURCE } from '../scripts/build-tokens.mjs'

/** Rebuilds src/tokens/* whenever tokens/figma-variables.json changes (e.g. after a git pull), so Storybook hot-reloads. */
let builtOnce = false
function figmaTokensWatcher(): Plugin {
  return {
    name: 'figma-tokens-watcher',
    buildStart() {
      if (!builtOnce) buildTokens()
      builtOnce = true
    },
    configureServer(server) {
      server.watcher.add(SOURCE)
      server.watcher.on('change', (file) => {
        if (resolve(file) === SOURCE) buildTokens()
      })
    },
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: [],
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), figmaTokensWatcher()]
    // GitHub Pages serves from /<repo>/
    if (process.env.STORYBOOK_BASE) config.base = process.env.STORYBOOK_BASE
    return config
  },
}
export default config
