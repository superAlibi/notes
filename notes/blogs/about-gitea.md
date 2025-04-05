# 关于gitea二三事

考虑到gitlab是当下大部分企业的选择,我也尝试部署了gitlab,但是因为几点原因选择了gitea.

- gitlab占用资源很大,什么也不做就占用内存达到3个多G,这点简直无法容忍
- gitlab配置复杂,且配置文件分散,需要配置多个文件
- gitea actions与github actions大部分功能兼容(官方说法)

相对gitlab,gitea占用资源很小,且配置简单,且配置文件集中,只需要配置一个文件.且runner配置也很简单.我就喜欢占用资源小的,gitea麻雀虽小,五脏俱全.


## 前言

在阅读本文前,有必要阅读关于本文撰写的前提概况,否则很有可能因为环境或者对某些概念不熟悉,造成理解上的困难.对每一个术语或者概念,我会尽可能提供外部连接,在你不理解这个概念的情况下,可以通过文中提供的连接去查看.有关概念非常多,新手会遇到很多问题,花的时间也很长,但这些时间花出去却是必要的.

本文假设读者喜欢并认同 systemd , wsl , podman rootless,这是本文区别于很多文章的基石和基本动机,以及本文产生的结果.

另外本文需要你具备科学上网的环境,否则无法下载gitea的镜像.以及导致action runner无法正常使用.这些问题不在本文的介绍范围内.请读者知悉.

我为什么要写这篇文章:

- 作为一个崇尚devops的开发者,我希望我的开发环境尽可能的自动化
- 出于对分享的欲望,减少新朋友摸索时间
- 出于功利的需要:找工作展示用

### 你需要具备的知识储备

要完全理解本文所描述的内容,你需要具备以下知识储备:

  - Linux操作系统经验
  - 知道并理解docker/podman rootless概念
  - 知道并理解docker volume/podman volume概念和作用
  - 明白act runner是什么
  - 了解systemd
  - 了解gitea/github
  - 熟悉github actions/gitea actions
  - 理解unix socket
  - 熟悉wsl



## 主要内容

本文主要内容是如何使用podman部署一个rootless的gitea systemd服务,并且注册一个act_runner到gitea服务,并在使用systemd的fedora server 41的 wsl2 虚拟机上注册一个act_runner服务,使虚拟机开启自动act runner,并在gitea成为可用的action runner.

至于本文为什么要使用rootless,是因为我不想遇到令人讨厌的selinux问题 :)





## 环境说明

信息技术随着时间的推移,会导致软件运行/部署的最佳实践发生变化.因此说明一下文章的环境,以供参考.

### 硬件环境


1. 康奈信/intel n100/4网口小主机2024年款(用于运行gitea rootless容器)
2. 家庭宽带/ipv6网络(常用端口已被运营商防火墙拦截)
3. 机械革命无界14x 2024年笔记本(用于开发,并在wsl2中运行act runner 服务)


### 软件版本 & 第三方服务

1. cloudflare dns服务
2. 阿里云dns服务
3. windows wsl2(用于运行actions runner)

   ```powershell
   wsl --version
   ```

   ```text
    WSL 版本： 2.4.12.0
    内核版本： 5.15.167.4-1
    WSLg 版本： 1.0.65
    MSRDC 版本： 1.2.5716
    Direct3D 版本： 1.611.1-81528511
    DXCore 版本： 10.0.26100.1-240331-1435.ge-release
    Windows 版本： 10.0.26100.3624
   ```

4. podman

   ```bash
   # podman --version
   ```

   ```text
     podman version 5.4.1
   ```
