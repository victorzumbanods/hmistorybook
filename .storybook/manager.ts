import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

// The logo is white, so the Storybook UI (sidebar + toolbar) uses the dark base.
addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'HMI Storybook',
    brandImage: 'logos/logo_white.png',
    brandUrl: './',
    brandTarget: '_self',
  }),
})

// Documentation pages (tag "doc-page") have no controls: hide the addon panel there, show it elsewhere.
addons.register('hmi/doc-pages', (api) => {
  const sync = () => {
    const story = api.getCurrentStoryData()
    if (story) api.togglePanel(!story.tags?.includes('doc-page'))
  }
  api.on('storyChanged', sync)
  api.on('storyRendered', sync)
})
