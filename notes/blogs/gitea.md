---
outline: [2,3]
---
# 关于 Gitea 二三事

为什么想要自己搭建一个私人仓库，而不是使用 GitHub、GitLab、码云这些已有的公认仓库呢？

主要原因还是在于那段时间出现了一些政治因素，看到有些仓库被封锁，无法访问。虽然我不是什么政治犯，但也心存芥蒂。

最开始我是想用 GitLab 构建一个私人仓库的。为什么将 GitLab 作为第一选择？大概是因为受到了我工作过的公司：`成都中联信通科技股份有限公司` 的启影响: 他们使用 GitLab + Jenkins 做的自动化构建部署。

受到其带来的便利性和启发后，也部署了 GitLab 服务，并尝试使用 GitLab 内置的 CI/CD。

最后经过几番折腾，还是因为几点原因选择了 Gitea：

- **GitLab 占用资源很大**，什么也不做就占用内存达到 `3G`，Gitea 占用资源很小才 `100mb` 出头
- **GitLab 的 CI/CD 为自研**，没有利用到已有的 CI/CD 资源，Gitea 能直接利用 GitHub 的 CI/CD 资源
- **功能繁多且庞大**，这是它占用计算资源多的原因，但是对我的需求来说，Gitea 足够了

相对 GitLab，Gitea 也有缺点：
- **配置文件多**，相对于 GitLab 配置文件集中来说
- **社区比 GitLab 小**
- **功能相对基础**

目前来说，我更喜欢麻雀虽小，五脏俱全的 Gitea，而不是功能繁多庞大的 GitLab。

[[toc]]

## 说明

在阅读本文前，有必要阅读关于本文撰写的前提概况，否则很有可能因为环境或者对某些概念不熟悉，造成理解上的困难。对每一个术语或者概念，我会尽可能提供外部连接，在你不理解这个概念的情况下，可以通过文中提供的连接去查看。有关概念非常多，DevOps 新手会遇到很多问题，花的时间也很长（我摸索了大半个月），但这些时间花出去却是必要的。

本文假设读者喜欢并认同 systemd、WSL、podman rootless. 这是本文区别于很多文章的基石和基本动机，以及本文产生的结果。

另外本文需要你具备科学上网的环境，否则无法下载 Gitea 的镜像， 还有导致 Gitea Actions Runner 无法正常运作。这些问题不在本文的介绍范围内，请读者知悉。

我为什么要写这篇文章：

- 作为一个崇尚 DevOps 的开发者，我希望我的开发环境尽可能的自动化
- 出于对分享的欲望，减少新朋友摸索时间
- 出于功利的需要

关于本文中命令行, 如果没有 `sudo` 开头, 则表明该命令行只是一个普通用户的命令行, 而不是 root 用户的命令行。

假设你看到 `sudo` 开头, 则表明需要一定的超级用户的权限, 当然你不使用 `sudo`, 使用 root 用户登录后, 去掉 `sudo` 你也可以生效

### 阅读前置知识储备

要完全理解本文所描述的内容，你需要具备以下知识储备：

- **Linux 操作系统经验**
- **熟练掌握 Docker/Podman volume 和 rootless 概念和作用**
- **理解 CI/CD**
- **了解 Systemd**
- **了解 Gitea/GitHub**
- **理解 Unix Socket**
- **熟悉 WSL**
- **了解 firewalld**

## 主要内容

本文主要内容是如何使用 Podman 部署一个 rootless 的 Gitea systemd 服务，并且注册一个 Gitea Actions Runner 到 Gitea 服务。并在使用 WSL2 虚拟机上运行一个 Actions Runner systemd 服务，保证虚拟机开启自动 Gitea Actions Runner，使 Gitea Actions 自动可用。

至于本文为什么要使用 rootless，是因为我不想遇到令人讨厌的 SELinux 问题 :)

## 环境说明

信息技术随着时间的推移，会导致软件运行/部署的最佳实践发生变化。说明一下文章内容的产生环境，以供参考。

### 硬件环境

1. 康奈信/Intel N100/4 网口小主机 2024 年款（用于运行 Gitea rootless systemd 容器）
2. 家庭宽带/IPv6 网络（常用端口已被运营商防火墙拦截）
3. 机械革命无界 14x 2024 年笔记本（用于开发的同时, 在 WSL2 中运行 Gitea Actions Runner service）

