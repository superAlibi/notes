---
outline: [2,3]
---
# 网页打印

或许大部分情况下遇到打印的需求很奇怪, 毕竟很多 web 管理系统 (深网), 在设计阶段根本不考虑这些需求, 很多时候给我感受就是: 大部分管理系统就是一些 KPI 项目, 项目完工后就扔掉了. 不过, 打印功能在实际工作场景遇到还是真的很重要.

我第一次在真实场景遇到css 打印样式还任职于 `成都中联信通`, 当时为一个项目编写订单清单, 该清单需要脱离网络离线打印, 并最终落入到一线工作人员核查工作中.

第二次是为 OA 系统的中存在的物料清单, 该系统中普遍存在将清单打印的情况, 打印内容用于存档或者进件审查.

## 前言

打印部分的大部分概念来自于现实世界中 报刊/书籍 的概念. 例如 @page 表示用来设置现实世界的一页内容. 又比如 `@page :left`, 表示翻开的 期刊/书籍 的左边页面.
同理 `@page :right` 则表示翻开书籍的右侧.

根本上, 在 web 网页上阅读内容和翻看阅读实体书籍是两套动作和行为(忽略电子仿真翻页). 例如, web网页上的内容可以是无限向下滚动的. 不论页面有多长, 几乎没有向下的长度限制. 
但是对于一本在现实生活中的书籍/报刊, 它总是有一个有限的尺寸的. 
例如 A4 纸张, 这是我们最常接触的打印纸张尺寸. 他不可能像 web 网页那样, 往某个方向上不可能无限填充内容. 
更多的时候, 他是作为几十上百页封订起来的一叠纸, 阅读内容的时候, 需要通过翻页来阅读内容. 
而web页面只需要通过鼠标键盘向下滚动就行了. 更多的时候, 页面阅读比向下滚动阅读表现力要更加丰富. 再不济, 那也可以点击 web 内容中的链接, 跳转到其他文档中去. 这在现实世界中是不存在的. 

**参考连接**

- [网页“打印”效果调整的核心技术总结 - 微信](https://mp.weixin.qq.com/s?__biz=MzI1NjkxOTUxMQ==&mid=2247485756&idx=1&sn=6490f17224a0a94ec7ef7656b37fae2a&poc_token=HNeQKmmjuWYEVDdPw28bop_wCiRSZA7juTNekqS1)

## 打印相关 css property

### break-before

原称 `page-break-before`, 现在更推荐用 `break-before`

属性用于某个选择器之前插入换页样式
分页策略详见 [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-before) 


### break-after

原称 `page-break-after`, 现在更推荐用 `break-after`

属性用于某个选择器之前插入换页样式
分页策略详见 [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-after) 

### break-inside

原称 `page-break-inside`, 现在更推荐用 `break-inside`

用于在某个元素内部插入分页
分页策略详见 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-inside)

### orphans

此属性为了排版学中所需要的

### widows

此属性为了排版学中所需要的






## @page 规则

**相关连接**
- [@page - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/At-rules/@page)

可被 @media print 规则嵌套,例如

```css
@media print {
  @page {
    size: 50mm 150mm;
  }
}
```

page 规则用于定义某一种打印样式规则集. 然后通过规则指定运用例如:

```css
@page upright {
  size: portrait;
  page-orientation: upright;
}

@page left {
  size: landscape;
  page-orientation: rotate-left;
}

@page right {
  size: landscape;
  page-orientation: rotate-right;
}
```


```css
@media print {
  .upright {
    page: upright;
  }
  .left {
    page: left;
  }
  .right {
    page: right;
  }
}
```
[查看案例](https://remix.lucardo.website/blogs/print-css)

### 专属属性

- size
- [page-orientation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@page/page-orientation)

### 专属伪类
适用于其内部的伪类:`:left`,`:right`,`:first`,`:black`,

### 嵌套@规则

据[mdn](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/At-rules/@page#%E8%BE%B9%E8%B7%9D_at_%E8%A7%84%E5%88%99)介绍, 有关@page内部专属的@规则,到 2023年8月为止, 还没有任何浏览器实现相关标准

这些规则使用规则可以参考伪元素使用方法.

1. @top-left-corner
2. @top-left
3. @top-center
4. @top-right
5. @top-right-corner
6. @bottom-left-corner
7. @bottom-left
8. @bottom-center
9. @bottom-right
10. @bottom-right-corner
11. @left-top
12. @left-middle
13. @left-bottom
14. @right-top
15. @right-middle
16. @right-bottom

实际上, 以上的所有节点中, 所描述的区域可以用下图解释

![规则位置图](/blogs/css/css_page_margin_boxes_top-left-corner.png)

## 通用css属性

**参考连接**

- [通用页面属性 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/At-rules/@page)