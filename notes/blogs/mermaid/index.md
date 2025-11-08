---

outline: [2,3]
---

# 用 mermaid 的画流程/时序图

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
2. 理解图形图像信息对人类信息摄入的积极作用


<!-- 可能需要介绍本文档是怎么生成的 -->
**参考资料**

- [ustc markdown 使用教程](https://soc.ustc.edu.cn/Digital/2025/lab0/markdown/)
- [mermaid 官方文档](https://mermaid.js.org/)





## 基本语法 {#base-syntax}


此部介绍一个mermaid语法(代码)应该包含哪些结构. 为后续在编写mermaid语法(代码)的时候, 对整体有个了解, 而不是只专注于出图.

### mermaid语句(代码)块

在 markdown 中渲染一个 mermaid 图表, 和在markdown中插入代码片段类似. `为了类比相似性, 这里将插入一段javascript代码片段`

<<< ./demo/javascript.md{2-4}

渲染效果如下

<!-- @include: ./demo/javascript.md-->


`相似的,` mermaid 语法如下所示

<<< ./demo/mermaid/syntax.md{2}


例如[官方文档入门文档第一个案例](https://mermaid.js.org/syntax/flowchart.html?id=flowcharts-basic-syntax)

<<< ./demo/mermaid/official-demo-1.md{2-6}

渲染效果如下

<!-- @include: ./demo/mermaid/official-demo-1.md-->





## mermaid图例

### 流程图


正如[基本语法](#base-syntax)中的案例一样, mermaid 流程图 以 `graph` 开头即可. 或者流程图还有个别名, 叫 `flowchart`

因此以下两种写法的到的图例是一样的, 当然 `只有流程图有个别名`. 其他图例就没有了


<<< ./demo/mermaid/graph.md

或

<<< ./demo/mermaid/flowchart.md

得到图例


<!-- @include: ./demo/mermaid/graph.md -->