### 软件版本 & 第三方服务

***Cloudflare DNS 服务***
***阿里云 DNS 服务***
***Windows WSL2（用于运行 Gitea Actions Runner）***

```powershell
WSL --version
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

***podman***

```bash
podman --version
```

```text
podman version 5.4.1
```

***运行 gitea rootless 容器的服务器 (康奈信小主机) 系统信息***

```bash
cat /etc/os-release
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

***Gitea Actions Runner 所在 wsl2 虚拟机系统信息***

```bash
cat /etc/os-release
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

使用 podman 创建 gitea 容器，并设置 rootless 容器所在的 linux 系统用户 `loginctl enable-linger`，并使用 `podman generate systemd` 生成 systemd 服务，以保证 rootless 容器可以在开机时启动。

### 一. 准备工作

准备的主要内容是设置 rootless 用户 和 创建 volume，此为第一步。

***设置运行 gitea 服务的 rootless 用户***

此步骤假设当前操作用户具备 sudo 用户操作权限，并且运行 gitea 服务的用户账号为 `rootless` 通过设置 `loginctl enable-linger`, 为运行 gitea 服务的 rootless 用户退出登录时不释放服务资源。

```bash
sudo loginctl enable-linger rootless
```

恢复该用户的命令

```bash
sudo loginctl disable-linger rootless
```

***创建 gitea 的数据卷***

volume 用于持久化储存 gitea 的服务数据和配置信息，以保证在下次启动时能按照预定的行为工作。

**注意:**

使用非 Linux root 用户 (rootless) 创建的卷位于 `~/.local/share/containers/storage/volumes/` 目录下。

```bash
podman volume create gitea-data
```

***创建 gitea 的配置卷***

```bash
podman volume create gitea-config
```

### 二. 创建 gitea 容器 {#createc}

```bash
podman create --network=podman --name=gitea -p 4111:3000 -p 3333:2222 -v gitea-data:/var/lib/gitea -v gitea-config:/etc/gitea docker.io/gitea/gitea:nightly-rootless
```
> [!WAINING]
> 此处需要特别注意, 容器镜像名称必须带有 host, 否则将影响下文后续操作

当你看到以下结果，说明创建已经完成了

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

这使用创建而不使用运行的主要原因是，podman generate systemd 仅需容器的配置信息。当然如果你使用 podman run 也是可以的，podman 一样能生成 systemd 单元服务文件。

### 三. 生成 systemd 配置 {#generated}

接下来，可以使用 `podman generate systemd` 命令生成 systemd 服务文件。

这里需要注意的是，systemd 的用户服务存在于 `$HOME/.config/systemd/user/` 目录下，此为 systemd 用户级别服务目录，因此这里需要确保存在这个目录。

```bash
mkdir -p $HOME/.config/systemd/user
cd $HOME/.config/systemd/user
```

然后使用 `podman generate systemd` 命令生成 systemd 服务文件。

```bash
podman generate systemd --name gitea --new --files
```

--name 参数指定容器名称，--new 参数指定在服务启动时是否创建新容器,仅适用于通过 podman 命令创建的容器，--files 参数指定是否生成服务文件, 否则打印到标准输出中. 

通过指定--name gitea 指定服务名称为 gitea。你会看到类似的输出

```text

DEPRECATED command:
It is recommended to use Quadlets for running containers and pods under systemd.

Please refer to podman-systemd.unit(5) for details.
/home/<your account>/.config/systemd/user/container-gitea.service
```

说明 service 文件已经在当前目录下生成了一个 systemd 的 unit 文件。

### 四. systemctl 启动服务

因为才创建服务，需要重新加载用户级别 systemd 配置, 其中 `--user` 参数指定用户级别 systemd。因为此处的`gitea服务是用户级别的, 非root级别的`.

```bash
systemctl --user daemon-reload
```

然后使用 `systemctl` 命令启用并启动服务。

```bash
systemctl --user enable --now container-gitea.service
```

> [!WARNING]
> 在[创建容器](#createc)时, 镜像名称必须包含 host 部分, 否则此处将无法启动
> 原因是在[生成 systemd 服务文件](#generated)时, 通过 `--new` 参数, 即每次启动服务时都会创建新的容器.
> 创建新的容器意味着会拉取镜像, 如果不包含host, 在主机上配置了多个 registry 时, 将不确定拉取到了哪个 host 的镜像, 会导致潜在的黑客攻击.


### 五. 验证服务状态

使用 `systemctl` 命令查看该服务是否启动

```bash
systemctl --user status container-gitea.service
```

也可以使用 `podman ps` 命令查看容器是否正常运行

```bash
podman ps
```

### 六. 配置 gitea 服务

如果以上步骤都正常运行，那么说明 gitea 服务已经成功创建并正常运行。

接下来使用 gitea web 初始化页面 `http://<your-domain or ip-address>:4111`，完成 gitea 服务初始化。

