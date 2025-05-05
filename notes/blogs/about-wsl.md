# Windows Subsystem for Linux (WSL)

我所工作过的公司大部分开发者都是使用 Windows，仅仅遇到过两个不用 Windows 开发的，一个使用 Arch Linux 的衍生版，一个使用 Mac 小主机 :)

我就喜欢 Linux，主要是耳濡目染，加上 Linux 确实很好用，遇到问题都能找到解决办法，但是 Windows 就会出现有些很神奇的事情，或者一些莫名其妙的异常错误。
我最不能接受的就是文件不区分大小写（我知道可以配置）。

WSL 成为我开发过程中不可或缺的一部分。

[[toc]]

## 本文撰文环境

信息技术随着时间的推移，会导致软件运行/部署的最佳实践发生变化。说明一下文章内容的产生环境，以供参考。

1. 本文主体内容基于 Hyper-V Windows 11 pro (24H2)
2. 物理机环境：Windows 11 Pro (24H2)

## 说明

要流畅阅读本文，读者需要具备以下知识储备：

- 具备操作系统实践经验
- 具备常见 GNU/Linux 操作系统实践经验
- 了解 GNU/Linux 系统及其常见发行版
- 了解 BIOS 概念

关于 shell 脚本的约定：

- 没有 `sudo` 开头，则表明该命令行只是一个普通用户的命令行，区别于 root 用户执行。
- `sudo` 开头，则表明需要一定的超级用户的权限，当然，使用 root 用户登录去掉 `sudo` 后执行 shell 也是可以的。

## 一. 启用 WSL 功能 {#enable-wsl}

[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual) 有相对详细的具体描述，如果感兴趣可以查看，但是本文出于个人经验和踩坑历程，和官方文档中介绍顺序稍有不同。

### 使用 `启用或关闭 Windows 功能` 启用

通过 Windows 搜索功能，搜索`启用或关闭 Windows 功能`，然后勾选`适用于 Linux 的 Windows 子系统`和`Virtual Machine Platform`。

完毕后根据提示重启系统。

### 使用 `wsl --install` 启用

