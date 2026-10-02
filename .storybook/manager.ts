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
