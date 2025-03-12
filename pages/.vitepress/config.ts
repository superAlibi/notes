import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "云逸尘杂记",
  description: "一个前端牛马的技术碎碎念",
  vite: {
    server: {
      host: true
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/vite.svg' }],
  ],
  themeConfig: {
    logo: '/vite.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '练习案例', link: '/markdown-examples' },
      { text: '关于我', link: '/aboutme' },
    ],

    socialLinks: [

      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
      { icon: 'github', link: 'https://github.com/superAlibi' }
    ],
    sidebar: [
      {
        text: '练习记录',
        items: [
          { text: 'makdown的例子', link: '/markdown-examples' },
          { text: 'api的例子', link: '/api-examples' },
          { text: '在vitepress中使用vue', link: '/vitepress-tag' },
        ]
      },
      {
        text: '嘻嘻嘻',
        link: '/'
      },
    ],
    outline: {
      label: '内容概要'
    },
    docFooter: {
      prev: '上篇文章',
      next: '下篇文章'
    },
    lightModeSwitchTitle: '切换到亮色主题',
    darkModeSwitchTitle: '切换到暗色主题',
    darkModeSwitchLabel: '主题切换',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '内容目录'
  }
})
