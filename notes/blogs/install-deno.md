---
layout: doc
outline:
  level: 2
---

# 使用cargo安装deno

因为rust提供了cargo这样的二进制安装工具.可以使用cargo 安装deno.

**请注意**:
  这不是唯一的安装方式,仅代表其中一种方式.另有其他[官方推荐的安装方式](https://docs.deno.com/runtime/getting_started/installation/#download-and-install).
  且通过此种方式安装,在新机器上存在诸多问题,需要通过搜索引擎搜索解决.


## 前言

撰写本文时,deno的版本为 ***2.2.4***


***阅读本文的必要条件***

  - rustup已安装
  - 系统linux已具备
  - 知道并理解[deno](https://deno.com/)


***在没有科学上网环境时***

  - 在rustup安装工具链时,可以参考[清华大学的镜像源文档](https://mirrors.tuna.tsinghua.edu.cn/help/rustup/),或[中国科学技术大学镜像文档](https://mirrors.ustc.edu.cn/help/rust-static.html)
  - 在cargo安装deno时,可以参考[清华大学的镜像源文档](https://mirrors.tuna.tsinghua.edu.cn/help/crates.io-index.git/),或[中国科学技术大学镜像文档](https://mirrors.ustc.edu.cn/help/crates.io-index.html)


## 在debian发行版上安装

  ***适用于ubuntu,debian***

```bash
$ cargo install deno --locked
```

***本文撰写时机器环境***

- ubuntu

  ```bash
  $ cat /etc/os-release
  ```

  ```text
  PRETTY_NAME="Ubuntu 24.04.2 LTS"
  NAME="Ubuntu"
  VERSION_ID="24.04"
  VERSION="24.04.2 LTS (Noble Numbat)"
  VERSION_CODENAME=noble
  ID=ubuntu
  ID_LIKE=debian
  HOME_URL="https://www.ubuntu.com/"
  SUPPORT_URL="https://help.ubuntu.com/"
  BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
  PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
  UBUNTU_CODENAME=noble
  LOGO=ubuntu-logo
  ```

- rustup版本

  ```bash
  $ rustup --version
  ```

  ```text
  rustup 1.26.0 (2024-04-01)
  info: This is the version for the rustup toolchain manager, not the rustc compiler.
  info: The currently active `rustc` version is `rustc 1.85.0 (4d91de4e4 2025-02-17)`
  ```

- rust版本:

  ```bash
  $ rustc --version
  ```

  ```text
  rustc 1.85.0 (4d91de4e4 2025-02-17)
  ```

- cargo版本:
  ```bash
  $ cargo --version
  ```
  
  ```text
  cargo 1.85.0 (d73d2caf9 2024-12-31)
  ```


### 可能会遇到的报错/问题

#### 报错一

```text
error: linker `cc` not found
```

***原因***

cc命令是c语言编译器,deno在编译时依赖了c的链接库,需要安装gcc或者cmake



***解决方案***

建议安装cmake.安装cmake可以解决[报错二](#报错二)中的问题

```bash
sudo apt install cmake
```

如果你不选择安装cmake, 就要单独安装gcc, 执行`sudo apt-get install gcc`安装后,你发现还是得安装cmake,因为有些依赖库单纯使用gcc无法编译, 在[报错二](#报错二)中说明cargo在编译时依赖了c++的链接库,需要安装cmake

#### 报错二

```text
warning: libz-sys@1.1.20: Compiler family detection failed due to error: ToolNotFound: Failed to find tool. Is `c++` installed?
error: failed to run custom build command for `libz-sys v1.1.20`
```
***原因***

cargo在编译时依赖了c++的链接库,需要安装cmake,具体原因不明,通过[github issue](https://github.com/rust-lang/libz-sys/issues/191#issuecomment-2031188419)了解到


***解决方案***

```bash
sudo apt install cmake
```

#### 报错三

```text
failed to run custom build command for `libsqlite3-sys v0.30.1`
```

***原因***

cargo在编译时依赖了sqlite3的链接库,需要安装libsqlite3-dev,具体原因不明,通过[stack overflow](https://stackoverflow.com/questions/67297760/rust-compilation-error-failed-to-run-custom-build-command-for-freetype-sys-v0)了解到

***解决方案***

 `libclang-dev`有`548 MB`大小

```bash
sudo apt-get install libclang-dev
```

## 在redhat家族上安装



## 早期遇到过其他报错

早期版本的deno,需要依赖google protobuf工具链,但是现在已经不依赖了

### 依赖google protobuf工具链

通过安装 `proto-compiler` 解决

```bash
$ sudo apt-get install proto-compiler
```

