---
outline: [2,3]

---

# Stream 与 音频播放技术

使用异步请求加载流式数据, 实现边加载边播放的功能

## 说明

想要流程阅读本文, 需要读者具备以下知识储备

- 熟悉 [Stream API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)
- 熟悉 fetch api
- 了解 [ecmascript 2024](https://tc39.es/ecma262/2024/)
- 了解 [Media Source Extensions API](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Source_Extensions_API)

**参考连接**

- [浅谈 audioContext 音频上下文-csdn](https://blog.csdn.net/2301_79280768/article/details/146991572)
- [AudioContext入门-稀土掘金](https://juejin.cn/post/6962380242497306638)

**作文动机**

工作中遇到了类似功能逻辑, 初次看到时, 就觉得其代码不够优雅. 体现在没有充分运用Stream 数据流背压技术.

但是, 除此之外, 更对 [web媒体技术](https://developer.mozilla.org/zh-CN/docs/Web/Media) 本身具有很高的学习热情. 因为现代媒体技术不比当前运用flash技术的时候了.

现在相关工作组已经将技术规范和标准化. 国内因为各种原因并未采用相关标准实现在线直播或语音聊天, 这让我感觉很失落. 

最近两天花了点时间学习了相关概念. 也仅仅限于皮毛, 且仅限于 音频技术, 但足以应付工作中相关问题了. 更重要的是 作文记录加深印象.


web媒体技术涉及到诸多概念, 本文主旨在于介绍以下场景

当播放源不能通过地址简单获取数据流时的情况.  例如, 需要在请求头中加上 Authoritarian 请求头时, 且不知道音频长度是多少的情况, 进行一边播放一边拉取音频数据.

此类情况对于需要权限查看的音频或来自于服务器的合成音频的情况下适用. 

对于一开始就已知的音频长度可以一次性将数据流拉取玩在播放的情况, 不适用于本文.

本文案例亦可以用于网络情况不佳, 但是又需要及时播放的情况. 同理, 也适用于网络情况良好, 但带宽不够的情况下实现加载高负载的播放内容. 减轻客户端加载压力.


## 音频播放相关概念

了解关键概念有助于在回顾时和理解本文代码逻辑有积极作用.

### audioContext

AudioContext 本质上是为音频处理工作流的提供一个程序空间(上下文), 并用来声明 音频源, 音频处理(增益)顺序, 以及音频播放的过程. 因此 在开始处理任何音频前, 应该创建一个AudioContext.

audioContext 继承于 BaseAudioContext, 所以很多 BaseAudioContext 也能在AudioContext 使用
比如decodeAudioData 方法, 用于将原始的 ArrayBuffer 进行解码后返回音频数据, 当然返回的也是ArrayBuffer. 只不过经过了解码. 本文不会涉及使用.

本文不会涉及BaseAudioContext的使用案例

### AudioNode

本文中不会对音频增益(AudioNode)部分进行过多的案例展示与介绍

### MedisSouce

播放方式有很多中, 比如本文涉及到的 Audio 播放器对象, 可以在创建实例时 传入一个音频地址, 就能实现直接播放效果. 

本质上,通过初始化Audio传入播放地址的行为, 就是在\<audio\>标签加上src 字符串src属性没有太大的区别.

因此, 对于以上条件不满足时, 又不想基于其他插件来获得流媒体的功能, 就需要通过[MSE API](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Source_Extensions_API), 这样就能通过纯JavaScript的方式获得媒体串流.

MesiaSouce 正是为了通过JavaScript创建媒体串流而生的.


### AudioDestinationNode 

该对象继承于 AudioNode ,  但此对象着重于描述一个AudioContext音频处理的出口, 即对音频进行最后播放(最后一个处理节点), 播放后就是耳朵听到的声音, 程序再无后续处理.

默认情况下, Audio Context实例有一个 destination 属性, 就是该对象


### ReadableStream

本文演示案例是基于fetch api 实现的获取mp3音频.

fetch Api 返回结果为Response 对象, 表示一个http响应, 当响应大且耗时时, 且大到无法一次性储存完, 达到几乎无限时, 就不能完全等待这个响应数据流了.


因此, Response对象有一个body属性, 用来对于获取的数据近乎无限时, 就把他当作涓涓流水(山泉/水龙头), 源源不断流出, 它流出一点, 便处理一点.

这是实现一边播放一边获取音频的核心要点/概念.





## 实现

特别说明的是, 本文案例以限制网络加载速度实现的一边播放一边加载的. 音频文件本身不大, 但是将网络速度限制很大, 导致长时间无法加载完成, 来比喻网络加载慢的场景

这个时候就需要一边加载一边播放, 以保证用户端来的良好使用体验.

### 流媒体服务器



主要代码文件如下结构所示

```text
.
├── README.MD
├── apps
│   ├── a.mp3
│   ├── b.mp3
│   └── mp3.ts
├── deno.json
├── deno.lock
└── main.ts
```

main.ts为整个服务器入口文件, 关键代码如下所示

```typescript
import { H3, serve } from "h3";

import mp3Response from "./apps/mp3.ts";
const app = new H3();

app.mount("/mp3", mp3Response);
serve(app, { port: 3000 });
```

其中 mp3.ts 是返回mp3音频的全部代码. 如下所示, 着重强调的是, mp3 文件在服务端按照 Stream 返回的, 即流式返回

```typescript
import { H3, defineHandler, getRouterParam } from "h3";
const app = new H3();

app.get("/:filePath", defineHandler(async (event) => {
  const filepath = getRouterParam(event, "filePath") as string

  const path = [import.meta.dirname, filepath?.replace(/^\//, '')].join('/')
  try {
    const file = await Deno.open(path, { read: true })
    return new Response(file.readable, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error(error)
    return  Response.json({
      message: 'only mp3 file a.mp3 and b.mp3 is supported',
    }, {
      status: 404,
    })
  }
}))


export default app
```


### audioContext

如前文概念所述, audioContext是处理音频的关键对象, 音频所需要的所有处理过程均在 audioContext 程序空间中进行. 因此首先应该创建AudioContext对象


```typescript
const audioContext=new AudioContext()
```

### MediaSouce

```typescript
const mediaSourceManager = new MediaSource()
```

### 建立处理逻辑

现在要指定 audioContext 如何处理 各种audioNode的处理前后关系. 代码如下

```typescript
const audio=new Audio()

audio.src = URL.createObjectURL(mediaSourceManager)
audio.autoplay = true

const audioSouceNode = audioContext.createMediaElementSource(audio)
audioSouceNode.connect(audioContext.destination)

```

此处建立逻辑关机有点复杂

使用audio api主要是想用来控制播放与音频播放

将mediaSouce 通过URL.createObjectURL赋值给src,  是因为很多浏览器无法支持srcObjct的赋值方式, 作为回退才这么使用的.

然后通过AudioContext.createMediaElementSource(audio) 创建一个 音频源 AudioNode

最后将 音频源 AudioNode 直接连接播放器, 也就是 AudioDestinationNode

这样, 通过MediaElementAudioSourceNode直接到AudioDestinationNode 的音频处理关系就完成了, 没有任何中间的音频增益处理节点.

完成了最简单的 audioContext 的 音频处理关系的建立.


至此, 基本程序算是准备完毕了. 但现在还没有对准备好的程序输入音频, 也就是为MediaSouce 添加音频数据.


### 创建音频数据流接收对象

现在mediaSource只能算一个媒体源管理对象, 用于管理多个音频源. 因此要添加音频源, 必须通过管理对象指定

特别注意的是, 在管理对象创建之前, 必须等该对象已经准备好的时候才能才是创建, 否则程序将会报错. 换句话说, 必须等待管理器准备好接受数据源时才能创建源.


```typescript
let sourceBuffer: SourceBuffer
mediaSourceManager.addEventListener('sourceopen', async () => {
  console.log('sourceopen', mediaSourceManager.readyState);
  if (sourceBuffer) { return }
  sourceBuffer = mediaSourceManager.addSourceBuffer('audio/mpeg')
})

```

这样, 就通过 mediaSourceManager 创建了一个音频接受对象, 该对象可以通过来appendBuffer方法添加(处理/消费)不断流入的音频数据流.

### 获得数据流(建立管道)


```typescript
let loaded = false
function loadMp3(url?: string) {
  if (loaded) {
    return
  }
  kyInstance(url ?? 'mp3/b.mp3').then(async res => {
    if (!res.body) {
      return
    }
    setupSourceBuffer(res.body)
  })
}
```

### 为 sourceBuffer 写入音频数据

```typescript
async function awatingSourceBuffer() {
  const { resolve, promise } = Promise.withResolvers<void>()
  sourceBuffer.addEventListener('updateend', () => resolve(), { once: true })
  return promise
}

function setupSourceBuffer(readableStream: ReadableStream) {
  const writerStream = new WritableStream({

    start(controller) {
      console.log('开始接受媒体流数据');
    },
    async write(chunk, controller) {
      const { resolve, reject, promise } = Promise.withResolvers<void>()
      while (sourceBuffer.updating) {
        // 等待更新状态稳定
        console.log('sourceBuffer 正在更新, 等待更新完成');

        await awatingSourceBuffer()
      }

      const arrayBuffer = chunk.buffer.slice(
        chunk.byteOffset,
        chunk.byteOffset + chunk.byteLength
      );

      try {
        if (sourceBuffer.updating) {
          return reject(new Error('致命错误:sourceBuffer 处于异常更新状态'))
        }
        sourceBuffer.appendBuffer(arrayBuffer);
        console.log('写入sourceBuffer完成, 写入大小:', arrayBuffer.byteLength);
        resolve()

      } catch (error) {
        reject(error)
      }
      return promise
    },
    async close() {
      console.log('音频数据已接收完毕');
      loaded = true
      while (sourceBuffer.updating) {
        console.log('sourceBuffer 正在更新, 等待更新完成');
        await awatingSourceBuffer()
      }
      console.log('结束数据流 , 将数据流写入sourceBuffer完成,开始endOfStream');
      mediaSourceManager.endOfStream();
    },
    abort(reason) {
      console.log('SourceBuffer WritableStream aborted:', reason);
    }
  })
  readableStream.pipeTo(writerStream)
}
```
