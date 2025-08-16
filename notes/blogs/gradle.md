---
outline: [2,3]
---
# Gradle 初体验


最近心血来潮, 想学习一下kotilin, 但是又不想使用idea. 经ai一搜索, 发现可以使用gradle快速启动给一个kotlin项目. 因此自然的看了一下gradle的文档:`构建工具是现代程序工程不可或缺的一环`. 发现其文档还是逻辑思路和导航非常清晰且友好.便对gradle这个构建工具产生了兴趣


## 阅读前说明

1. gradle 属于一个Java生态的软件工程构建工具
2. 推荐已经具备工程化构建经验的开发者阅读
3. 实践时需具备Java环境
4. 本文实际上是翻译文, 没有过多的抽象内容
5. 文中删除了不会影响整体理解的部分内容

## gradle 简介

1. gradle 被设计为可参与持续集成和构建自动化的工具
2. gradle 可以作为 Android,Java, kotlin multiplatform, JavaScript , c/c++ , groovy, scale 编程语言的构建工具.(`本人只对使用gradle构建kotlin和Android感兴趣`)
3. gradle 被  Android studio, idea, vscode ,eclipse , netbeans 编辑器 支持.`本人只关心vscode`
4. 对于已有的gralde 项目, 通常不需要新加入项目的开发成员额外安装gradle, 因为gradle项目自带 gradle wrapper(gradle 最小可执行程序)


## Gradle wrapper 目录结构

Gradle Wrapper 是 Gradle 项目的一个特性，它允许项目自带 Gradle 运行时，无需在系统上预先安装 Gradle。一个典型的 Gradle Wrapper 项目目录结构如下：

```
.                                                   [1]
├── gradle                                          [2]
│   ├── libs.versions.toml                          [3]
│   └── wrapper                                     [4]
│       ├── gradle-wrapper.jar                      [5]
│       └── gradle-wrapper.properties               [6]
├── gradle.properties                               [7]
├── gradlew                                         [8]
├── gradlew.bat                                     [9]
├── settings.gradle[.kts]                           [10]
├── sub_project_a                                   [11]
│   ├── build.gradle[.kts]                          [12]
│   └── src                                         [13]
└── sub_project_b                                   [11]
    ├── build.gradle[.kts]
    └── src
```

