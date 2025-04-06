import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "云逸尘杂记",
  description: "一个前端牛马的技术碎碎念",
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
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '练习案例', link: '/practice-case' },
      { text: '博客', link: '/blogs' },
    ],

    socialLinks: [

      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
      { icon: 'github', link: 'https://github.com/superAlibi' }
    ],
    sidebar: [
      {
        text: '练习案例',
        link: '/practice-case',
        items: [
          { text: 'makdown的例子', link: '/practice-case/markdown-examples' },
          { text: 'api的例子', link: '/practice-case/vitepress-runtime-api' },
          { text: '在vitepress中使用vue', link: '/practice-case/vitepress-use-vue' },
        ]
      },
      {
        text: '博客',
        link: '/blogs',
        items: [
          { text: '安装postgresql', link: '/blogs/install-pg' },
          { text: '使用cargo安装deno', link: '/blogs/install-deno' },
          { text: '使用gitea承包DevOps', link: '/blogs/about-gitea' },
        ]
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
