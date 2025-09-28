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
      { text: '公共服务', link: '/public-service' },
      { text: '博客', link: '/blogs' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/superAlibi' }
    ],
    sidebar: [
      {
        text: '公共服务',
        link: '/public-service',
      },
      {
        text: '博客',
        link: '/blogs',
      },
      {
        text: '项目管理',
        // collapsed: false,
        items: [
          { text: '项目风险管理', link: '/blogs/project/two' },
          { text: '关于WBS', link: '/blogs/project/three' },
          { text: '项目干系人', link: '/blogs/project/five' },
          { text: '论项目管理重要性', link: '/blogs/project/one' },
          { text: '项目关键路径', link: '/blogs/project/four' },
        ]
      }
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
