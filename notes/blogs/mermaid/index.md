---

outline: [2,4]
---

# 用代码画流程图/时序图

本文主要介绍 mermaid语法. mermaid 是一个 JS 库，通过在 markdown 文档中嵌入 mermaid 库, 并通过mermaid的dsl代码块来, 结合mermaid生成时序图/类图/流程图等。


## 前言

我已记不起是从哪里开始接触到的 markdown , 暂且认为从 git 仓库 readme.md 开始的吧. 

不过最让我印象深刻的是markdown可以用编写代码的方式生成一份看起来过得去的文档.

在这之前, 我对文档的理解一直是以微软 office 套件为基础模型的, 再厉害些, 应该是要写一份html文档才对.

直到我接触到了markdown, 再到后来 我入职了 `成都掌控者(holder)` . 公司要求2天的时间, 将开发任务的实施细节落实到文档中


再后来, 在参考一位同僚间绰号为 `clojure` 的同事所输出的文档中,  了解到了 mermaid . mermaid 的表现力让我感到十分惊艳

直到现在, 我仍然对在职期间接触到这些内容心存感激. 特别是我在后来撰写自己的文档时, 我逐渐理解了一份好的文档, 对于理解一个复杂的系统和上下文作用有多重要. 特别的是面对一个复杂系统的情况下


本文作文动机是为补充现有的文档文字过多和未来编写新的文档而准备的笔记. 因此在本文发布后, 根据后期需要, 可能后期会对内容做一些额外的补充.


## 说明

具备以下知识储备, 才能流畅阅读本文内容

1. 具备 [markdown](https://www.markdownguide.org/) 基础知识
2. 了解 [yaml语法](https://www.bing.com/search?q=yaml%e8%af%ad%e6%b3%95&qs=LT&pq=yaml&sk=MT1&sc=12-4&cvid=8E2BAF8939E54002ADCEA89CC03D1AC9&FORM=QBLH&sp=2&lq=0)
3. 理解图形图像信息对人类信息摄入的积极作用


<!-- 可能需要介绍本文档是怎么生成的 -->
**参考资料**

- [ustc markdown 使用教程](https://soc.ustc.edu.cn/Digital/2025/lab0/markdown/)
- [mermaid 官方文档](https://mermaid.js.org/)





## 基本语法 {#base-syntax}


此部介绍一个mermaid语法(代码)应该包含哪些结构. 为后续在编写mermaid语法(代码)的时候, 对整体有个了解, 而不是只知道怎么出图.

### 一. mermaid语句(代码)块

在 markdown 中渲染一个 mermaid 图表, 与在markdown中插入代码片段类似. `为了类比相似性, 这里将插入一段javascript代码片段`

<<< ./demo/javascript.md{2-4}

渲染效果如下

<!-- @include: ./demo/javascript.md-->


`相似的,` mermaid 语法如下所示

<<< ./demo/mermaid/syntax.md{2}


例如

<<< ./demo/mermaid/demo-start.md{2-9}

渲染效果如下

<!-- @include: ./demo/mermaid/demo-start.md-->


**此部分的演示仅仅提供一个样例, 代码块中的具体部分将在下文详细讲解**

### 二. 语句分类

涉及到的代码块一共分为3类, 图例配置, 图例类型,  图例语句.

#### 1. 图例配置


总体上, mermaid有两类配置

**mermaid库初始化配置**

在你的项目脚手架中,或者脚手架插件中, 亦或者直接通过 `npm` 包 [mermaid](https://www.npmjs.com/package/mermaid)直接使用的. 

不管通过什么方式初始化的 , 通过初始化时传入的配置, 都称为全局配置, 所有的图例都会用到全局的配置, 当然也可以在图例中自定义属于图例自身的配置

**mermaid图例配置**

第二类时图例代码块中, 用于超过全局配置优先级的配置, 换句话说, 如果图例提供了自身配置, 那么将优先使用图例自身的, 而不是全局的.



#### 2. 图例类型

图例类型非常简短, 一个图例有两个部分组成, 一个是图例类型, 一个是图例绘制方向.

有些图例可以嵌套, 可以嵌套的图例即图例中还可以嵌套一些子图例,例如,流程图中可能存在子流程一样. 
因此图例类型也分两类, 一类是代码块中的顶级图例类型, 二类是子图例. 

#### 3. 图例语句

如果确定了配置和类型, 接下来的语句块中就是具体图例细节了. 此部分会根据图例类型的不同,而产生变化

这里可以猜测一下其代码实现: mermaid 的实现方式应该包含根据不同的实例类型, 而执行不同的模块代码, 从而实现模块之间的解耦才可能有可维护性. 之所以这么看待, 因为不同的图例采用的语法线条和图形都有相对较大的差别. 

## mermaid图例

### 流程图


正如[基本语法](#base-syntax)中的案例一样, mermaid 流程图 以 `graph` 开头即可. 或者流程图还有个别名, 叫 `flowchart`

因此以下两种写法的到的图例是一样的, 当然 `只有流程图有个别名`. 其他图例就没有了


<<< ./demo/mermaid/graph.md

或

<<< ./demo/mermaid/flowchart.md

得到图例


<!-- @include: ./demo/mermaid/graph.md -->


### 时序图

图例类型为 `sequenceDiagram`

案例

<<< ./demo/mermaid/sequenceDiagram.md

渲染效果

<!-- @include: ./demo/mermaid/sequenceDiagram.md -->