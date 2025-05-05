# 关于 FNM

FNM 是 [Fast Node Manager](https://github.com/Schniz/fnm) 的缩写，是一个用于管理 Node.js 版本的工具，它可以帮助你快速切换和管理 Node.js 版本，而不需要手动下载和安装。

我选择它作为管理 Node.js 版本的工具，是因为它比其他工具更轻量级，且是用 `Rust` 编写的。

是我前端开发必备的工具之一。

我之所以单独写一篇文章，是因为某些常见的配置记不住，在需要的时候能找到属于自己的文档，仅此而已。

[[toc]]

## 本文撰文环境

信息技术随着时间的推移，会导致软件运行/部署的最佳实践发生变化。说明一下文章内容的产生环境，以供参考。

1. 物理机环境：Windows 11 Pro (24H2)
2. WSL 发行版：Ubuntu 24.04.2 LTS

## 说明

要流畅阅读本文，读者需要具备以下知识储备：

- 具备操作系统的实践经验
- 具备常见 GNU/Linux 操作系统实践经验
- 了解 GNU/Linux 系统及其常见发行版
- 熟悉操作系统环境变量

关于 Shell 脚本的约定：

- 没有 `sudo` 开头，则表明该命令行只是一个普通用户的命令行，区别于 root 用户执行。
- `sudo` 开头，则表明需要一定的超级用户的权限，当然，使用 root 用户登录去掉 `sudo` 后执行 Shell 也是可以的。

## 安装 FNM

### 一. 在 WSL 中安装

#### 通过远程脚本安装
```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

#### 通过 Cargo 安装 {#wsl-install-cargo}

Cargo 是 Rustup 所管理的工具链之一，因此建议通过 Rustup 安装 Cargo。

首先安装 Rustup：
```bash
sudo apt install rustup
```

通过 Rustup 安装 Cargo：

此处需要注意，如果网络为国内网络，可能需要配置 Rustup 的镜像源。

可以参考 [清华大学的镜像源文档](https://mirrors.tuna.tsinghua.edu.cn/help/rustup/)，或 [中国科学技术大学镜像文档](https://mirrors.ustc.edu.cn/help/rust-static.html)

```bash
rustup install stable
```

安装 FNM 必要的 CMake
跳过此步骤将出现错误：
```text
linker `cc` not found
```
```bash
sudo apt install cmake
```

通过 Cargo 安装 FNM
此处需要注意，如果网络为国内网络，可能需要配置 Cargo 的镜像源。
可以参考 [清华大学的镜像源文档](https://mirrors.tuna.tsinghua.edu.cn/help/crates.io-index.git/)，或 [中国科学技术大学镜像文档](https://mirrors.ustc.edu.cn/help/crates.io-index.html)
```bash
cargo install fnm
```

完毕后，要想在当前终端立即生效，最好执行以下命令：
```bash
source ~/.bashrc
```

### 二. 在 Windows 中安装 FNM

#### 通过 Winget 安装
Windows 在其 Winget 中内置了 FNM 的安装包

```powershell
winget install Schniz.fnm
```

## 配置

### 一. 在 WSL 中配置

在 .bashrc 中加入

```bash
eval "$(fnm env --use-on-cd --shell bash --corepack-enabled --node-dist-mirror=https://mirrors.ustc.edu.cn/node/)"
```
命令行解释：

fnm env 用于输出环境变量的设置
- 通过指定 --shell bash, 表示输出为 Bash Shell 的环境脚本
- --use-on-cd 表示在进入一个工作目录时，如果当前目录下有 nvmrc 文件，则自动切换到 nvmrc 中指定的 Node 版本
- --corepack-enabled 表示启用 Corepack。值得一提的是，Corepack 处于实验性阶段，因此谨慎启用该功能，该功能启用后，会在安装依赖时自动启用 Corepack，即在 package.json 中启用自动声明 packageMnager 字段，该功能在国内很多人不清楚，此处启用仅代表个人喜好
- --node-dist-mirror= 表示指定 Node 的镜像源，此处使用了中科大镜像源 `https://mirrors.ustc.edu.cn/node/`，具体文档请参考 [中国科学技术大学镜像文档](https://mirrors.ustc.edu.cn/help/node.html)

### 二. 在 Windows 中配置

***编辑配置文件 (PowerShell Profile)***

配置文件的具体路径可通过以下命令查看：
```powershell
$PROFILE
```

编辑配置文件：
```powershell
notepad $PROFILE
```

在配置文件中加入
```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

然后重启终端即可使用 FNM 进行完整的 Node 版本管理功能

## 参考资料

- [FNM GitHub 仓库](https://github.com/Schniz/fnm)
- [命令行说明文档 (GitHub)](https://github.com/Schniz/fnm/blob/master/docs/commands.md)
- [配置说明文档 (GitHub)](https://github.com/Schniz/fnm/blob/master/docs/configuration.md)
