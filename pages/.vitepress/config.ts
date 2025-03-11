import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "云逸尘小记",
  description: "一个前端牛马的技术碎碎念",
  base: '/notes/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '一些小案例', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '练习记录',
        items: [
          { text: 'makdown的例子', link: '/markdown-examples' },
          { text: 'api的例子', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
