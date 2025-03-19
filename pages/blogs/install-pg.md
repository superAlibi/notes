# 安装postgresql

我最开始比较认可postgresql是因为它比mysql更符合ANSI SQL,仅此而已.不过因为其强大和灵活的配置和插件系统,导致其配置文件相当复杂.且默认配置一点也不合理,兴许他们就是要这样强制使用者去了解他们呢?


## 前言


***理解本文的必要条件***


  - 您已获得了sudo/root权限
  - 具备linux系统使用经验

***本文一定会编辑的配置文件***:

- `/var/lib/pgsql/data/postgresql.conf`
- `/var/lib/pgsql/data/pg_hba.conf`

***参考资料***

  - [fedora官方文档](https://docs.fedoraproject.org/en-US/quick-docs/postgresql/)
  - [postgresql官方文档](https://www.postgresql.org/docs/17/index.html)
  - [redhat官方文档](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/9/html/configuring_and_using_database_servers/using-postgresql_configuring-and-using-database-servers)

***您已可能需要了解的概念***

  - postgresql是什么
  - fedora的包管理器(dnf)
  - [systemd](https://docs.fedoraproject.org/zh_CN/quick-docs/systemd-understanding-and-administering/)


## 在fedora41上安装postgresql17

***本文编写前的经历***

  - 通过postgresql官方提供的[安装方式](https://www.postgresql.org/download/linux/redhat/)遇到错误
  - 通过google查找到fedora论坛的[建议](https://forums.fedoraforum.org/showthread.php?331804-PostgreSQL-repomd-xml-GPG-signature-error&p=1878766#post1878766):通过fedora[官方文档](https://docs.fedoraproject.org/en-US/quick-docs/postgresql/)提供的方式安装
  - 根据需要,自定义配置postgresql

## 一. 安装

由于此部分介绍的时fedora41,又因为经过往经历,所以此部分采用官方fedora文档提供的安装方式.

**注意** : 官方明确说明了,此安装方式有别于其他linux发行版

```bash
$ sudo dnf install postgresql-server postgresql-contrib
```



然后,使用 `postgresql-setup` 初始化数据库, 他将配置 `postgresql.conf` 和 `pg_hba.conf`

```bash
$ sudo postgresql-setup --initdb --unit postgresql
```

安装完成后,默认postgresql服务是未运行且禁用的,可以通过`systemctl`命令来管理

以下命令表示启用postgresql服务并要求立即启动, `--now` 选项就是表示立即启动

```bash
$ sudo systemctl enable --now postgresql
```


## 二. 创建用户和数据库


在通过dnf安装时,默认创建了`postgres`用户,且`postgres`就是用来运行 `postgresql` 服务器和客户端应用的

```bash
$ sudo -u postgres psql
```

以下命令操作,可以创建自己的用户和数据库.


**tips**:

> 此处作为文档说明,是在假象你有一个 `linux` 账号 `lenny`的前提下.如果你想用自己的账户,请将命令行行中的`lenny`替换为你的账户名


创建 `postgresql` 数据库登录用户 `lenny`,并设置密码: `leonard`


```bash
postgres=# CREATE USER lenny WITH PASSWORD 'leonard';
```
创建一个数据库 `my_pj_db`,并设置所有者为数据库登录用户 `lenny`

```bash
postgres=# CREATE DATABASE my_pj_db OWNER lenny;
```

最好在此时修改`postgresql`的数据库账户`postgres`的连接密码

```bash
postgres=# \password postgres
```


现在,你可以在命令行中输入`\q`或者通过`ctrl + d`退出用户`postgres`用户的`psql`会话.

然后你就可以开始使用`lenny`用户登录`postgresql`数据库会话shell了.**此处仍然假设你当前的linux shell会话是`lenny`用户**

```bash
$ psql -d my_pj_db
```


**tips**:
> 如果是使用的其他linux用户,你可以通过`sudo -u lenny psql -d my_pj_db`来登录数据库会话
> 
> 这样,你就可以使用`lenny`用户登录`postgresql`了




## 三. 配置

postgresql数据库有两个主要的配置文件

- `/var/lib/pgsql/data/postgresql.conf`
- `/var/lib/pgsql/data/pg_hba.conf`


其中`postgresql.conf`是主要的服务配置文件,`pg_hba.conf`是客户端连接认证方式的配置文件

### 3.1 允许远程连接

其中编辑`postgresql.conf`设置允许wan访问数据库服务:

```bash
$ sudo vim /var/lib/pgsql/data/postgresql.conf
```

找到`listen_addresses = 'localhost'`配置项,将这行内容修改为`listen_addresses = '*'`表示允许所有ip访问

### 3.2 客户端连接认证方式

接下来,如果你需要允许远程访问,则一定要编辑`pg_hba.conf`文件,设置客户端连接认证方式.

```bash
$ sudo vim /var/lib/pgsql/data/pg_hba.conf
```

在默认情况下,主要的内容如下

```text

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            ident
# IPv6 local connections:
host    all             all             ::1/128                 ident
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            ident
host    replication     all             ::1/128                 ident

```

这里稍微美化一下配置文件,这个配置文件默认允许的连接方式如下表格

| 连接类型 | 连接数据库  | 用户 | 客户端地址   | 认证方式 |
| -------- | ----------- | ---- | ------------ | -------- |
| local    | all         | all  |              | peer     |
| host     | all         | all  | 127.0.0.1/32 | ident    |
| host     | all         | all  | ::1/128      | ident    |
| local    | replication | all  |              | peer     |
| host     | replication | all  | 127.0.0.1/32 | ident    |
| host     | replication | all  | ::1/128      | ident    |

以上表格中各列的详细描述,我这里暂时不做介绍,如果需要请自行[查看](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html).

这里我仅介绍如何允许一般情况下,允许远程访问方式为数据库用户账号和数据库用户账号密码登录,则按照如下配置调整
```text
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
host    all             all             0.0.0.0/0               md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
host    all             all             ::/0                    md5 
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            ident
host    replication     all             ::1/128                 ident
```

### 3.3 通过systemd改变postgresql的运行状态

一些配置参数通过命令行传递给守护进程选项。此行为可能会覆盖 `postgresql.conf` 中的设置。例如，如果要将服务器的端口号更改为 5433，请在 /etc/systemd/system/postgresql.service 文件中修改下内容(部分)

```text
.include /lib/systemd/system/postgresql.service
[Service]
Environment=PGPORT=5433
```

注意：更改 PGPORT 或 PGDATA 通常需要调整 SELinux 配置;参见 [selinux](#五-selinux) 部分。

有关更多详细信息，请按照 [systemd 文档](https://docs.fedoraproject.org/en-US/quick-docs/systemd-understanding-and-administering/) 进行操作。



## 四. 防火墙


`postgresql`服务默认使用5432端口,所以需要打开5432端口

```bash
$ sudo firewall-cmd --add-port=5432/tcp --permanent
$ sudo firewall-cmd --reload
```

处理命令行的方式,cockpit服务提供了图形化界面,可以方便的管理防火墙,你只需要在指定的安全域中选择开启`postgresql`服务即可,防火墙会自动重载并永久应用


tips:

> ***你可能不需要向全世界开放数据库的访问***



## 五. seLinux*

默认情况下,在安装时,selinux策略已经配置好了.但是在您修改了数据库的配置后,且selinux开启了强制模式,您需要重新配置selinux策略

如果您修改了的数据库的安装位置时,则需要重新配置selinux策略,例如:

```bash
semanage fcontext -a -t postgresql_db_t "/my/new/location(/.*)?"
```

然后,您需要重新加载selinux策略

```bash
$ sudo restorecon -R -v /my/new/location
```

如果您调整了`postgresql`的默认端口,您可能需要将`postgresql`的端口类型映射到您想要的端口：

```bash
semanage port -a -t postgresql_port_t -p tcp 5433
```

如果您安装的 Web 应用程序希望通过 TCP/IP，您得告诉 SELinux 在 web 服务器上允许这样做 主机：

```bash
setsebool -P httpd_can_network_connect_db on
```

## 六. 优化*