5. 服务器系统信息
   
   ***运行gitea的服务器系统信息***
   
   ```bash
   # cat /etc/os-release
   ```

   ```text
    NAME="Fedora Linux"
    VERSION="41 (Server Edition)"
    RELEASE_TYPE=stable
    ID=fedora
    VERSION_ID=41
    VERSION_CODENAME=""
    PLATFORM_ID="platform:f41"
    PRETTY_NAME="Fedora Linux 41 (Server Edition)"
    ANSI_COLOR="0;38;2;60;110;180"
    LOGO=fedora-logo-icon
    CPE_NAME="cpe:/o:fedoraproject:fedora:41"
    HOME_URL="https://fedoraproject.org/"
    DOCUMENTATION_URL="https://docs.fedoraproject.org/en-US/fedora/f41/system-administrators-guide/"
    SUPPORT_URL="https://ask.fedoraproject.org/"
    BUG_REPORT_URL="https://bugzilla.redhat.com/"
    REDHAT_BUGZILLA_PRODUCT="Fedora"
    REDHAT_BUGZILLA_PRODUCT_VERSION=41
    REDHAT_SUPPORT_PRODUCT="Fedora"
    REDHAT_SUPPORT_PRODUCT_VERSION=41
    SUPPORT_END=2025-12-15
    VARIANT="Server Edition"
    VARIANT_ID=server
   ```

  ***actions runner 所在 wsl2 虚拟机系统信息***

  ```bash
  # cat /etc/os-release
  ```

  ```text
  NAME="Fedora Linux"
  VERSION="41 (Container Image)"
  RELEASE_TYPE=stable
  ID=fedora
  VERSION_ID=41
  VERSION_CODENAME=""
  PLATFORM_ID="platform:f41"
  PRETTY_NAME="Fedora Linux 41 (Container Image)"
  ANSI_COLOR="0;38;2;60;110;180"
  LOGO=fedora-logo-icon
  CPE_NAME="cpe:/o:fedoraproject:fedora:41"
  DEFAULT_HOSTNAME="fedora"
  HOME_URL="https://fedoraproject.org/"
  DOCUMENTATION_URL="https://docs.fedoraproject.org/en-US/fedora/f41/system-administrators-guide/"
  SUPPORT_URL="https://ask.fedoraproject.org/"
  BUG_REPORT_URL="https://bugzilla.redhat.com/"
  REDHAT_BUGZILLA_PRODUCT="Fedora"
  REDHAT_BUGZILLA_PRODUCT_VERSION=41
  REDHAT_SUPPORT_PRODUCT="Fedora"
  REDHAT_SUPPORT_PRODUCT_VERSION=41
  SUPPORT_END=2025-12-15
  VARIANT="Container Image"
  VARIANT_ID=container
  ```

## gitea 服务创建与启动

使用podman创建gitea容器,并使用`podman generate systemd`生成systemd服务,以保证rootless容器可以在开机时启动

### 一. 创建gitea容器前的准备

准备的主要内容是创建volume,用于持久化储存 gitea 的服务数据和配置信息,以保证在下次启动时能按照预定的行为工作,此为第一步

***创建 gitea 的数据卷***

**注意:**

使用非Linux root用户(rootless)创建的卷位于`~/.local/share/containers/storage/volumes/`目录下

```bash
$ podman volume create gitea-data
```

***创建 gitea 的配置卷***

```bash
$ podman volume create gitea-config
```

***设置运行gitea服务的rootless用户为退出登录不释放服务***

此步骤需要具备sudo用户操作,并且假设你运行gitea服务的用户为`rootless`

```bash
sudo loginctl enable-linger rootless
```

恢复该用户的命令

```bash
sudo loginctl disable-linger rootless
```

### 二. 创建 gitea rootless 容器

```bash
podman create --network=podman  --name=gitea -p 4111:3000 -p 3333:2222   -v gitea-data:/var/lib/gitea -v gitea-config:/etc/gitea docker.io/gitea/gitea:nightly-rootless
```

当你看到以下结果,说明创建已经完成了

```text
Trying to pull docker.io/gitea/gitea:nightly-rootless...
Getting image source signatures
Copying blob 561758e8efd9 done   |
Copying blob 28d637b77a87 done   |
Copying blob f18232174bc9 done   |
Copying blob ad1bba3d303e done   |
Copying blob 41d8d3b2d530 done   |
Copying blob c33978c54aa9 done   |
Copying blob dc4dcdbb4ee3 done   |
Copying blob e757b93cf787 done   |
Copying blob 77c447ba00d5 done   |
Copying blob 4f4fb700ef54 done   |
Copying config cb13222ae9 done   |
Writing manifest to image destination
e711dfe6681d2ab51c825cee8ef7ebf232ea808cbaa881e96736a016e7147d28
```

如果你已经拉取过镜像,那么可能看到的运行结果只是容器的id,就跟前文引用的输出最后一行一样

这使用创建而不使用运行的主要原因是,podman generate systemd仅需容器的配置信息.当然如果你使用podman run也是可以的,podman 一样能生成systemd服务

### 三. 生成systemd服务文件

接下来,可以使用`podman generate systemd`命令生成systemd服务文件

这里需要注意的是,systemd的用户服务存在于`$HOME/.config/systemd/user/`目录下,此为[systemd用户服务](),因此这里需要确保存在这个目录

