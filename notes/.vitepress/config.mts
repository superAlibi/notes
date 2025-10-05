import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({

  lang: 'zh-CN',
  title: "云逸尘杂记",
  description: "一个前端牛马的碎碎念",
  vite: {
    server: {
      host: true,
      allowedHosts: ['wj14x.lucardo.xyz']
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/vite.svg' }],
  ],
  themeConfig: {
    logo: '/vite.svg',
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '服务&案例', link: '/service' },
      { text: '博客', link: '/blogs' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/superAlibi' }
    ],
    /* sidebar: [
      {
        text: '公共服务',
        link: '/public-service',
      },
      {
        text: '博客',
        link: '/blogs',
      }
    ], */
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
