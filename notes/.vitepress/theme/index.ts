import DefaultTheme from 'vitepress/theme'
import Mermaid from './Mermaid.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Mermaid', Mermaid)
  }
}