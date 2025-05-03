# windows subsystem for linux(WSL)

我所工作过的公司大部分开发者都是使用windows,仅仅遇到过两个不用Windows开发的,一个使用arch linux 的衍生版,一个使用mac 小主机 :)

我就喜欢linux,主要是耳濡目染,加上linux确实很好用,遇到问题都能找到解决办法,但是Windows就会出现有些很神奇的事情,或者一些莫名其妙的异常错误.
我最不能接受的就是文件不区分大小写(我知道可以配置).

wsl成为我开发过程中不可或缺的一部分. 


[[toc]]


## 本文撰文环境

信息技术随着时间的推移，会导致软件运行/部署的最佳实践发生变化。说明一下文章内容的产生环境，以供参考。

1. 本文主体内容基于 hyper-v Windows 11 开发环境
2. 物理机环境:Windows 11 pro(24h2)


## 说明

要流畅阅读本文,读者需要具备以下知识储备

- 具备操作系统实践经验
- 具备常见GUN/Linux操作系统实践经验
- 了解GUN/Linux系统及其常见发行版




关于本文中命令行, 如果没有 `sudo` 开头, 则表明该命令行只是一个普通用户的命令行, 而不是 root 用户的命令行。

假设你看到 `sudo` 开头, 则表明需要一定的超级用户的权限, 当然你不使用 `sudo`, 使用 root 用户登录后, 去掉 `sudo` 你也可以生效

## 参考资料

- [官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/)



## 一. 启用 WSL 功能{#enable-wsl }

[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)有相对详细的具体描述,如果感兴趣可以查看,但是本文出于个人经验和踩坑历程,和官方文档中介绍顺序稍有不同

### 使用`启用或关闭Windows功能`启用wsl

通过Windows搜索功能,搜索`启用或关闭Windows功能`, 勾选`适用于 Linux 的 Windows 子系统` 和 `Virtual Machine Platform`

完毕后根据建议重启系统.

### 更新wsl

一般来说,初始系统中的wsl版本相对较旧,可能也就低于当前最新版 1 - 2 个子版本.

在准备好安装wsl虚拟机前,最好使用powershell更新下wsl本身

```powershell
wsl --update
```

然后再通过wsl安装虚拟机 :)




## 二. 安装Linux发行版虚拟机


