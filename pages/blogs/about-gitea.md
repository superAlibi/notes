# 关于gitea

考虑到gitlab是当下大部分企业的选择,我也尝试部署了gitlab,但是因为两个原因选择了gitea.

- gitlab占用资源很大,什么也不做就占用内存达到3个多G,这点简直无法容忍
- gitlab配置复杂,且配置文件分散,需要配置多个文件

相对gitlab,gitea占用资源很小,且配置简单,且配置文件集中,只需要配置一个文件.且runner配置也很简单,我就喜欢占用资源小的,麻雀虽小,五脏俱全.






## 前言

在阅读本文前,你有必要阅读本文的关于本文撰写的前提概况,否则很有可能因为环境或者对某些概念不熟悉,造成理解上的困难.对每一个术语或者概念,我会尽可能提供外部连接,以帮助你理解.如果你不理解这个概念,建议可以通过本文的连接去查看,有关概念可能非常多,可能新手会遇到很多问题,花的时间也很长,但这些时间花出去却是必要的.

### 关于本文的机器环境



### 你需要具备的知识储备

要完全理解本文所描述的内容,你需要具备以下知识储备:

  - Linux操作系统经验
  - 知道并理解docker/podman rootless概念
  - 知道并理解docker volume/podman volume概念和作用
  - 明白act runner是什么
  - 理解和熟悉systemd
  - 了解gitea/github
  - 熟悉github actions/gitea actions
  - 理解unix socket
  - 熟悉wsl


### 实践过程中对官方文档中的描述歧义结论
 
 官方文档中一直有两次强调在docker中运行job:
 - [快速入门](https://docs.gitea.com/zh-cn/usage/actions/quickstart#%E8%AE%BE%E7%BD%AErunner)
 - [act runner](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E8%A6%81%E6%B1%82)

这两处强调在docker中运行job,实际上就是说的act runner注册时的labels参数,或者叫config.yaml中的labels参数.通读后需要整理下才能理解,这个强调具体指的哪个部分,否则容易看得不明所以.这个两个强调究竟该怎么去做

其次,github的actions仓库大部分都是使用typescript写的,因此,runner的label第二部分不论是使用host还是docker都至少支持nodejs才对