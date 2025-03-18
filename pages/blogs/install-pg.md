# fedora41上安装postgresql17

我最开始比较认可postgresql是因为它比mysql更符合ANSI SQL,仅此而已.不过因为其强大和灵活的配置和插件系统,导致其配置文件相当复杂.且默认配置一点也不合理,兴许他们就是要这样强制使用者去了解他们呢?


## 前言


***理解本文的必要条件***


  - 您已获得了sudo/root权限
  - 具备linux系统使用经验

***您已可能需要了解的概念***

  - postgresql是什么
  - fedora的包管理器(dnf)
  - [systemd](https://docs.fedoraproject.org/zh_CN/quick-docs/systemd-understanding-and-administering/)
  - postgresql远程连接
  - postgresql的配置文件/var/lib/pgsql/data/postgresql.conf,/var/lib/pgsql/data/pg_hba.conf

## 本文编写前的经历

  - 通过postgresql官方提供的[安装方式](https://www.postgresql.org/download/linux/redhat/)遇到错误
  - 通过google查找到fedora论坛的[建议](https://forums.fedoraforum.org/showthread.php?331804-PostgreSQL-repomd-xml-GPG-signature-error&p=1878766#post1878766):通过fedora官方文档提供的安装方式安装
  - 通过fedora官方文档提供的[安装方式](https://docs.fedoraproject.org/en-US/quick-docs/postgresql/)安装成功

## 一. 安装
## 二. 配置
### 2.1 配置文件
### 2.2 远程连接
- 有关认证方式( host-based authentication)
