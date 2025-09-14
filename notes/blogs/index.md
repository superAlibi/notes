---
layout: home
hero:
  name: 笔记&博客
  # text: 前端,后端,数据库,操作系统
  tagline: 随便写点. 前端,后端,数据库,操作系统都有
  # image:
  #   src: /vite.svg
  #   alt: VitePress
  actions:

    - theme: alt
      text: 去github看看
      link: https://github.com/superAlibi

features:
  - icon: 
      src: https://www.postgresql.org/media/img/about/press/elephant.png
    title: 在Linux上安装postgresql
    details: 它比mysql更符合ANSI SQL,因为其强大和灵活的配置和插件系统,导致其配置文件相当复杂.默认配置非常安全!
    link: /blogs/install-pg.md
  - icon:
      src: /blogs/deno/logo.svg
      alt: deno icon
      width: 150
    title: 使用cargo安装deno
    details: Rust 提供了 Cargo 这样的二进制安装工具，可以使用 Cargo 安装 Deno。
    link: /blogs/install-deno
  - icon: 🐧
    title: wsl简介
    details: WSL 成为我开发过程中不可或缺的一部分。
    link: /blogs/about-wsl
  - icon: 
      src: /blogs/nodejs/logo.png
    title: Fast Node Manager
    details: 是一个用于管理 Node.js 版本的工具， 用 `Rust` 编写
    link: /blogs/about-fnm
  - icon: 
      src: /blogs/npm.png
    title: http 请求工具 ky
    details: Ky是一个基于Fetch API的小型优雅HTTP客户端
    link: /blogs/fetcher-ky
  - icon: 
      src: /blogs/ip-tcp/image.svg
    title: TCP/IP 详解 - 卷一：协议
    details: 实体书 TCP/IP 详解 - 卷一：协议(第二版)的阅读笔记，
    link: /blogs/comput-tcpip-protocols/index
  - icon: 
      src: /blogs/gradle.png
    title: gralde 简介
    details: 想学习一下 Kotlin，发现可以使用 Gradle 快速启动一个 Kotlin 项目。
    link: /blogs/gradle
  - icon: 
      src: https://docs.gitea.cn/img/gitea.svg
    title: gitea 二三事
    details: 轻量化的 gite 仓库, 可以利用github的action生态. 文中介绍了部署私有化仓库到 ci/cd 的整个流程
    link: /blogs/about-gitea
  
---


## 待完善博客

- [关于dnf](/blogs/about-dnf)
- [关于文件系统树标准](/blogs/about-fs)
- [关于print css](/blogs/about-print-css)
- [TCP/IP 详解 - 卷一：协议](/blogs/comput-tcpip-protocols/index)
- [前端monorepo仓库](/blogs/monorepo)
- [Stream 与 音频播放](/blogs/web_media/steam_api)
