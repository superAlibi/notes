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

涉及到的代码块总共分为3大类, `图例配置`, `图例类型及方向`,  `图例语句`.

#### 1. 图例配置


原则上, mermaid有两类配置 `全局配置`和`图例自定义配置`

**全局配置**

在你的项目脚手架中,或者脚手架插件中, 亦或者直接通过 `npm` 包 [mermaid](https://www.npmjs.com/package/mermaid)直接使用的. 

不管通过什么方式初始化的 , 通过初始化时传入的配置, 都称为全局配置, 所有的图例都会用到全局的配置, 当然也可以在图例中自定义属于图例自身的配置

此部分本文不会涉及, 全局配置部分, 因为这是另外一个话题. 跟本文主题不一致


**图例配置**


第二类时图例代码块中, 用于超过全局配置优先级的配置, 换句话说, 如果图例提供了自身配置, 那么将优先使用图例自身的, 而不是全局的.

例如我需要为一个流程图独立配置一个标题, 并且绘制方式采用手绘风格

<<< ./demo/mermaid/flowchart-config.md

渲染效果如下

<!-- @include: ./demo/mermaid/flowchart-config.md -->

此部分可以参考[官方文档](https://mermaid.js.org/config/configuration.html)


#### 2. 图例类型及绘制方向

图例类型非常简短, 一个图例有两个部分组成, 一个是图例类型, 一个是图例绘制方向.


**类型为第一个语法词组**

例如, 流程图类型.

> [!TIP]
> 以下代码只需要关注高亮的行

<<< ./demo/mermaid/graph.md{2}

或

<<< ./demo/mermaid/flowchart.md{2}

得到图例


<!-- @include: ./demo/mermaid/graph.md -->


又或者时序图

<<< ./demo/mermaid/sequence-type.md{2}

渲染结果如下

<!-- @include: ./demo/mermaid/sequence-type.md -->


**图例绘制方向为图例类型的第二个词组,是可选的**

例如, 一个朝下的图例

<<< ./demo/mermaid/flowchart-direction-TB.md{2}

得到的渲染结果

<!-- @include: ./demo/mermaid/flowchart-direction-TB.md -->


一个朝从左往右的图例

<<< ./demo/mermaid/flowchart-direction-LR.md{2}

渲染结果如下


<!-- @include: ./demo/mermaid/flowchart-direction-LR.md -->


其中, 总共包含四个方向, 如下表所示

|  符号  | 代表绘制方向 |
| :----: | :----------: |
| TB或TD |   自上而下   |
|   BT   |   自下而上   |
|   LR   |   从左往右   |
|   RL   |   从右往左   |

有些图例可以[嵌套](https://mermaid.js.org/syntax/flowchart.html#subgraphs), 可以嵌套的图例即图例中还可以嵌套一些子图例. 例如, 流程图中可能存在子流程一样. 
因此图例类型也可以分两类, 一类是代码块中的顶级图例类型, 二类是子图例. 



此处按照流程图的子图举个例子

<<< ./demo/mermaid/flowchart-direction-subgraph.md{5,7,8,10}

渲染结果如下


<!-- @include: ./demo/mermaid/flowchart-direction-subgraph.md -->


#### 3. 图例语句

如果确定了配置和类型, 接下来的语句块中就是具体图例细节了. 此部分会根据图例类型的不同,而产生变化

这里可以猜测一下其代码实现: mermaid 的实现方式应该包含根据不同的实例类型, 而执行不同的模块代码, 从而实现模块之间的解耦才可能有可维护性.

之所以这么看待, 因为 `不同的图例采用的线条语法和节点图形都有较大差别`. 


> [!WARNING]
> 一些特殊字符和单词可能会导致图形不正常渲染, 如下表

| 符号/单词 |                               作用                                |                       解决办法                       |
| :-------: | :---------------------------------------------------------------: | :--------------------------------------------------: |
|    %%     | 符号表示单行注释, %% 符号后面的内容将不会正常渲染, 常用于内部注释 |                                                      |
|    end    |                     此单词用于结束子图的标识                      | 需要使用到本单词, 只需要将双引号包裹即可,像这样"end" |

更详细的信息可参考[官方说明](https://mermaid.js.org/intro/syntax-reference.html#diagram-breaking)

## mermaid图例


mermaid的图例有非常多, 可以参考[mermaid的简介部分内容](https://mermaid.js.org/intro/#diagram-types)

到本文发布时,包含以下图例: 
- [流程图](https://mermaid.js.org/syntax/flowchart.html)
- [时序图](https://mermaid.js.org/syntax/sequenceDiagram.html)
- [甘特图](https://mermaid.js.org/syntax/gantt.html)
- [类图](https://mermaid.js.org/syntax/classDiagram.html)
- [git图](https://mermaid.js.org/syntax/gitgraph.html)
- [实体关系图](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)
- [象限图](https://mermaid.js.org/syntax/quadrantChart.html)
- [xy图(echart柱状图)](https://mermaid.js.org/syntax/xyChart.html)
- [状态图](https://mermaid.js.org/syntax/stateDiagram.html)
- [用户旅程图](https://mermaid.js.org/syntax/userJourney.html)
- [饼图](https://mermaid.js.org/syntax/pie.html)
- [需求关系图](https://mermaid.js.org/syntax/requirementDiagram.html)
- [c4(实验)](https://mermaid.js.org/syntax/c4.html)
- [思维导图(实验)](https://mermaid.js.org/syntax/mindmap.html)
- [时间线](https://mermaid.js.org/syntax/timeline.html)
- [ZenUML](https://mermaid.js.org/syntax/zenuml.html)
- [桑基图](https://mermaid.js.org/syntax/sankey.html)
- [块图](https://mermaid.js.org/syntax/block.html)
- [包图(数据块/数据包)](https://mermaid.js.org/syntax/packet.html)
- [看版图](https://mermaid.js.org/syntax/kanban.html)
- [构建流程图](https://mermaid.js.org/syntax/architecture.html)
- [雷达图](https://mermaid.js.org/syntax/radar.html)
- [树图](https://mermaid.js.org/syntax/treemap.html)

本文不会全部举例, 而是只举例`流程图`和`时序图`, 因为在博客中用得比较多

### 流程图


正如[基本语法](#base-syntax)中的案例一样, 流程图 类型以 `graph` 开头. 或者还有个别名: `flowchart`

因此以下两种写法的到的图例是一样的, 当然 `只有流程图有个别名`. 其他图例就没有了


<<< ./demo/mermaid/graph.md{2}

或

<<< ./demo/mermaid/flowchart.md{2}

得到图例仅包含一个图形节点的流程图


<!-- @include: ./demo/mermaid/graph.md -->

#### 流程图基本内容

流程图语句块包含以下内容, `流程节点(图形)`, `关系(线段和箭头)`, `子图`

流程节点是流程图的基本元素之一, 可以为节点图形块中添加一个自定义的文本内容

例如

<<< ./demo/mermaid/flowchart-node-tag.md{6,7}

渲染效果如下

<!-- @include: ./demo/mermaid/flowchart-node-tag.md -->

其中, 中括号前面`L`和`m`, 则表示节点的唯一`标识/id`, 后续可通过此`标识/id`,
用于与其他节点建立关系, `记住这一点`


其中注释节点使用 **"\` \`"** 包裹, 则被包裹的部分则可以采用 markdown 编写, `不可过于以来此特性,因为其仅支持部分特性`

<<< ./demo/mermaid/flowchart-node-comment.md{6}

渲染效果

<!-- @include: ./demo/mermaid/flowchart-node-comment.md -->


#### 1. 节点图形

在 mermaid `11.3.0` 之前的版本, 仅通过键盘上({[\|/]})>字符就可以表示以下简单图形



以表格汇总如下

|         包裹符号          |     表示形状     |
| :-----------------------: | :--------------: |
|           `()`            |  圆边直角四边形  |
|          `([])`           |  体育场跑道形状  |
|          `[[]]`           |      子例程      |
|          `[()]`           |      圆柱形      |
|          `(())`           |       圆形       |
|           `>]`            | 标签(不规则图形) |
|           `{}`            |       菱形       |
| <span v-pre>`{{}}`</span> |      六边形      |
|      `[//] 或 [\\]`       |    平行四边形    |
|      `[/\] 或 [\/]`       |     等腰梯形     |
|         `((()))`          |      双圆形      |


> [!TIP]
> 在mermaid 官方在11.3.0 新增的新型语法可以绘制更加复杂的图形, 本文不再介绍, 可以[参考官方文档](https://mermaid.js.org/syntax/flowchart.html#expanded-node-shapes-in-mermaid-flowcharts-v11-3-0)



举个例子:

**我想要一个`圆柱形的节点`**

<<< ./demo/mermaid/flowchart-database.md

渲染结果如下

<!-- @include: ./demo/mermaid/flowchart-database.md -->


或者我想要个**平行四边形形状的节点**

<<< ./demo/mermaid/flowchart-parallelogram .md

渲染结果如下

<!-- @include: ./demo/mermaid/flowchart-parallelogram .md -->

又或者我想要个**不规则图形的节点**

<<< ./demo/mermaid/flowchart-asymmetric.md

渲染结果如下

<!-- @include: ./demo/mermaid/flowchart-asymmetric.md -->












#### 2. 关系


流程图中每个流程节点的关系建立通过线段和箭头在可视化图形上建立关系

其中关系的链接中包含, 线段和箭头部分,线段和箭头分别可以有多种表示方法


建立关系基本代码结构语法如下

<<< ./demo/mermaid/flowchart-link-syntax.md


通过表格汇总如下,请`注意空格`

|              关系符号              |   线段&箭头说明    |
| :--------------------------------: | :----------------: |
|          `NODE --- NODE2`          |        实线        |
|          `NODE --> NODE2`          |     实线&箭头      |
|         `NODE ---> NODE2`          | 有箭头&加长的实线  |
|     `NODE-- 文本描述 ---NODE2`     |     实线&描述      |
|     `NODE---\|文本描述\|NODE2`     |     实线&描述      |
|     `NODE-- 文本描述 -->NODE2`     |   实线&箭头&描述   |
|     `NODE-->\|文本描述\|NODE2`     |   实线&箭头&描述   |
|          `NODE -.- NODE2`          |        虚线        |
|     `NODE-.-\|文本描述\|NODE2`     |     虚线&描述      |
|    `NODE-.\|文本描述\|.-NODE2`     |     虚线&描述      |
|    `NODE-.->\|文本描述\|NODE2`     |   虚线&描述&箭头   |
|          `NODE === NODE2`          |      加粗实线      |
|          `NODE ==> NODE2`          |   加粗实线&箭头    |
|     `NODE== 关系描述 ===NODE2`     |   加粗实线&描述    |
|     `NODE== 关系描述 ==>NODE2`     | 加粗实线&箭头&描述 |
|          `NODE ~~~ NODE2`          |     不可见关系     |
|     `NODE --> NODE2 --> NODE3`     |      链式关系      |
| `NODE --> NODE2 & NODE3 --> NODE4` |    共同目标关联    |
|  `NODE & NODE2 --> NODE3 & NODE4`  |      交叉关联      |

**包含箭头的连接**


<<< ./demo/mermaid/flowchart-link-arrow.md

渲染效果

<!-- @include: ./demo/mermaid/flowchart-link-arrow.md -->


**不包含箭头的连接**


<<< ./demo/mermaid/flowchart-link-not-arrow.md

渲染效果

<!-- @include: ./demo/mermaid/flowchart-link-not-arrow.md -->


**包含文字描述的连接**


<<< ./demo/mermaid/flowchart-link-comment-1.md

渲染效果

<!-- @include: ./demo/mermaid/flowchart-link-comment-1.md -->


或

<<< ./demo/mermaid/flowchart-link-comment-2.md

渲染效果

<!-- @include: ./demo/mermaid/flowchart-link-comment-2.md -->



> [!TIP]
> 更高级的语法, 包括给关系(线段)命名(标识/ID), 通过给线段命名(标识/ID)后, 将动画效果与其命名绑定, 即可实线矢量动画


动画例子

<<< ./demo/mermaid/flowchart-link-animate.md


渲染效果

<!-- @include: ./demo/mermaid/flowchart-link-animate.md -->


如果需要自定义动画效果,可以参考[官方文档](https://mermaid.js.org/syntax/flowchart.html#selecting-type-of-animation)


### 时序图

图例类型为 `sequenceDiagram`

序列图是一种交互图,用于显示过程如何相互运行以及顺序。


那么作为交互的基本元素中, 包含`参与方`,`交互方向(箭头)`和`交互内容`


基本元素和语法如下

<<< ./demo/mermaid/sequenceDiagram.md

例如, 参与方类型为演员名称为Alice与普通参与方类型Blob交互

<<< ./demo/mermaid/sequence-actor.md

<!-- @include: ./demo/mermaid/sequence-actor.md -->


### 交互方类型

交互方类型只有两种, 一个`actor`和`participant`, 但是还有个不知道从什么版本引入的特性, 通过`@`语法可以为普通参与方类型制定不一样的图标

例如, 我想指定一个普通参与方类型为数据库的图标, `@`语法后面为一个JSON对象. 例如下面的例子

<<< ./demo/mermaid/sequence-database.md

<!-- @include: ./demo/mermaid/sequence-database.md -->

其中根据方方例子, 参与方类型可以包含如下类型

|     类型      |   描述    |
| :-----------: | :-------: |
|  `boundary`   |   边界    |
|   `control`   |   控制    |
|   `entity`    |   实体    |
|  `database`   |  数据库   |
| `collections` | 收藏/收集 |
|    `queue`    |   队列    |


### 参与方别名

当参与方过多时,不想写参与方过长的名字,还可以为参与方设置一个别名(标记/ID/标识)

例如

<<< ./demo/mermaid/sequence-tag.md

<!-- @include: ./demo/mermaid/sequence-tag.md -->



### 箭头

交互方向包含如下类型

|   类型   |            描述             |
| :------: | :-------------------------: |
|   `->`   |     无需箭头的坚实线条      |
|  `-->`   |       无箭头的点缀线        |
|  `->>`   |     带有箭头的坚实线条      |
|  `-->>`  |       带箭头的点状线        |
| `<<->>`  | 带双向箭头的实线(v11.0.0+)  |
| `<<-->>` | 带双向箭头的虚线(v11.0.0+)  |
|   `-x`   |        末端有十字线         |
|  `--x`   |        末端有十字线         |
|   `-)`   |  末端有开箭头的实线(async)  |
|  `--)`   | 末端有开箭头的点状线(async) |


### 交互内容

时序图中包含很多参与方的交互. 其中我挑选了部分我的文章中会涉及到的部分. 包括 `激活`,`循环`,`判断`, `可选`

#### 1. 激活状态

<<< ./demo/mermaid/sequence-active.md

<!-- @include: ./demo/mermaid/sequence-active.md -->

#### 2. 笔记/提示


最简单的例子

<<< ./demo/mermaid/sequence-note.md

<!-- @include: ./demo/mermaid/sequence-note.md -->

或者将笔记覆盖多个参与方

<<< ./demo/mermaid/sequence-note-over.md

<!-- @include: ./demo/mermaid/sequence-note-over.md -->

#### 3. 循环

如果时序中存在循环, 可以通过`loop` 表达式完成

<<< ./demo/mermaid/sequence-loop.md
<!-- @include: ./demo/mermaid/sequence-loop.md -->
#### 4. 判断/分支

如果交互中存在根据某个状态做不同的交互, 主要语法如下

<<< ./demo/mermaid/sequence-alt-syntax.md

例如

<<< ./demo/mermaid/sequence-alt.md

<!-- @include: ./demo/mermaid/sequence-alt.md -->



可选的交互

<<< ./demo/mermaid/sequence-opt-syntax.md

<<< ./demo/mermaid/sequence-opt-and-alt.md

<!-- @include: ./demo/mermaid/sequence-opt-and-alt.md -->


#### 5. 并行分支

如果某个参与方在一段同时发起两个交互,而不管另外的参与方是否返回的交互情形, 则采用 `par and` 语句

如下


<<< ./demo/mermaid/sequence-par-syntax.md

举个例子

<<< ./demo/mermaid/sequence-par.md


<!-- @include: ./demo/mermaid/sequence-par.md -->

#### 6. 关键交互区域

如果某个交互非常关键,希望通过圈出的区域的方式以达到着重提示的效果,则采用`critical option`语句

<<< ./demo/mermaid/sequence-critical-syntax.md
<!-- @include: ./demo/mermaid/sequence-critical.md -->


### 交互编号

可以通过给每个交互添加上标号, 让复杂的交互更加具备可读性

<<< ./demo/mermaid/sequence-autonumber.md{3-4,7}
<!-- @include: ./demo/mermaid/sequence-autonumber.md -->

<!-- ### 给参与方添加点击交互 -->

<!-- <<< ./demo/mermaid/sequence-menu-options.md -->