**说明：**
- **[1] 项目根目录**：包含整个项目的源代码和配置文件
- **[2] gradle/**: 用于存储 gradle wrapper 的文件
- **[3] gradle/libs.versions.toml**: 版本目录文件，用于集中管理项目依赖版本
- **[4] gradle/wrapper/**：Gradle Wrapper 的核心文件目录
  - `gradle-wrapper.jar`：Wrapper 的 JAR 文件
  - `gradle-wrapper.properties`：Wrapper 的配置文件
- **[7] gradle.properties**: 全局 Gradle 配置属性文件，可设置 JVM 参数、代理等
- **[8] gradlew**：Unix/Linux/macOS 系统下的 Gradle 执行脚本/程序
- **[9] gradlew.bat**：Windows 系统下的 Gradle 执行批处理文件
- **[10] settings.gradle[.kts]**: 项目设置文件，定义项目名称、包含的子项目等
- **[11] sub_project_a/b**: 多模块项目中的子项目目录
- **[12] build.gradle[.kts]**：项目的主要构建配置文件，定义依赖、插件、任务等
- **[13] src**: 源代码目录，包含项目的 Java/Kotlin 等源代码文件

**优势：**
- 新团队成员无需安装 Gradle
- 确保所有开发者使用相同版本的 Gradle
- 简化项目设置和部署流程



## 基础知识

### 一. 核心概念

Gradle 可根据构建脚本信息自动执行构建任务。

![img](https://docs.gradle.org/current/userguide/img/gradle-basic-1.png)

主要概念包括：

**1. Project（项目）**

- gralde 项目是可以构建的软件, 例如应用程序或应用程序库
- 每个包含 `build.gradle[.kts]` 文件的目录表示一个gradle项目
- 可以是单模块项目或多模块项目
- 多模块项目需结合根目录settigns.gralde[.kts]文件,以及是否在子目录中包含`build.gradle[.kts]`

**2. 构建脚本**

- 构建脚本向 gradle 声明构建项目需要采取哪些步骤
- 每一个项目/子项目可以包含一个和多个脚本

**3. Task（任务）**

- Gradle 构建脚本的基本执行单元
- 每个项目都在构建脚本中定义了一个或多个任务
- 每个任务执行特定的构建操作（如编译、测试、打包等）

**4. Dependency（依赖）**
- 项目运行所需的库文件
- 支持多种依赖类型：implementation、api、compileOnly 等

**5. Plugin（插件）**
- 扩展 Gradle 功能的模块, 主要提供内置的任务追加到项目任务中
- 常见插件：Java、Kotlin、Android、Spring Boot 等




### 二. gradle wrapper

在任何gradle项目中,  推荐使用项目内置的gradle wrapper:项目根目录下的`gradlew[.bat]`

![gradle本地](https://docs.gradle.org/current/userguide/img/gradle-basic-2.png)

包装器会查看 gradle 的版本声明, 并在需要时下载

![wrapper 工作流](https://docs.gradle.org/current/userguide/img/wrapper-workflow.png)

基本上,gradle wrapper 在项目根目录下以 gradlew[.bat] 存在


如果项目根目录下不存在这些文件,基本上可以断定这不是一个gradle项目


如果项目根目录下不存在gradle wrapper, 需要通过安装了gradle的计算机上,在项目根目录中执行 

```bash
gradle wrapper
```

使其在项目中生成 gradle wrapper

> [!TIP]
> 不推荐自己通过网络上下载wrapper相关文件, 然后手动配置 wrapper

**包装器具有以下优点：**

1. 自动下载并使用特定的 Gradle 版本。
2. 在给定的 Gradle 版本上标准化项目。
3. 为不同的用户和环境（IDE、CI 服务器等）配置相同的 Gradle 版本。
4. 无需手动安装 Gradle 即可轻松执行 Gradle 构建工作。

#### Gradle使用初体验


请务必区分两种运行 Gradle 的方式：

1. 使用系统中安装的gradle发行版,
2. 使用项目根目录下的gradle 包装器: gradlew[.bat]

**在 IDE 中**

Gradle 内置于许多 IDE 中，包括 Android Studio、IntelliJ IDEA、Visual Studio Code、Eclipse 和 NetBeans。
当您在 IDE 中构建、清理或运行应用时，可以自动调用 Gradle。
请参阅您选择的 IDE 的手册，详细了解如何使用和配置 Gradle。

**在命令行上**

大多数已有的项目在项目根目录中存在gradlew程序,可以直接使用

::: code-group
```bash [unix/macos/linux]
./gradlew build
```
```powershell [Windows]
.\gradlew.bat build
```
:::

#### 了解gradle wrapper 

以下文件时gralde wrapper 包装器的主要部分
```
.
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar            [1]
│       └── gradle-wrapper.properties     [2]
├── gradlew                               [3]
└── gradlew.bat                           [4]
```

1. gradle-wrapper.jar：这是一个包含 Gradle Wrapper 代码的小型 JAR 文件。它负责为项目下载和安装正确版本的 Gradle（如果尚未安装）。
2. gradle-wrapper.properties：此文件包含 Gradle Wrapper 的配置属性，例如分发网址（从何处下载 Gradle）和分发类型（ZIP 或 TARBALL）。
3. gradlew：这是一个 shell 脚本（基于 Unix 的系统），充当 gradle-wrapper.jar 的包装器。它用于在基于 Unix 的系统上执行 Gradle 任务，而无需手动安装 Gradle。
4. gradlew.bat：这是一个批处理脚本 （Windows），其用途与 gradlew 相同，但用于 Windows 系统。

> [!WARNING]
> 不建议手动编辑这些文件


### 三. gradle CLI

命令行是IDE 界面之外与gradle打交道的主要方法.

![gradle本地](https://docs.gradle.org/current/userguide/img/gradle-basic-2.png)

Gradle CLI 是从终端与 Gradle 构建交互的主要方式。 您可以使用它来运行任务、检查构建、管理依赖项和控制日志记录，所有这些都通过灵活而强大的命令行选项进行。


> [!tip]
> 强烈建议使用 Gradle Wrapper。在以下示例中使用./gradlew（在 macOS / Linux 中）或gradlew.bat（在 Windows 中）替换gradle。


#### 运行命令
要执行 Gradle 命令，请使用以下简单结构：
```text
gradle [taskName...] [--option-name...] 
```

您可以指定一个或多个以空格分隔的任务。
```text
gradle [taskName1 taskName2...] [--option-name...] 
```

例如，要运行名为 build 的任务，只需键入：
```bash
gradle build 
```

先执行clean,然后执行build命令，只需输入

```bash
gradle clean build
```


#### 命令行选项

Gradle 命令可以包含各种选项来调整其行为。 选项可以出现在任务名称之前或之后，如下所示：
```text
gradle [--option-name...] [taskName...] 
```
对于接受值的选项，为清楚起见，请使用等号 （=）：
```text
gradle [...] --console=plain 
```
有些选项是切换开关，并且具有相反的形式。 例如，要启用或禁用构建缓存，请执行以下作：
```text
gradle build --build-cache
gradle build --no-build-cache 
```
为了方便起见，Gradle 还提供了等效的短选项。 以下两个命令是等效的：

```text
gradle --help
gradle -h
```

#### 执行任务

在 Gradle 中，任务属于特定项目。 要清楚地指示要运行的任务，尤其是在多项目构建中，请使用冒号 （:） 作为项目分隔符。

要执行在根项目级别执行名为 test 的任务，请使用：
```bash
gradle :test 
```

对于嵌套子项目 subprject ，请使用冒号指定完整路径：
```bash
gradle :subproject:test 
```
如果您运行的任务不带任何冒号，Gradle 会在当前目录的项目上下文中执行该任务：
```bash
gradle test
```


### 四. settings文件


settigns文件 （settings.gradle[.kts]） 是每个 Gradle 项目的入口点。

![setting 文件](https://docs.gradle.org/current/userguide/img/gradle-basic-3.png)

设置文件的主要用途是定义项目结构，通常将子项目添加到构建中。 因此，在：

1. 单项目生成，settigns文件是可选的。
2. 多项目构建，settigns文件是必须的，并用以声明所有子项目。(pnpm workspace相似)


#### settigns脚本文件
设置文件是一个脚本。它要么是用 Groovy 编写的文件settings.gradle，要么是用 Kotlin 编写的文件settings.gradle.kts。

`Groovy DSL` 和 `Kotlin DSL` 是 Gradle 脚本唯一接受的语言。

设置文件通常位于项目的根目录中，因为它定义了构建的结构，例如包含哪些项目。 如果没有设置文件，Gradle 默认将该构建视为单个项目构建。

让我们看一个例子并解释它：

::: code-group
```kotlin [Kotlin]
## settings.gradle.kts
rootProject.name = "root-project"   [1]

include("sub-project-a")            [2]
include("sub-project-b")
include("sub-project-c") 
```
```kotlin [Groovy]
## settings.gradle
rootProject.name = 'root-project'   [1]

include('sub-project-a')            [2]
include('sub-project-b')
include('sub-project-c')
```
:::

#### 定义项目名称。
添加子项目。
1. 定义项目名称

设置文件定义您的项目名称：
```text
rootProject.name = "root-project" 
```
每个构建只有一个根项目。

2. 添加子项目
设置文件通过包含子项目（如果有）来定义项目的结构：
```text
include("sub-project-a")
include("sub-project-b")
include("sub-project-c") 
```
settings脚本在任何构建脚本之前都会进行分析，使其成为启用或配置构建范围功能（例如插件管理、包含的构建、版本目录等）的正确位置。我们将在[高级概念](https://docs.gradle.org/current/userguide/part4_settings_file.html)部分探讨这些 Gradle 功能。

若要了解有关编写设置文件脚本的详细信息，请参阅[编辑settings文件](https://docs.gradle.org/current/userguide/writing_settings_files.html#writing_settings_files)。


### 五. 构建脚本基础知识

通常，构建脚本 （build.gradle[.kts]） 详细说明了构建配置、任务和插件。

![img](https://docs.gradle.org/current/userguide/img/gradle-basic-4.png)


#### 构建脚本

构建脚本要么是用 Groovy 编写的文件build.gradle，要么是用 Kotlin 编写的文件build.gradle.kts。

`Groovy DSL` 和 `Kotlin DSL` 是 Gradle 脚本唯一接受的语言。

在多项目构建中，每个子项目通常在其根目录中都有自己的构建文件。

在生成脚本中，通常会指定：

- 插件：扩展 Gradle 功能以执行编译代码、运行测试或打包工件等任务的工具。
- 依赖项：项目使用的外部库和工具。

具体来说，构建脚本包含两种主要类型的依赖项：

- Gradle 和构建脚本依赖项：其中包括 Gradle 本身或构建脚本逻辑所需的插件和库。
- 项目依赖项：项目源代码直接需要的库，以正确编译和运行。

让我们看一个例子并分析它：

::: code-group
```kotlin [Kotlin]
// app/build.gradle.kts
plugins {                                                           [1]
    // Apply the application plugin to add support for building a CLI application in Java.
    application
}
dependencies {                                                      [2]
    // Use JUnit Jupiter for testing.
    testImplementation(libs.junit.jupiter)

    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // This dependency is used by the application.
    implementation(libs.guava)
}
application {                                                       [3]
    // Define the main class for the application.
    mainClass = "org.example.App"
}
```
```kotlin [Groovy]
// app/build.gradle
plugins {                                                           [1]
    // Apply the application plugin to add support for building a CLI application in Java.
    id 'application'
}
dependencies {                                                      [2]
    // Use JUnit Jupiter for testing.
    testImplementation libs.junit.jupiter

    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'

    // This dependency is used by the application.
    implementation libs.guava
}
application {                                                       [3]
    // Define the main class for the application.
    mainClass = 'org.example.App'
}
```
:::


- [1]插件引入。
- [2]依赖项声明。
- [3]使用约定声明。


#### 关于依赖项

您的项目需要外部库来编译、运行和测试。

在此示例中，项目在主应用程序代码中使用JUnit Jupiter用于测试和 Google 的Guava库：


::: code-group


```kotlin [Kotlin]
// app/build.gradle.kts
dependencies {  
  // Use JUnit Jupiter for testing.
  testImplementation(libs.junit.jupiter)

  testRuntimeOnly("org.junit.platform:junit-platform-launcher")

  // This dependency is used by the application.
  implementation(libs.guava)
}
```
```kotlin [Kotlin]
// app/build.gradle
dependencies {  
  // Use JUnit Jupiter for testing.
  testImplementation libs.junit.jupiter

  testRuntimeOnly 'org.junit.platform:junit-platform-launcher'

  // This dependency is used by the application.
  implementation libs.guava
}
```
:::


### 六 依赖关系基础知识

Gradle 内置了对依赖项管理的支持。

![img](https://docs.gradle.org/current/userguide/img/gradle-basic-7.png)

依赖项管理是一种自动化技术，用于声明和解析项目所需的外部资源（即依赖项）。

依赖项包括支持构建项目的 JAR、插件、库或源代码。 它们在构建脚本中声明。

Gradle 会自动处理下载、缓存和解析这些依赖项，使您无需手动管理它们。它还处理版本冲突并支持灵活的版本声明。


#### 声明您的依赖项

若要向项目添加依赖项，请在 build.gradle[.kts] 文件  `dependencies {}`块中指定依赖项。

以下 build.gradle[.kts] 文件向项目添加了一个插件和两个依赖项：


::: code-group
```kotlin [Kotlin]
// app/build.gradle.kts
plugins {                                                           [1]
    id("java-library")
}
dependencies {                                                      [2]
  implementation("com.google.guava:guava:32.1.2-jre") 
  api("org.apache.juneau:juneau-marshall:8.2.0")                    [3]
}

```
```kotlin [Groovy]
// app/build.gradle
plugins {                                                           [1]
    id("java-library")
}
dependencies {                                                      [2]
  implementation("com.google.guava:guava:32.1.2-jre") 
  api("org.apache.juneau:juneau-marshall:8.2.0")                    [3]
}
```
:::


1. 应用 Java Library 插件，该插件增加了对构建 Java 库的支持。
2. 添加对生产代码中使用的 Google Guava 库的依赖项。
3. 添加了对库代码中使用的 Apache 的 Juneau Marshall 库的依赖项。


Gradle 中的依赖项按配置分组，配置定义了依赖项的使用时间和方式：

- implementation用于编译和运行生产代码所需的依赖项。
- api用于应向子模块/库的开发/使用者公开的依赖项。


> [!NOTE]
> Gradle 支持许多其他配置，例如testImplementation 、runtimeOnly 、compileOnly 、 api等。


#### 查看项目依赖项

您可以使用该任务检查依赖项树。 例如，要查看app项目的依赖关系：
```bash
./gradlew :app:dependencies 
```
Gradle 将输出依附项树，按配置分组：
```text
$ ./gradlew :app:dependencies

> Task :app:dependencies

------------------------------------------------------------
Project ':app'
------------------------------------------------------------

...

runtimeClasspath - Runtime classpath of source set 'main'.
+--- org.apache.juneau:juneau-marshall:8.2.0
|    \--- org.apache.httpcomponents:httpcore:4.4.13
\--- com.google.guava:guava:32.1.2-jre
     +--- com.google.guava:guava-parent:32.1.2-jre
     |    +--- com.google.code.findbugs:jsr305:3.0.2 (c)
     |    +--- org.checkerframework:checker-qual:3.33.0 (c)
     |    \--- com.google.errorprone:error_prone_annotations:2.18.0 (c)
     +--- com.google.guava:failureaccess:1.0.1
     +--- com.google.guava:listenablefuture:9999.0-empty-to-avoid-conflict-with-guava
     +--- com.google.code.findbugs:jsr305 -> 3.0.2
     +--- org.checkerframework:checker-qual -> 3.33.0
     \--- com.google.errorprone:error_prone_annotations -> 2.18.0
```


#### 使用版本声明 (推荐)

版本目录提供了一种集中且一致的方式来管理整个生成中的依赖项坐标和版本。 无需直接在每个build.gradle[.kts]文件中声明版本，而是在libs.versions.toml文件中定义一次版本。

这使得以下作变得更加容易：

- 在子项目之间共享共同依赖声明
- 避免重复和版本不一致
- 跨大型项目强制执行依赖项和插件版本

版本目录通常包含四个部分：

1. [versions]声明插件和库将引用的版本号。
2. [libraries]以定义构建文件中使用的库。
3. [bundles]以定义一组依赖项。
4. [plugins]来定义插件。

这是一个例子：
```toml 
# gradle/libs.versions.toml
[versions]
guava = "32.1.2-jre"
juneau = "8.2.0"

[libraries]
guava = { group = "com.google.guava", name = "guava", version.ref = "guava" }
juneau-marshall = { group = "org.apache.juneau", name = "juneau-marshall", version.ref = "juneau" } 
```
将此libs.versions.toml文件放置在项目的gradle/目录中。 Gradle 将自动获取它，并通过构建脚本中的libs访问器公开其内容。 IntelliJ 和 Android Studio 等 IDE 也会获取此元数据以完成自动提示。

定义后，您可以直接在构建文件中引用这些别名：


::: code-group
```kotlin [Kotlin]
// app/build.gradle.kts
dependencies {
  implementation(libs.guava)
  api(libs.juneau.marshall)
}

```
```kotlin [Groovy]
// app/build.gradle
dependencies {
  implementation(libs.guava)
  api(libs.juneau.marshall)
}
```
:::

> [!NOTE]
> 引用 api libs.juneau.marshall 实际上指向的应该是gradle/libs.versions.toml文件中 libraries的key:juneau-marshall, 因为gradle把 - 换成了 . 
>
> 是个令人费解的隐式转换, 初次遇到时很容易疑惑


要了解跟多信息, 可以参阅 [依赖项管理](https://docs.gradle.org/current/userguide/getting_started_dep_man.html#dependency-management-in-gradle)


### 七 任务基础知识

任务表示构建执行的某个独立的工作单元，例如编译类、创建 JAR、生成 Javadoc 或将存档发布到存储库。

![tasks的来源](https://docs.gradle.org/current/userguide/img/gradle-basic-5.png)


任务是每个 Gradle 构建的构建块。

常见的任务类型包括：

- 编译源代码
- 运行测试
- 打包输出（例如，创建 JAR 或 APK）
- 生成文档（例如 Javadoc）
- 将构建项目发布到存储库

每个任务都是独立的，但可以依赖于其他任务来首先运行。Gradle 使用这些信息来确定执行任务的最有效顺序——跳过任何已经最新的任务。


#### 运行任务
要运行任务，请使用项目根目录中的 Gradle wrapper。例如，要运行build任务，请执行以下作：
```bash
./gradlew build 
```
这将运行build任务及其所有依赖项。


#### 列出可用任务
Gradle 插件和您的构建脚本定义了项目中可用的任务。要查看它们，请执行以下作：
```bash
./gradlew tasks 
```
这显示了任务的分类列表：
```text
Application tasks
-----------------
run - Runs this project as a JVM application

Build tasks
-----------
assemble - Assembles the outputs of this project.
build - Assembles and tests this project.

...

Documentation tasks
-------------------
javadoc - Generates Javadoc API documentation for the main source code.

...

Other tasks
-----------
compileJava - Compiles main Java source.

...
```

您可以使用命令./gradlew \<task-name\>直接运行其中任何任务。


### 八 [插件基础知识](https://docs.gradle.org/current/userguide/plugin_basics.html)

入门不需要了解,点击标题自己翻译查看


### 九. [缓存基础知识](https://docs.gradle.org/current/userguide/gradle_optimizations.html)

避免重复构建,初级项目不需要了解

### 十. [构建扫描](https://docs.gradle.org/current/userguide/build_scans.html)

将构建问题上传到gradle云, gradle云可以分享构建配置依赖和分析构建过程. 初级阶段可能需要, 因为分享功能意味着可以让别人帮你找问题