根据[官方教程](https://learn.microsoft.com/zh-cn/windows/wsl/install)，Windows 10 版本 2004 及更高版本（内部版本 19041 及更高版本）或 Windows 11 后， 使用管理员 PowerShell 执行下面的命令即可。

```powershell
wsl --install
```

此行命令会在没有启用过 WSL 功能时，用来启用 WSL 功能。

根据官方文档：[安装 WSL](https://learn.microsoft.com/zh-cn/windows/wsl/install#install-wsl-command) 和 [最佳安装实践](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment#get-started) 描述，此命令会自动安装虚拟机所需要的拓展: `适用于 Linux 的 Windows 子系统` 以及 `Virtual Machine Platform`（在 `启用或关闭 Windows 功能` 中）。

根据我之前的经验，直接执行`wsl --install`命令，可能会产生无法理解的错误，比如[官方最佳安装实践教程](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment#get-started)中就提到：`可能需要重启` 😂。所以建议先通过前文[启用 WSL 功能](#enable-wsl) 所表述第一种方式后，根据提示重启 Windows 物理机系统，然后通过 WSL 安装 Linux 发行版虚拟机。

### 更新 WSL

一般来说，初始系统中的 WSL 版本相对较旧，最多也就低于当前最新版 1 - 2 个子版本。

在准备好安装 WSL 虚拟机前，最好使用 PowerShell 更新下 WSL 本身。

```powershell
wsl --update
```

然后再通过 WSL 安装虚拟机 :)

## 二. 安装 Linux 发行版虚拟机

接下来通过 MS Store 或 PowerShell 安装 GNU/Linux 发行版到 WSL 中。

### 在 MS Store 安装

直接搜索 WSL，会有相应的发行版内置在商店中，如果安装自定义的发行版，相对来说比较麻烦，一般 MS Store 的发行版都已经按照最佳实践配置好了，只需要在MS Store中启动时，设置一下账号密码就能正常使用。

### 在 PowerShell 中安装

通过 PowerShell，只需要执行

```powershell
wsl --install 
```

你可能会有疑问，此处的`wsl --install`命令，在之前不是用来启用 WSL 功能的吗？其实，在第一次执行wsl过后，wsl命令版本就发生了变化，此处为wsl 版本发生变化后的命令行，用来安装 Linux 发行版。如果不指定发行版名称，将默认安装 Ubuntu。

### 已安装 Linux 发行版，但无法启动

如果你在官方文档中找不到任何依据的安装问题，但就是无法启动，那么可能需要检查 BIOS 设置，确保虚拟化功能开启。


:::info 关于 BIOS 设置
BIOS 中的虚拟化功能在支持的机器上基本默认开启，除非个人修改过 🧐
:::

除此以外，如果无法启动，可以尝试重启系统，或者重新安装 WSL。如果还是无法启动，请根据虚拟机启动错误找到可能的信息。

## 三. 卸载 WSL 虚拟机

### 通过 WSL 命令行安装的虚拟机

```powershell
wsl --unregister <Distro Name> 
```

### 通过 MS Store 安装的虚拟机

先通过 PowerShell 执行注销命令，

```powershell
wsl --unregister <Distro Name> 
```

然后通过 MS Store 卸载。

## 四. 我常用的设置

### 启用 systemd

如果你通过 PowerShell/MS Store 安装，一般会自动配置了 WSL 使用 systemd。但是如果通过第三方，或者遇到了 MS Store / WSL 命令行安装的 WSL 虚拟机，没有预配置 systemd 启动，需要在 Linux 发行版虚拟机内编辑 `/etc/wsl.conf` 文件，此文件为 TOML 格式文件，在文件中写入

```toml
[boot]
systemd=true
```

保存后重启 Linux 虚拟机即可。重启步骤分为两步: `终止` 和 `启动`。因为没有直接的重启命令，因此两个步骤都需要手动进行。

***终止命令***

终止 Distro Name（单个）虚拟机

```powershell
wsl -t <Distro Name>
```

终止所有的 WSL 虚拟机

```powershell
wsl --shutdown 
```

***启动命令***

启动指定名称的虚拟机：

```powershell
wsl -d <Distro Name>
```

启动默认的虚拟机：

```powershell
wsl
```

### 安装 Cargo

安装 Rustup 工具包：

`Cargo` 可以通过 `Rust` 工具链管理工具 `Rustup` 管理，所以优先使用 `Rustup` 管理 `Cargo`，以便于后续升级。

```bash
sudo apt install rustup
```

通过 Rustup 初始化 Cargo 环境：

```bash
rustup toolchain install stable
```

如果以上安装太慢，可以在搜索引擎中搜索：

```text
rustup mirror proxy ustc
```

这里我直接贴出 Toolchain 的环境变量设置。

安装工具链时使用的环境变量

```bash
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
```

更新工具链时使用到的环境变量

```bash
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
```

### 通过 Cargo 安装 fnm

fnm 的 [GitHub 仓库](https://github.com/Schniz/fnm) 有详细的说明。再通过 Cargo 安装 fnm 需要提前安装 cmake 开发工具集，否则将出现编译失败的错误。

当然我也在[博客](/blogs/about-fnm) 中介绍过 fnm，其作为本人必备的 Node.js 管理工具。

### 通过 Cargo 安装 Deno

我在[使用 Cargo 安装 Deno](/blogs/install-deno) 中详细描述了安装构成，本文不再赘述。
Deno 使用 Rust 构建，内置 TypeScript 支持，能直接运行 TS 程序，无需编译，且尽量往浏览器原生 API 靠拢（后证明此行为导致开发者混淆浏览器或服务器的宿主环境，导致部分 API 向 Node.js 靠拢了 QAQ）。

### 启用镜像网络

为什么要启用[镜像网络](https://learn.microsoft.com/zh-cn/windows/wsl/networking#mirrored-mode-networking)？

早期 WSL 不支持镜像网络模式时，WSL 实际上运行在一个 NAT 网络中，要想通过物理机所在的网络访问到 WSL 虚拟机中十分麻烦，如果不了解 Windows，那么多半阅读了好几篇`'大神'`的文章也不明所以，即使如此，其高效的 I/O 操作，也让其相对 Windows 开发来说，也极具竞争力。

有了镜像网络，你基本可以通过访问物理机的方式访问 WSL 内部的虚拟机，不需要网络端口转发或者 Nginx 代理之类的，极大方便需要团队协作的网络情况。当初也是被折磨了一段时间，一度曾想放弃 WSL，因为有人要访问我正在开发的 Web 应用。

值得一提的是，就算开启了镜像网络，相同网络环境下的还是无法访问到物理机中的 WSL 虚拟机，根据[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/networking#mirrored-mode-networking) 的备注，还需要超级管理员执行以下 PowerShell 命令：

```powershell
Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
```

## 五. 在使用过程中遇到的坑

### 有关 podman-desktop 安装时与 clash-verge 配合使用

如果你使用了 clash-verge，即使你关闭了，那么 WSL 中的虚拟机也会受到相应的影响。

入坑办法：先启动 clash-verge，再安装 podman-desktop，此时安装过程中，podman-desktop 会获取 clash-verge 的配置，并写入到以下文件中：

1. `/etc/environment.d/default-env.conf`
2. `/etc/profile.d/default.env.sh`
3. `/etc/systemd/system.conf.d/default-env.conf`

导致每次我启动虚拟机时，即使没有开启 clash-verge，也会导致环境变量中存在 http-proxy 和 https-proxy，如果对 Linux 的 shell 启动时执行哪些脚本不熟悉，就会导致一时找不到问题所在( 没错,我就不熟悉这些脚本所在的位置 )。

## 参考资料

- [官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/)