```bash
$ mkdir -p $HOME/.config/systemd/user
$ cd $HOME/.config/systemd/user
```


然后使用`podman generate systemd`命令生成systemd服务文件

```bash
podman generate systemd --name gitea --new --files --name gitea
```
你会看到类似的输出

```text

DEPRECATED command:
It is recommended to use Quadlets for running containers and pods under systemd.

Please refer to podman-systemd.unit(5) for details.
/home/<your account>/.config/systemd/user/container-gitea.service
```

说明service文件已经在当前目录下生成了一个 systemd 的 unit 文件

### 四. 使用 systemctl 启动服务

因为才创建服务,需要重新加载systemd配置

```bash
$ systemctl --user daemon-reload
```

然后使用`systemctl`命令启用并启动服务

```bash
$ systemctl --user enable --now container-gitea.service
```

### 五. 验证服务是否正常运行

使用`systemctl`命令查看该服务是否启动

```bash
$ systemctl --user status container-gitea.service
```

使用`podman ps`命令查看容器是否正常运行

```bash
$ podman ps
```

### 六. 配置gitea服务

如果以上步骤都正常,那么说明gitea服务已经成功创建,并可以正常运行.

接下来使用gitea web初始化页面`http://<your domain>:4111`,完成gitea服务初始化


请注意,通过访问4111端口访问是前文启动容器的命令`-p 4111:3000`指定的,如果读者在按照本文的步骤进行操作时,使用了其他端口或者通过其他代理服务访问gitea,那么应该按照自身实际情况访问.



#### 1. 基础URL

如果`基础URL`表单项填写不正确,那么可能会在登陆页面看到如下错误:


<figure>
<img title="url不匹配" alt="url not match" src="/blogs/gitea/root-url-not-match.png"/>
<figcaption style="text-align:center;">此警告说明您实际访问的地址和您配置`基础URL`表单项的地址不匹配.会导网页界面/邮件内容/web通知hook/OAuth2的url连接错误.</figcaption>

</figure>


<figure>
<img title="url协议不匹配" alt="url protocol not match" src="/blogs/gitea/root-url-protocol-not-match.png"/>
<figcaption style="text-align:center;">此警告表明您配置的基础URL使用的https,但是您通过http访问,可能导致登录问题</figcaption>

</figure>



`基础URL`表单项需要根据你的实际环境填写,假设你将gitea部署到`https://example.com`,那么这里需要填`https://example.com`.如果你将gitea服务使用代理服务,那么这里应该填写代理服务的地址.例如nginx代理服务器代理的地址是`https://gitea.example.com:5554`,那么这里就应该是`https://gitea.example.com:5554`

假设你没有注意到这些选项.直接点击最底部的安装按钮,可能就无法再次进入到web初始化页面了.


那么可以通过进入到容器环境中直接修改配置文件,在容器中配置文件的路径为`/etc/gitea/app.ini`.

```bash
$ podman exec -it gitea vi /etc/gitea/app.ini
```

也可以通过编辑在物理机中储存卷中修改,在`~/.local/share/containers/storage/volumes/gitea-config/_data/app.ini`中修改`server`下的`ROOT_URL`参数,参数的值需要和您实际访问gitea服务的http(s)地址一致.这样您就不会在登录页面看到警告了.

值得注意的是,当您以非root账户(当前登录 Linux 账户)编辑`~/.local/share/containers/storage/volumes/gitea-config/_data/app.ini`,你会发现`~/.local/share/containers/storage/volumes/gitea-config/_data/`目录的所属用户和所属组是一个id,这是linux namespace的原因,此用户id和用户组并非是物理机上真实存在的.你需要使用sudo编辑它(如果你有sudo权限的话),否则就进入容器中编辑配置文件.


#### 2. SSH 服务端口

如果你需要使用ssh服务克隆端口的情况下,需要特别注意`SSH 服务端口`表单项.此项表示在使用gitea仓库时,通过ssh方式克隆仓库时的提示信息.根据前文创建容器到物理机ssh的映射`-p 3333:2222`,这里需要填3333,因为容器暴露的端口是3333,而不是2222.


与基础URL配置错误一样,如果你没有注意到该项,直接点击了最底部的安装按钮,可以通过进入容器内编辑 `/etc/gitea/app.ini` 文件,修改`[server]`下的`SSH_PORT`变量.创建容器时已经指定为`3333`,所以将此项设置为`3333`即可,否则无法使用ssh推送/拉取仓库.