根据[官方教程](https://learn.microsoft.com/zh-cn/windows/wsl/install),Windows 10 版本 2004 及更高版本（内部版本 19041 及更高版本）或 Windows 11 后,执行下面的powershell命令即可

```powershell
wsl --install
```

此行命令会默认安装Ubuntu发行版,根据[文档1](https://learn.microsoft.com/zh-cn/windows/wsl/install#install-wsl-command)和[文档2](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment#get-started)最新版本描述:会自动安装虚拟机所需要的拓展(启用或关闭Windows功能).

本文写作的必要原因在于,大部分Windows直接执行上面命令大概率会产生无法理解的错误,比如教程第一小节所说的,可能需要重启 😂. 根据之前的经验折磨怕了,
所以建议先通过[启用WSL功能](#enable-wsl)后,根据提示 重启Windows物理机系统, 然后通过wsl安装Linux发行版虚拟机. 


在本文撰写前些日子,wsl实际使用上还有不少坑. 不过截至目前已经修复得差不多了, 读者遇到问题或多或少可以在官方文档中找到解决办法,所以不用太担心

接下来通过msstore或powershell安装GUN/Linux发行版到wsl中

### 在msstore安装

直接搜索wsl,会有相应的发行版内置在商店中,如果安装自定义的发行版,可能相对来说比较麻烦,一般msstore的发行版都已经按照最佳实践配置好了,只需要启动时设置一下账号密码都能正常使用

### 在powershell中安装

通过powershell,只需要执行

```powershell
wsl --install 
```

此命令行将默认安装ubuntu的发行版


### 已安装Linux发行版,但无法启动

如果你在官方文档中找不到任何依据的安装我呢提,可能还需要

- 设置bios开启虚拟化(此功能在支持的机器上基本默认开启,除非个人修改过 🧐)



## 三. 我常用的设置

### 一. 启用systemd

如果你通过powershell/msstore安装,一般会自动配置了wsl使用systemd.但是如果通过第三方,或者遇到了msstore或者wsl命令行安装的wsl虚拟机,没有预配置systemd启动,需要在 Linux发行版虚拟机内,
编辑/etc/wsl.conf,此文件为toml格式文件,在文件中写入

```toml
[boot]
systemd=true
```

保存后重启Linux虚拟机即可

```powershell
wsl -t <Distro Name> # 终止Distro Name(单个)虚拟机
```

```powershell
wsl --shutdown # 终止所有的wsl虚拟机
```

### 二. 安装cargo

***安装rustup工具包***

cargo可以通过rust工具链管理工具rustup管理,所以优先使用rustup管理cargo,以便于后续升级

```bash
sudo apt install rustup
```

***通过rustup初始化cargo环境***


```bash
rustup toolchain install stable
```

如果以上安装太慢,可以在搜索引擎中搜索


```text
rustup mirror proxy ustc
```

这里我直接贴出toolchain的环境变量设置

安装工具链时使用的环境变量

```bash
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
```


更新工具链时使用到的环境变量

```bash
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
```

***通过cargo安装fnm***

fnm的[GitHub仓库](https://github.com/Schniz/fnm)有详细的说明. 再通过cargo 安装fnm需要提前安装 cmake 开发工具集,否则将出现编译失败的错误

当然我也在[博客](/blogs/about-fnm)中介绍过fnm,其作为本人必备的nodejs管理工具.

***通过cargo安装deno***

 我在[使用cargo安装deno](/blogs/install-deno)中详细描述了安装构成,本文不在赘述
 deno使用rust构建,内置typescript支持,能直接运行ts程序,无需编译,且尽量往浏览器原生api靠拢(后证明此行为可能导致开发者难以区分浏览器或服务器的宿主环境,部分api向nodejs靠拢了 QAQ)

***启用镜像网络***

为什么要启用[镜像网络](https://learn.microsoft.com/zh-cn/windows/wsl/networking#mirrored-mode-networking)?

早期wsl不支持镜像网络模式时,wsl实际上运行在一个nat网络中, 要想通过物理机所在的网络访问到wsl虚拟机中十分麻烦, 如果不了解Windows,那么多半阅读了好几篇`'大神'`的文章也不明所以, 即使如此,其高效的I/O操作,也让其相对Windows开发来说,也极具竞争力

有了镜像网络,你基本可以通过访问物理机的方式访问wsl内部的虚拟机, 不需要网络端口转发或者nginx代理之类的, 极大方便需要团队协作的网络情况. 当初也是被折磨了一段时间, 一度曾想放弃wsl, 因为有人要访问我正在开发的web应用.....

值得一提的是, 就算开启了镜像网络, 相同网络环境下的还是无法访问到物理机中的wsl虚拟机,根据[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/networking#mirrored-mode-networking)的备注,还需要超级管理员执行以下powershell命令

```powershell
Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
```

## 四. 在使用过程中遇到的坑

### 一. 有关podman-desktop安装时与clash-verge配合使用

如果你使用了clash-verge,即使你关闭了, 那么wsl中的虚拟机也会受到相应的影响.

入坑办法: 先启动clash-verge,再安装podman-desktop,此时安装过程中,podman-desktop会获取clash-verge,配置,并写入到以下文件中


1. `/etc/environment.d/default-env.conf`
2. `/etc/profile.d/defaut.env.sh`
3. `/etc/systemd/system.conf.d/default-env.conf`


导致每次我启动虚拟机时,即使没有开启clash-verge,也会导致环境变量中存在http-proxy和https-proxy, 如果对Linux的shell启动时执行哪些脚本,就会导致一时找不到问题所在


