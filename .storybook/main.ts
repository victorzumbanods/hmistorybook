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
      // Debounced and guarded: the file can be read mid-write (git pull, editors), which must not kill the server.
      let timer: ReturnType<typeof setTimeout> | undefined
      server.watcher.on('change', (file) => {
        if (resolve(file) !== SOURCE) return
        clearTimeout(timer)
        timer = setTimeout(() => {
          try {
            buildTokens()
          } catch (err) {
            console.error(`⚠︎ figma-tokens: kept previous tokens, could not build (${(err as Error).message})`)
          }
        }, 150)
      })
    },
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: [{ from: '../src/public', to: '/' }],
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), figmaTokensWatcher()]
    return config
  },
}
export default config