#### 3. 其他配置/注意事项

其他的配置均为容器内的配置.和仓库拉取推送无关的配置,可以根据个人需要进行修改.

如果您的服务器开启了firewall,请不要忘记开启您的gitea服务监听的端口,以保证gitea服务可用

```bash
$ sudo firewall-cmd --permanent --zone=public --add-port=4111/tcp
$ sudo firewall-cmd --permanent --zone=public --add-port=3333/tcp
$ sudo firewall-cmd --reload
```
以上命令中--zone的参数值,需要根据gitea服务发布的网络域/网络接口
检查防火墙是否通过了指定端口

```bash
sudo firewall-cmd --zone=public --list-ports
```

最后,如果编辑过gitea配置文件,需要重启gitea服务,以使配置生效.

```bash
$ systemctl --user restart container-gitea.service
```











## actions runner

简单来说,actions runner用来运行CI/CD.

我从最开始听到DevOps,到了解DevOps,到对DevOps感到疑惑,到接触到DevOps,到理解DevOps,到部署DevOps,到支持宣传DevOps.整个过程花了不少时间,总之,体会到devOps后就再也回不去了,用常见的概念来说:激发生产力进步的方式就是懒.


gitea可以支持 github 服务的actions概念,虽然少部分功能[不和github对齐](https://docs.gitea.com/zh-cn/usage/actions/comparison).但是能用github的所有actions它不香嘛?


### 一. 在哪里部署actions runner


***actions runner和gitea部署在一起可以嘛?***

actions runner通常用来运行编译,执行前端打包,执行测试,部署等任务.通常这些任务需要较多的资源,因此为了不影响gitea服务,建议将actions runner部署在另外的服务器上.
因为本人部署的gitea服务器仅供学习使用,又为了模拟真实的使用场景.所以我将actions runner部署在wsl2虚拟机上.

这么做有两个原因,我通常做自己的项目,在编写自己的项目时,通常我的笔记本wsl2是启动着的,因为一定会使用:没错,我开发时使用的Linux虚拟机环境开发代码

***actions runner以什么方式运行***

因为actions runner通常运行需要构建容器镜像的任务,又因为现在rootless的概念比较新颖,根据[deepseek v3](https://www.deepseek.com/)的问答:


**Q**: rootless的概念提出是什么时候,在现有的资料中,人们对rootless的了解和认知普遍吗

**A**: 

1. **起源时间**: rootless容器技术最早由Docker在2019年正式提出并实现
2. **认知普及度**:
   - 目前在技术社区中认知度正在提高
   - 主要流行于容器技术(Docker/Podman)和安全领域
   - 普通开发者可能不太熟悉，但DevOps和安全工程师普遍了解
3. **现有资料**:
   - 官方文档较详细
   - 技术博客和会议分享逐渐增多
   - 中文资料相对较少

因此在实际运行actions runner时,使用到的job大概率需要rootful(以root运行job),即使你不构建容器镜像:如果你想构建容器镜像,那么docker的action就需要以root身份的容器引擎,我暂时没有找到rootless版本的容器镜像构建actions.
所以需要将actions runner部署在root账户下.
以保证绝大多数actions能正常运行,做到大部分环境的兼容.


gitea 官方提供了多种方式运行actions runner,[文档](https://docs.gitea.com/zh-cn/usage/actions/quickstart)中表明可以在容器中运行actioin runner,
也可以在物理机上运行actions runner,此处我将在wsl2虚拟机上直接使用系统service注册actions runner(主要是以docker方式运行更复杂)

### 二. 为actions runner准备运行环境

因为本文主要介绍podman.以podman替换docker环境,同时:根据podman的官方文档,提供了podman在Windows上安装的方法,其中安装时并非真实安装于Windows,
而是将podman安装于wsl2虚拟机中,因此安装podman实际上是安装了一个wsl2的fedora server发行版.我接受新安装一个虚拟机,这可以避免共用虚拟机,环境做到隔离

所以我不拒绝使用 podman 官方 提供的方式安装在Windows上安装podman,毕竟我也很喜欢wsl2

安装方法和正常安装Windows软件一致.具体可以参考在Windows上安装podman的[官方文档](https://github.com/containers/podman/blob/main/docs/tutorials/podman-for-windows.md).


### 三. actions runner注册

1. 在gitea官方提供的[连接](https://dl.gitea.com/act_runner/)中,下载带有linux-amd64的actions runner二进制文件
2. 将二进制文件移动到podman所在的wsl2虚拟机的`/usr/local/bin/`目录下
   在放进去后,最好检查命令是否正常运行
   ```bash
   sudo act_runner --version
   ```
3. 使用该二进制生成默认配置文件
   
   选择`/etc/gitea/act_runner/config.yaml`这个位置,是因为在wsl2虚拟机创建service unit时,符合目录规范
   ```bash
   sudo act_runner generate-config > /etc/gitea/act_runner/config.yaml
   ```
4. 在gitea实例[获得 runner 注册 token](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E8%8E%B7%E5%8F%96%E6%B3%A8%E5%86%8C%E4%BB%A4%E7%89%8C)
5. [注册runner](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E6%B3%A8%E5%86%8Crunner)
   ```bash
   sudo cd /etc/gitea/act_runner
   sudo act_runner register --no-interactive --instance <instance_url> --token <registration_token> --name <runner_name>
   ```
   - 为什么需要cd到`/etc/gitea/act_runner`目录下:因为需要调整`config.yaml`中的runner的file字段需要指定.runner的绝对路径.
   - 为啥指定.runner的绝对路径:因为systemd运行的WorkingDirectory指定为`/var/lib/gitea`,但是systemd运行的目录放置.runner又不符合系统目录规范,因此在`config.yaml`中制定了runner的.runner文件绝对位置为`/etc/gitea/act_runner/.runner`
   - `instance_url`即表示`gitea`实例的地址,例如`https://gitea.example.com:5554`,`registration_token`即为上一步获得的token,runner_name即为runner的名称,可以自定义,例如`podman.wsl`
  
### 四. 创建service unit

在所有准备工作完成后,需要创建systemd service unit

```bash
sudo vim /usr/lib/systemd/system/act_runner.service
```

文件内容如下

```ini
[Unit]
Description=Gitea Actions runner
Documentation=https://gitea.com/gitea/act_runner
After=podman.service

[Service]
ExecStart=/usr/bin/act_runner daemon --config /etc/gitea/act_runner/config.yaml
ExecReload=/bin/kill -s HUP $MAINPID
WorkingDirectory=/var/lib/gitea
TimeoutSec=0
RestartSec=10
Restart=always

[Install]
WantedBy=multi-user.target
```

注意:
- execstart中的`/usr/bin/act_runner`需要确保命令和config位置的参数,否则极有可可能无法正常运行
- workingdirectory的path需要手动创建
  ```bash
  sudo mkdir -p /var/lib/gitea
  ```

### 五. 启动service

前面步骤完成后,需要重新加载systemd配置,并启动service

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now act_runner.service
```

检查service是否正常运行

```bash
sudo systemctl status act_runner.service
```



## 使用actions runner

正如gitea 官方文档中说的,actions runner兼容github actions,因此,可以按照github的actions编写workflow 文件,放到仓库下,即可正常激活gitea actions runner.


## 个人困惑和理解

### 实践过程中对官方文档中的描述个人理解
 
 官方文档中一直有两次强调在docker中运行job:
 - [快速入门](https://docs.gitea.com/zh-cn/usage/actions/quickstart#%E8%AE%BE%E7%BD%AErunner)
 - [act runner](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E8%A6%81%E6%B1%82)

这两处强调在docker中运行job,实际上就是说的act runner注册时的labels参数,或者叫config.yaml中的labels参数.
通读后需要整理下才能理解,这个强调具体指是jobs的运行,而不是gitea actions runner服务本身.
这点让我十分困惑,当时初看的时候以为gitea-runner负责运行所有的job,否则容易看得不明所以,实际上gitea actions runner在运行jobs时,会根据runs-on的label来选择,这个label没有那么简单,具体参考[官方描述](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E6%A0%87%E7%AD%BE)

其次,github的actions仓库大部分都是使用typescript写的,因此,runner的label第二部分不论是使用host还是docker都至少支持nodejs才对.而nodejs生态可选的东西就可多了


为什么什么也不需要做,就能在gitea actions runner中运行docker的镜像构建命令 :) :
podman作为新一代容器,在尊重传统docker容器上也下了功夫,至于为什么在只有podman容器的wsl2虚拟机上,也能正常运行docker的镜像构建命令,是因为docker的actions构建镜像的方式是使用docker的socket套接字实现的.
因为podman完全通过模拟docker的套接字实现运行docker的构建镜像actions.同样docker的构建镜像actions是使用nodejs和套接字通信的.关于unix soket可以自行搜索相关文章.