> [!INFO]
> 通过 4111 端口访问, 是由[创建容器](#createc)命令 `-p 4111:3000` 参数指定的，
> 如果读者在按照本文的步骤进行操作时，使用了其他端口或者通过其他代理服务访问 gitea，那么请根据自身实际情况访问。

::: info
如果无法访问，可以检查端口是否正确映射，或者检查防火墙是否放行
:::

在 gitea web 初始化页面, 有两个表单项值得注意:

#### 1. 基础 URL

如果 `基础 URL` 表单项填写不正确，那么可能会在登陆页面看到如下错误：

<figure>
<img title="url 不匹配" alt="url not match" src="/blogs/gitea/root-url-not-match.png"/>
<figcaption style="text-align:center;">此警告说明您实际访问的地址和您配置 `基础 URL` 表单项的地址不匹配。会导网页界面/邮件内容/web 通知 hook/OAuth2 的 url 连接错误。</figcaption>

</figure>

<figure>
<img title="url 协议不匹配" alt="url protocol not match" src="/blogs/gitea/root-url-protocol-not-match.png"/>
<figcaption style="text-align:center;">此警告表明您配置的基础 URL 使用的 https，但是您通过 http 访问，可能导致登录问题</figcaption>

</figure>

`基础 URL` 表单项需要根据您的实际环境填写，假设您将 gitea 部署到 `https://example.com`，那么这里需要填 `https://example.com`。如果您将 gitea 服务使用代理服务，那么这里应该填写代理服务的地址。例如 nginx 代理服务器代理的地址是 `https://gitea.example.com:5554`， 那么`基础URL`就应该是 `https://gitea.example.com:5554`。

假设您没有注意到这些选项。直接点击最底部的安装按钮，可能就无法再次进入到 web 初始化页面了。

这里也不用着急, 可以通过进入到容器环境中直接修改配置文件，在容器中配置文件的路径为 `/etc/gitea/app.ini`。

```bash
podman exec -it gitea vi /etc/gitea/app.ini
```

在编辑器中修改 `server` 下的 `ROOT_URL` 参数，参数的值需要和您实际访问 gitea 服务的 http(s) 地址一致。这样您就不会在登录页面看到警告了。

#### 2. SSH 服务端口

如果您需要使用 gitea 提供的 ssh 仓库克隆服务的情况下，需要特别注意 `SSH 服务端口` 表单项。此项表示在使用 gitea 仓库时，仓库 web ui 界面用于提示使用, 通过 ssh 克隆选项下一定会使用该配置。根据前文创建容器时指定的端口映射 :  `-p 3333:2222`，因此这里需要填 `3333`，因为容器暴露的端口是 `3333`，而不是 2222。否则无法使用 ssh 协议克隆仓库。

与基础 URL 配置错误一样，如果您没有注意到该项，直接点击了最底部的安装按钮，可以通过进入容器内编辑 `/etc/gitea/app.ini` 文件，修改 `[server]` 下的 `SSH_PORT` 变量。

::: info

##### 配置文件在物理机上的位置
gitea 默认配置文件 位于 物理机 `~/.local/share/containers/storage/volumes/gitea-config/_data/app.ini` 文件中, 在创建容器时, 此文件已经位于容器卷 `gitea-config` 中。直接编辑此配置文件需要 sudo 权限, 但我并不推荐这么修改, 更推荐通过进入容器中编辑配置文件:
```bash
podman exec -it gitea vi /etc/gitea/app.ini
```
至于为什么, 通过仔细观察你会发现，物理机下的 `~/.local/share/containers/storage/volumes/gitea-config/_data/` 目录的所属用户和所属组是一个 id，这是 Linux namespace 的原因，此用户 id 和用户组在物理主机的用户列表上并不存在。

:::

#### 3. 其他配置

其他的配置均为容器内的配置。和仓库拉取推送无关的配置，可以根据个人需要进行修改。

#### 4. QA
如果您的服务器开启了 firewall，请不要忘记开启您的 gitea 服务监听的端口，以保证 gitea 服务可用

```bash
sudo firewall-cmd --permanent --zone=public --add-port=4111/tcp
sudo firewall-cmd --permanent --zone=public --add-port=3333/tcp
sudo firewall-cmd --reload
```

以上命令中 --zone 的参数值，需要根据 gitea 服务发布的网络域/网络接口。

**移除通行端口**

```bash
sudo firewall-cmd --permanent --zone=public --remove-port=4111/tcp
sudo firewall-cmd --permanent --zone=public --remove-port=3333/tcp
```

检查防火墙是否通过了指定端口

```bash
sudo firewall-cmd --zone=public --list-ports
```

最后，如果编辑过 gitea 配置文件，需要重启 gitea 服务，以使配置生效。

```bash
systemctl --user restart container-gitea.service
```

## Gitea Actions Runner

简单来说，Gitea Actions Runner 用来运行 CI/CD。

我从最开始听到 DevOps，到了解 DevOps，到对 DevOps 感到疑惑，到接触到 DevOps，到理解 DevOps，到部署 DevOps，到支持宣传 DevOps。整个过程花了不少时间，总之，体会到 DevOps 后就再也回不去了，用常见的概念来说：激发生产力进步的方式就是懒。

gitea 可以支持 github 服务的 actions 概念，虽然少部分功能 [不和 github 对齐](https://docs.gitea.com/zh-cn/usage/actions/comparison)。但是能用 github 的所有 actions 它不香嘛？

### 一. Runner 部署位置 

***Runner 和 gitea 部署在一起可以嘛？***

runner 通常用来运行编译，执行前端打包，执行测试，部署等任务。通常这些任务需要较多的资源，因此为了不影响 gitea 服务稳定正常运行，应该将 runner 部署在另外的服务器上。

因为本人部署的 gitea 服务器仅供学习使用，又为了模拟真实的使用场景。所以我将 runner 部署在 WSL2 虚拟机上。

这么做有两个原因，我通常做自己的项目，在编写自己的项目时，通常我的笔记本 wsl2 是启动着的，因为一定会使用! 因为，本人开发时大概率使用 WSL 环境。

***Runner 以什么方式 & 角色运行***

因为 runner 通常运行需要构建容器镜像的任务，又因为现在 rootless 的概念比较新颖，根据 [deepseek v3](https://www.deepseek.com/) 的问答：

::: details 查看对话
**Q**: rootless 的概念提出是什么时候，在现有的资料中，人们对 rootless 的了解和认知普遍吗

**A**：

1. **起源时间**: rootless 容器技术最早由 Docker 在 2019 年正式提出并实现
2. **认知普及度**:
   - 目前在技术社区中认知度正在提高
   - 主要流行于容器技术 (Docker/Podman) 和安全领域
   - 普通开发者可能不太熟悉，但 DevOps 和安全工程师普遍了解
3. **现有资料**:
   - 官方文档较详细
   - 技术博客和会议分享逐渐增多
   - 中文资料相对较少
:::

因此在 runner 实际运行 jobs  时，jobs大概率需要 rootful (`以 root 身份运行所有程序任务`): 即使您不构建容器镜像.
假设想构建容器镜像，那么 docker 的 action 就需要以 root 身份的容器引擎，我暂时没有找到 rootless 版本的容器镜像构建 actions。

所以需要将 runner 服务部署在 root 账户下(系统服务), 以保证绝大多数 actions 能正常运行，做到大部分环境的兼容。

gitea 官方提供了多种方式运行 runner 服务，[官方文档](https://docs.gitea.com/zh-cn/usage/actions/quickstart) 中表明可以在容器中运行 runner，也可以在物理机上运行 runner. 
此处我将在 wsl2 虚拟机上使用systemd 启动 runner 服务 (主要是以 docker 方式运行更复杂)

### 二. 准备运行环境

因为本文主要介绍 podman, 以 podman 替换 docker 环境. 为此 podman 的[官方文档](https://github.com/containers/podman/blob/main/docs/tutorials/podman-for-windows.md)提供了在 Windows 上安装 podman 的方法, 安装方法和正常安装 Windows 软件一致. 
其中安装时主要工作是安装一个命令行工具, 用于用户管理 WSL 虚拟机. 因此使用该工具安装 podman 实际上是在 wsl2 上安装了一个 fedora server 发行版。

为此我并不排斥使用 podman 官方提供的方式: 在 Windows 上安装 一个新的 wsl2 虚拟机，毕竟我也很喜欢 wsl2。

> [!WARNING]
> 此方式不是最优解, act-runner 的运行和 `docker.socket` 有关, 而podman为了兼容 docker 生态, 已经可以直接使用 `/run/podman/podman.socket` 直接替代 `/run/docker/docker.socket`. 因此是否使用podman 运行 act-runner 已经无关紧要. 

### 三. 注册 Runner 

#### 1. 下载二进制文件

- 在 gitea 官方提供的 [连接](https://dl.gitea.com/act_runner/) 中，下载带有 linux-amd64 的 actions runner 二进制文件。
- 将二进制文件移动到 podman 所在的 wsl2 虚拟机的 `/usr/local/bin` 目录下。

操作完成后，最好检查命令是否正常运行

```bash
act_runner --version
```

#### 2. 生成配置文件{#configgen}

选择 `/etc/gitea/act_runner/config.yaml` 这个位置，是因为在 wsl2 虚拟机下创建 service unit  文件时，更符合目录规范。

```bash
sudo act_runner generate-config > /etc/gitea/act_runner/config.yaml
```

该文件将后续对内容的runner部分进行调整.

#### 3. 获得注册token{#gettoken}

获得方法可以参考[官方文档](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E8%8E%B7%E5%8F%96%E6%B3%A8%E5%86%8C%E4%BB%A4%E7%89%8C)。

#### 4. 注册runner

注册本身只是通知 gitea 有一个 可执行 `CI/CD` 的主机可以用. act-runner 注册命令本身, 会产生一个 `.runner` 文件, 并在执行注册所在的目录下创建.

该文件实际说明了 act-runner 执行时所需要的 token 信息.

好了, 了解了以上信息, 就可以理解下文的所执行的命令所在的目的.

```bash
sudo cd /etc/gitea/act_runner
```
首先进入 `/etc/gitea/act_runner`, 在此处注册, 以生成 `.runner` 文件

```bash
sudo act_runner register --no-interactive --instance <instance_url> --token <registration_token> --name <runner_name>
```

**参数说明**

- `instance_url` 即表示 `gitea` 实例的地址，例如 `https://gitea.example.com:5554`，
- `registration_token` 即[在 gitea 实例 获得 runner 注册token](#gettoken)步骤中的操作获得的字符串
- `runner_name` 即为 runner 的名称，可以自定义，例如 `podman.wsl`。那么在gitea中 `runner` 列表中可以看到该名称.

**参考资料**
- [官方文档](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E6%B3%A8%E5%86%8Crunner)
- [runner作为服务运行](https://gitea.com/gitea/act_runner/src/branch/main/examples/vm/rootless-docker.md)

### 四. 调整配置文件

还记得 [生成配置文件](#configgen) 部分的内容吗? 
此处将修改runner部分的内容. 以 `保证 act-runner 能正确获得 .runner 的运行配置内容`

```yaml{8}
# .............前文忽略 
log:
  # The level of logging, can be trace, debug, info, warn, error, fatal
  level: info

runner:
  # Where to store the registration result.
  file: .runner
  # Execute how many tasks concurrently at the same time.
  capacity: 1
  # .............下文忽略 
```

找到高高亮处信息, 并修改为如下内容

```yaml{8}
# .............前文忽略 
log:
  # The level of logging, can be trace, debug, info, warn, error, fatal
  level: info

runner:
  # Where to store the registration result.
  file: /etc/gitea/act_runner/.runner
  # Execute how many tasks concurrently at the same time.
  capacity: 1
  # .............下文忽略 
```

此配置保证了 act-runner 运行是能正确获得 gitea 注册时所获得的令牌

### 五. 创建 service unit

在所有准备工作完成后，需要创建 systemd service unit。

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

> [!NOTE]
> - `ExecStart` 中确保运行 /usr/bin/act_runner `路径下存在.runner 文件` 以及 `确保 config 位置`，否则极有可能无法正常运行。
> - `workingdirectory` 的 path 需要手动创建。

指定 runner workingdirectory
因为 systemd 运行的 WorkingDirectory 指定为 `/var/lib/gitea`，但是 systemd 运行的目录放置 runner 又不符合系统目录规范，因此在 `config.yaml` 中制定了 runner 的 `.runner` 文件绝对位置为 `/etc/gitea/act_runner/.runner`。


```bash
sudo mkdir -p /var/lib/gitea
```

### 六. 启动 service

前面步骤完成后，需要重新加载 systemd 配置，并启动 service。

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now act_runner.service
```

检查 service 是否正常运行。

```bash
sudo systemctl status act_runner.service
```

## 使用 actions runner

正如 gitea 官方文档中说的，actions runner 兼容 github actions，因此，可以按照 github 的 actions 编写 workflow 文件，放到仓库下，即可正常激活 gitea actions runner。

## 实践小结



官方文档中一直有两次强调在 docker 中运行 job：

- [快速入门](https://docs.gitea.com/zh-cn/usage/actions/quickstart#%E8%AE%BE%E7%BD%AErunner)
- [act runner](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E8%A6%82%E6%B1%82)

这两处强调在 docker 中运行 job，实际上就是说的 act runner 注册时的 labels 参数，或者叫 config.yaml 中的 labels 参数。

通读后需要整理下才能理解，这个强调具体指是 jobs 的运行，而不是 gitea actions runner 服务本身。

这点让我十分困惑，初见以为 gitea-runner 负责运行所有的 job，看得摸不着头脑. 
主要困惑在于 runner 是怎么让 jobs 以一个 docker 容器运行起来的. 根据多方资料查找, 完整逻辑为：


gitea actions runner 在运行 jobs 时，会根据仓库中 workflow 文件的 job的 runs-on 的 label 来选择，这个 label 映射到具体的 runner, runner 再根据其 config.yaml 中的 labels 参数来选择 jobs 的沙箱(运行)环境，具体参考 [官方描述](https://docs.gitea.com/zh-cn/usage/actions/act-runner#%E6%A0%87%E7%AD%BE)。


当 runner 内部声明 label 为docker时,则会查找当前主机下docker socket, 并与 docker socket 进行交互, 从而以 docker socket 通信, 为 jobs 启动沙箱环境。


podman 作为新一代容器，在尊重传统 docker 容器上也下了功夫，podman 模拟 docker 服务 socket 之后，runner 通过 docker socket 的方式与 podman 通信, 并以为被 podman 模拟的 docker socket 是一个真实的 docker 服务,
因此可以启动一个容器作为 job 的沙箱环境, 而 job 自然也能拿到 runner 给与 job 的资源: `docker socket`。从而实现 job 使用actions 打包容器镜像。


TODO: 插入运行流程图



其次，github 的 actions 仓库大部分都是使用 typescript 写的，因此 runner 的 labels 第二部分不论被标识为 host 还是 docker 环境 都应至少支持 nodejs 才对, 而 nodejs 生态可供选择的资源就十分可观了.
因为 podman 完全通过模拟 docker 的套接字, gitea actions runner 服务在获得模拟的docker socket 之后, 可以在 job 的沙箱给与 docker 的相关资源, 从而实现 actions 在 job 沙箱中运行构建容器镜像的操作。同样 actions 的构建镜像 操作 是使用 nodejs 和套接字通信的。关于 unix soket 可以自行搜索相关文章。

### 参考资料

- podman与systemd:  [使用podman生成systemd服务的红帽博客](https://www.redhat.com/zh/blog/podman-run-pods-systemd-services), [podman文档](https://docs.podman.io/en/latest/markdown/podman-generate-systemd.1.html)
- [systemd文档](https://systemd.io)
- [podman rootless 导航文档](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md)
- 用户级别的systemd服务:[systemd user service](https://medium.com/@alexeypetrenko/systemd-user-level-persistence-25eb562d2ea8),[arch systemd 维基百科](https://wiki.archlinux.org/title/Systemd/User)