---

outline: [2,3]
---
# ky浅谈


> ky 一个零依赖,底层基于现代 api fetch 的轻量级请求工具库

在使用ky前, 我曾一度使用的是axios, 但最近开始接触到 ai 后, 开始发现 axios 对现代浏览器特性支持不太行. 因为其底层是基于 `XMLHttpRequest` 注定是过去时代的产物

相对应的, ky 底层采用的是现代异步请求api `fetch`, 此 api 设计出来, 就是用于替换 `XMLHttpRequest`. 

## 说明

**流畅阅读本文所有的案例, 读者需要具备以下知识储备**

- 了解 [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 对象
- 熟悉 [fetch api](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch)
- 了解 `XMLHttpRequest` 与 `fetch` 区别

本文在文中有些许案例. 其中案例发起实际请求时, 会使用到服务器用来验证. 服务器运行于 deno . 其中项目结构如下

```text
.
├── apps
│   ├── client-error.ts
│   ├── redirect.ts
│   ├── server-error.ts
│   ├── success.ts
│   └── timeout.ts
├── deno.json
├── deno.lock
└── main.ts
```

`deno.json` 文件包含了deno运行时的依赖和项目的启动脚本

```json
{
  "tasks": {
    "dev": "deno run -A --watch main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "h3": "https://esm.sh/h3@2.0.0-beta.3"
  }
}

```
json文件中描述了启动本服务器的命令dev,以及 对 [h3](https://h3.dev/) lib的依赖. h3是一款轻量级的 web 服务器. 本文案例背后的服务器就是使用的 h3

**main.tx**

```typescript{9-19}
import {  H3, serve } from "h3";
import successResponse from "./apps/success.ts";
import redirectResponse from "./apps/redirect.ts";
import clientError from "./apps/client-error.ts";
import serverError from "./apps/server-error.ts";
import timeoutResponse from "./apps/timeout.ts";
const app = new H3();

app.mount("/success", successResponse);
app.mount("/redirect", redirectResponse);
app.mount("/client-error", clientError);
app.mount("/server-error", serverError);
app.mount("/timeout", timeoutResponse);
app.mount("*", successResponse);
serve(app, { port: 3000 });
```

其中main文件声明了很多前缀, , 详情见[github](https://github.com/superAlibi/deno_h3.git)

## 设计理念

关于 ky 设计时 , 参数 和 fetch api 是兼容的. 但是 又对 fetch的第二个参数进行了拓展.

且 ky 在原型上拓展了 http 方法同名的方法.

例如

- ky.post(url, options)
- ky.get(url , options)
- ky.put(url , options)
- ky.patch(url, options)

可以说就是对fetch api 实用性的拓展. 

即使 fetch api 已经很不错了, 但是 ky 用起来会更加顺手!

接下来对ky 在兼容原生api fetch 的基础上, 对 `拓展的属性` 进行演示

## api

- ky(input, options?)
- ky.get(input, options?)
- ky.post(input, options?)
- ky.put(input, options?)
- ky.patch(input, options?)
- ky.head(input, options?)
- ky.delete(input, options?)
- ky.extend(options)
- ky.create(options)


## 常用参数

这里的常用参数实际上是指的ky方法的第二个参数. 也就是 options, 第一参数表示字符串请求地址, [Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)对象或[URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)对象


### body

通常, 使用body时, 表示发送application/x-www-form-urlencoded , multipart/form-data 或 application/json 数据

这里的body 实际上就是 RequestInit 结构的 body 参数, 类型为 BodyInit. 和 fetch 第二个参数中body是一致的

例如发送application/x-www-form-urlencoded

> [!WARNING]
> 在传入 body 时请确保 http 方法支持

```typescript
import ky from "ky";

const kyInstance = ky.create({
  prefixUrl: '/api',
})
kyInstance('success/200', {
  method: 'post', // [!code warning]
  body: new URLSearchParams({
    name: 'lucardo',
    age: '20'
  })
}).json()
// 或者
kyInstance.post('success/200', { // [!code warning]
  body: new URLSearchParams({
    name: 'lucardo',
    age: '20'
  })
}).json()
```

发送包含文件的表单 或 `multipart/form-data` 格式的body

```typescript
const formData = new FormData()
formData.append('name', 'lucardo')
formData.append('age', '20')
kyInstance.post('success/200', {body: formData}).json()
```


使用body 发送 json 数据时, 需要手动设置header

```typescript
kyInstance.post('success/200', {
  headers: {
    'Content-Type': 'application/json'
  },
    body:JSON.stringify({
    name: 'lucardo5',
    age: '20'
  })
})
```

### json

现代开发中, 通常与后台对接接口时, 均采用json交换数据信息. ky也专门为发送json准备了属性


```typescript
kyInstance.post('success/200', {
  json: {
    name: 'lucardo4',
    age: '20'
  }
}).json()
```

使用json,可以不用调用 JSON 对象手动序列化, 同时还可以免去设置header, 因此, 在现代开发中,此属性应该会用得多一些. 

### searchParams

此属性用于自动凭借到uri地址上,也就是通常url地址上的查询参数.
```typescript
kyInstance('success/200', {
  headers: {
    'Accept': 'application/json'
  },
  searchParams: {
    name: 'lucardo6',
    age: '20'
  }
}).json()
```

传入 searchParams 后, 就会发现, 发送实际url为 `/api/success/200?name=lucardo6&age=20`

searchParams参数实际上应该的类型实际上就是 URLSearchParams 对象的构造函数参数.

### prefixUrl

此方法用来在基于第一个参数前面追加前缀. 请相信我, 这个参数只有在调用 `ky.create()` 或 `ky.extend()` 才会用到.




下面有一些例子:

```typescript
import ky from 'ky';

// 例如当前的域名为 https://example.com

const response = await ky('unicorn', {prefixUrl: '/api'});
//将请求=> 'https://example.com/api/unicorn'

const response2 = await ky('unicorn', {prefixUrl: 'https://cats.com'});
//将请求=> 'https://cats.com/unicorn'
```

在使用了此参数的情况下, 第一个参数就不能以 `/` 开头. 也就是ky.\[httpMethod](input,opitons) 或 ky(input, options) 的input参数不能以 `/` 开头

至于原因, [官方文档](https://www.npmjs.com/package/ky#prefixurl) 表示:

> - After prefixUrl and input are joined, the result is resolved against the base URL of the page (if any). 
> - Leading slashes in input are disallowed when using this option to enforce consistency and avoid confusion about how the input URL is handled, given that input will not follow the normal URL resolution rules when prefixUrl is being used, which changes the meaning of a leading slash.

**通俗解释：**

当使用 `prefixUrl` 时，ky 会按照以下规则处理 URL：

1. **URL 拼接规则**：`prefixUrl + input` 拼接后的结果会相对于页面的 base URL 进行解析
2. **禁止前导斜杠**：`input` 参数不能以 `/` 开头

**原因分析**：
   - 正常情况下，以 `/` 开头的 URL 表示从域名根路径开始
   - 但使用 `prefixUrl` 后，URL 解析规则发生了变化
   - 如果允许前导斜杠，会导致混淆：用户可能以为是从根(host后面第一个 `/` )路径开始，实际却是从 `prefixUrl` 开始
   - 禁止前导斜杠可以强制保持一致性，避免歧义

**举例说明：**
```typescript
// ❌ 错误：不能以 / 开头
kyInstance('/users')  // 这样会报错

// ✅ 正确：直接写路径
kyInstance('users')   // 最终 URL: /api/users

// 如果允许前导斜杠，用户可能会困惑：
// kyInstance('/users') 到底是指 /users 还是 /api/users？
```

### retry {#options-retry}

相比,axios ,retry 功能在服务端响应错误时, 可以自动进行重试操作. retry 参数用来配置重试逻辑和次数的.

官方给出的默认配置, 是符合客观默认有效值的. 此处不再做过多介绍, 如有需要可以参考[官方文档](https://www.npmjs.com/package/ky#retry)

其值可以有 `两种` 形式 ,数字和配置对象.

默认值为

```typescript
{
  limit: 2,
  methods: ['get', 'put', 'head', 'delete', 'options', 'trace', 'post'],
  statusCodes: [408, 413, 429, 500, 502, 503, 504],
  afterStatusCodes: [413, 429, 503],
  maxRetryAfter: void 0,
  backoffLimit: void 0,
  delay: attemptCount => 0.3 * (2 ** (attemptCount - 1)) * 1000
}
```

### timeout

与常用工具 axios 相同 ,在请求超过一定实践后直接中断连接, 并抛出 `TimeoutError` 异常 官方默认值为`10秒` , 非常合理! 当然此参数的基本单位是毫秒也就是说官方默认值为 `10*1000`


## hooks

hooks 是用来在请求的不同阶段: 请求前(beforeRequest),响应后(afterResponse), 重新请求前(beforeRetry), 抛出错误前(beforeError) , 对行为进行修改. 钩子函数是可以异步的, 并按照配置顺序依次执行.


### beforeRequest

此hook使您能够在发送请求之前对其进行修改。在此之后，Ky将不会对请求进行进一步更改。钩子函数接收请求和选项作为参数。例如，您可以在此处修改request.headers。

钩子可以返回一个请求来替换传出的请求，或者返回一个响应来完全避免发出HTTP请求。这可以用于模拟请求、检查内部缓存等。当从该钩子返回请求或响应时，一个重要的考虑事项是将跳过任何剩余的beforeRequest钩子，因此您可能希望只从最后一个钩子返回它们。

```typescript
import ky from 'ky';

const api = ky.extend({
	hooks: {
		beforeRequest: [
			request => {
				request.headers.set('X-Requested-With', 'ky');
			}
		]
	}
});

const response = await api.get('https://example.com/api/users');
```

### beforeRetry

此hook需要配合[options.retry](#options-retry)使用.

不做具体介绍, 具体查看[官方文档](https://www.npmjs.com/package/ky#hooksbeforeretry), 太复杂了, 本人未曾使用

### afterResponse

该钩子使您能够读取并有选择地修改响应。钩子函数参数共三个, 依次为标准的 Request、options 和 Response 对象的 clone 作为参数。如果钩子函数的返回值是 Response 的实例，Ky将使用它作为响应对象。



```typescript
kyInstance('server-error/503', {
  hooks: {
    afterResponse: [
      (_request, _options, response) => {
        // You could do something with the response, for example, logging.
        console.log(response);

        // 或者返回个Response, 覆盖原来的响应
        return new Response('返回一个不同的响应', { status: 200 });
      },

      // 或者在遇到403错误时，重新发起请求以获得token
      async (request, options, response) => {
        if (response.status === 403) {
          // Get a fresh token
          const token = await ky('https://example.com/token').text();

          // Retry with the token
          request.headers.set('Authorization', `token ${token}`);

          return ky(request);
        }
      }
    ]
  }
})
```


> [!WARNING]
> 请注意, 如果在afterResponse中抛出错误,将导致剩下的hook直接跳过. 并将异常直接抛出到用户层,
> 而不是 beforeError hook中 , 因此, 如果想让自定义的错误还可以流转到 beforeError hook , 请
> 重新实例化一个Response对象并返回, Response的status参数确保为http错误状态码即可.


```typescript
kyInstance('server-error/503', {

  hooks: {
    afterResponse: [
      (_request, _options, response) => {
        // You could do something with the response, for example, logging.
        if (some_condiction) {
          throw new HTTPError(response, _request, _options)
        }

        // 或者返回个Response, 覆盖原来的响应
        return new Response('返回一个不同的响应', { status: 200 });
      },

      //  因为上一个hook 抛出了错误, 因此该hook 不会执行
      async (request, options, response) => {
        // 做点什么事情
      }
    ],
    beforeRetry: [
      // 此hook会执行
      (state) => {
        console.log('custom beforRetry', state)
        return ky.stop
      }
    ],
    beforeError: [
      // 因为在afterResponse 中抛出了错误, 因此该hook 不会执行
      (error) => {
        const { response, request, options } = error
        console.error('custom beforeError', error)
        return error
      }
    ]
  }
})
```


### beforeError

该hook用于对抛出HTTPError前进行修改, 也就是说只有在http响应状态码(重定向后)为非正常状态码时才会走该hook

```typescript
import ky from 'ky';

await ky('https://example.com', {
	hooks: {
		beforeError: [
			error => {
				const {response} = error;
				if (response && response.body) {
					error.name = 'GitHubError';
					error.message = `${response.body.message} (${response.status})`;
				}

				return error;
			}
		]
	}
});
```


## 拓展实例(extend)

创建一个新的ky实例，其中一些默认值被您自己的覆盖。

与ky.create（）不同，ky.extend（）继承其父级的默认值。

您可以将标头作为headers实例或普通对象传递。

您可以通过传递带有未定义值的标头来使用.extend（）删除标头。将undefined作为字符串传递只会删除来自Headers实例的标头。

同样，您可以通过使用显式undefined扩展钩子来删除现有的钩子条目。

```typescript
import ky from 'ky';

const url = 'https://sindresorhus.com';

const original = ky.create({
	headers: {
		rainbow: 'rainbow',
		unicorn: 'unicorn'
	},
	hooks: {
		beforeRequest: [ () => console.log('before 1') ],
		afterResponse: [ () => console.log('after 1') ],
	},
});

const extended = original.extend({
	headers: {
		rainbow: undefined
	},
	hooks: {
		beforeRequest: undefined,
		afterResponse: [ () => console.log('after 2') ],
	}
});

const response = await extended(url).json();
//=> after 1
//=> after 2

console.log('rainbow' in response);
//=> false

console.log('unicorn' in response);
//=> true
```

您还可以通过为.extend（）提供一个函数来引用父默认值。
```typescript
import ky from 'ky';

const api = ky.create({prefixUrl: 'https://example.com/api'});

const usersApi = api.extend((options) => ({prefixUrl: `${options.prefixUrl}/users`}));

const response = await usersApi.get('123');
//=> 'https://example.com/api/users/123'

const response = await api.get('version');
//=> 'https://example.com/api/version'
```


## 创建全新实例 create

使用全新的默认值创建新的Ky实例。

```typescript
const kyInstance = ky.create({
  prefixUrl: '/api',
  retry: 1,
  hooks: {
    beforeRequest: [
      (request, options) => {
        console.log('base beforeRequest')
      }
    ],

  }
})

const newInstance = kyInstance.create({
  prefixUrl: '/api',
  retry: 1,
  hooks: {
    beforeRequest: [
      (request, options) => {
        console.log('new beforeRequest')
      }
    ],
  }
})
await newInstance('success/201').json()
// => new beforeRequest
await kyInstance('success/201').json()
// => base beforeRequest

```


## ky内置的HTTPError对象

该对象只会在 服务器正确响应了的情况下才会出现此错误, 所以当网络不可达时, ky可能不会抛出此异常.
