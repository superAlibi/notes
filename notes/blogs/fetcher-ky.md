---
outline: [2,3]
---

# Ky 浅谈

> Ky 是一个零依赖、底层基于现代 API Fetch 的轻量级 HTTP 请求工具。

在使用 Ky 前，我曾长期使用 Axios。但最近开始接触 AI 后，发现 Axios 对现代浏览器特性的支持不太理想，因其底层基于 `XMLHttpRequest`，是过去时代的产物。

相对应地，Ky 底层采用的是现代异步请求 API `Fetch`，此 API 设计出来就是用于替换 `XMLHttpRequest` 的。

## 说明

**流畅阅读本文所有案例，读者需要具备以下知识储备：**

- 了解 [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 对象
- 熟悉 [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch)
- 了解 `XMLHttpRequest` 与 `Fetch` 的区别

本文在案例中发起实际请求时，会使用服务器进行验证。服务器运行于 Deno，项目结构如下：

```
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

`deno.json` 文件包含了 Deno 运行时的依赖和项目的启动脚本：

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

JSON 文件中描述了启动本服务器的命令 `dev`，以及对 [h3](https://h3.dev/) 库的依赖。h3 是一款轻量级的 Web 服务器，本文案例背后的服务器使用的就是 h3。

**main.ts**

```typescript{9-19}
import { H3, serve } from "h3";
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

其中 main 文件声明了很多前缀，详情见 [GitHub](https://github.com/superAlibi/deno_h3.git)。

## 设计理念

Ky 在设计时，参数与 Fetch API 是兼容的，但又对 Fetch 的第二个参数进行了拓展。

Ky 在原型上拓展了 HTTP 方法同名的方法，例如：

- `ky.post(url, options)`
- `ky.get(url, options)`
- `ky.put(url, options)`
- `ky.patch(url, options)`

可以说，Ky 是对 Fetch API 实用性的拓展。即使 Fetch API 已经很不错，但 Ky 用起来会更加顺手！

接下来将对 Ky 在兼容原生 Fetch API 的基础上，对“拓展的属性”进行演示。

## API

- `ky(input, options?)`
- `ky.get(input, options?)`
- `ky.post(input, options?)`
- `ky.put(input, options?)`
- `ky.patch(input, options?)`
- `ky.head(input, options?)`
- `ky.delete(input, options?)`
- `ky.extend(options)`
- `ky.create(options)`

## 常用参数

这里的常用参数实际上是指 Ky 方法的第二个参数，也就是 `options`。第一个参数表示字符串请求地址、[Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 对象或 [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL) 对象。

### body

通常，使用 `body` 时表示发送 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `application/json` 数据。

这里的 `body` 实际上就是 `RequestInit` 结构中的 `body` 参数，类型为 `BodyInit`，与 Fetch 第二个参数中的 `body` 是一致的。

例如发送 `application/x-www-form-urlencoded`：

> [!WARNING]
> 在传入 `body` 时，请确保 HTTP 方法支持。

```typescript
import ky from "ky";

const kyInstance = ky.create({
  prefixUrl: '/api',
});

kyInstance('success/200', {
  method: 'post', // [!code warning]
  body: new URLSearchParams({
    name: 'lucardo',
    age: '20'
  })
}).json();

// 或者
kyInstance.post('success/200', { // [!code warning]
  body: new URLSearchParams({
    name: 'lucardo',
    age: '20'
  })
}).json();
```

发送包含文件的表单或 `multipart/form-data` 格式的 body：

```typescript
const formData = new FormData();
formData.append('name', 'lucardo');
formData.append('age', '20');

kyInstance.post('success/200', { body: formData }).json();
```

使用 `body` 发送 JSON 数据时，需要手动设置 header：

```typescript
kyInstance.post('success/200', {
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'lucardo5',
    age: '20'
  })
});
```

### json

现代开发中，通常与后台对接接口时均采用 JSON 交换数据信息。Ky 也专门为发送 JSON 准备了属性：

```typescript
kyInstance.post('success/200', {
  json: {
    name: 'lucardo4',
    age: '20'
  }
}).json();
```

使用 `json` 属性可以免去调用 `JSON` 对象手动序列化，同时还可以免去设置 header。因此，在现代开发中，此属性应该会更常用一些。

### searchParams

此属性用于自动拼接到 URI 地址上，也就是通常 URL 地址上的查询参数。

```typescript
kyInstance('success/200', {
  headers: {
    'Accept': 'application/json'
  },
  searchParams: {
    name: 'lucardo6',
    age: '20'
  }
}).json();
```

传入 `searchParams` 后，发送的实际 URL 为 `/api/success/200?name=lucardo6&age=20`。

`searchParams` 参数的实际类型应该是 `URLSearchParams` 对象的构造函数参数。

### prefixUrl

此方法用于在第一个参数前面追加前缀。请注意，这个参数只有在调用 `ky.create()` 或 `ky.extend()` 时才会用到。

下面有一些例子：

```typescript
import ky from 'ky';

// 例如当前的域名为 https://example.com

const response = await ky('unicorn', { prefixUrl: '/api' });
// 将请求 => 'https://example.com/api/unicorn'

const response2 = await ky('unicorn', { prefixUrl: 'https://cats.com' });
// 将请求 => 'https://cats.com/unicorn'
```

在使用此参数的情况下，第一个参数就不能以 `/` 开头。也就是 `ky.[httpMethod](input, options)` 或 `ky(input, options)` 的 `input` 参数不能以 `/` 开头。

至于原因，[官方文档](https://www.npmjs.com/package/ky#prefixurl) 表示：

> - After prefixUrl and input are joined, the result is resolved against the base URL of the page (if any). 
> - Leading slashes in input are disallowed when using this option to enforce consistency and avoid confusion about how the input URL is handled, given that input will not follow the normal URL resolution rules when prefixUrl is being used, which changes the meaning of a leading slash.

**通俗解释：**

当使用 `prefixUrl` 时，Ky 会按照以下规则处理 URL：

1. **URL 拼接规则**：`prefixUrl + input` 拼接后的结果会相对于页面的 base URL 进行解析。
2. **禁止前导斜杠**：`input` 参数不能以 `/` 开头。

**原因分析：**
- 正常情况下，以 `/` 开头的 URL 表示从域名根路径开始。
- 但使用 `prefixUrl` 后，URL 解析规则发生了变化。
- 如果允许前导斜杠，会导致混淆：用户可能以为是从根（host 后面第一个 `/`）路径开始，实际却是从 `prefixUrl` 开始。
- 禁止前导斜杠可以强制保持一致性，避免歧义。

**举例说明：**
```typescript
// ❌ 错误：不能以 / 开头
kyInstance('/users');  // 这样会报错

// ✅ 正确：直接写路径
kyInstance('users');   // 最终 URL: /api/users

// 如果允许前导斜杠，用户可能会困惑：
// kyInstance('/users') 到底是指 /users 还是 /api/users？
```

### retry {#options-retry}

相比 Axios，`retry` 功能在服务端响应错误时可以自动进行重试操作。`retry` 参数用来配置重试逻辑和次数。

官方给出的默认配置是符合客观默认有效值的，此处不再做过多介绍，如有需要可以参考[官方文档](https://www.npmjs.com/package/ky#retry)。

其值可以有“两种”形式：数字和配置对象。

默认值为：

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

与常用工具 Axios 相同，在请求超过一定时间后直接中断连接，并抛出 `TimeoutError` 异常。官方默认值为 `10 秒`，非常合理！此参数的基本单位是毫秒，也就是说官方默认值为 `10 * 1000`。

## Hooks

Hooks 用于在请求的不同阶段：请求前（`beforeRequest`）、响应后（`afterResponse`）、重新请求前（`beforeRetry`）、抛出错误前（`beforeError`），对行为进行修改。钩子函数可以是异步的，并按照配置顺序依次执行。

### beforeRequest

此 Hook 使您能够在发送请求之前对其进行修改。在此之后，Ky 将不会对请求进行进一步更改。钩子函数接收请求和选项作为参数，例如，您可以在此处修改 `request.headers`。

钩子可以返回一个请求来替换传出的请求，或者返回一个响应来完全避免发出 HTTP 请求。这可以用于模拟请求、检查内部缓存等。当从该钩子返回请求或响应时，一个重要的考虑事项是将跳过任何剩余的 `beforeRequest` 钩子，因此您可能希望只从最后一个钩子返回它们。

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

此 Hook 需要配合 [`options.retry`](#options-retry) 使用。

不做具体介绍，具体查看[官方文档](https://www.npmjs.com/package/ky#hooksbeforeretry)，太复杂了，本人未曾使用。

### afterResponse

该钩子使您能够读取并有选择地修改响应。钩子函数参数共三个，依次为标准的 `Request`、`options` 和 `Response` 对象的 clone 作为参数。如果钩子函数的返回值是 `Response` 的实例，Ky 将使用它作为响应对象。

```typescript
kyInstance('server-error/503', {
  hooks: {
    afterResponse: [
      (_request, _options, response) => {
        // You could do something with the response, for example, logging.
        console.log(response);

        // 或者返回个 Response，覆盖原来的响应
        return new Response('返回一个不同的响应', { status: 200 });
      },

      // 或者在遇到 403 错误时，重新发起请求以获得 token
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
});
```

> [!WARNING]
> 请注意，如果在 `afterResponse` 中抛出错误，将导致剩下的 Hook 直接跳过，并将异常直接抛出到用户层，而不是 `beforeError` Hook 中。因此，如果想让自定义的错误还可以流转到 `beforeError` Hook，请重新实例化一个 `Response` 对象并返回，`Response` 的 `status` 参数确保为 HTTP 错误状态码即可。

```typescript
kyInstance('server-error/503', {
  hooks: {
    afterResponse: [
      (_request, _options, response) => {
        // You could do something with the response, for example, logging.
        if (some_condiction) {
          throw new HTTPError(response, _request, _options);
        }

        // 或者返回个 Response，覆盖原来的响应
        return new Response('返回一个不同的响应', { status: 200 });
      },

      // 因为上一个 Hook 抛出了错误，因此该 Hook 不会执行
      async (request, options, response) => {
        // 做点什么事情
      }
    ],
    beforeRetry: [
      // 此 Hook 会执行
      (state) => {
        console.log('custom beforeRetry', state);
        return ky.stop;
      }
    ],
    beforeError: [
      // 因为在 afterResponse 中抛出了错误，因此该 Hook 不会执行
      (error) => {
        const { response, request, options } = error;
        console.error('custom beforeError', error);
        return error;
      }
    ]
  }
});
```

### beforeError

该 Hook 用于对抛出 `HTTPError` 前进行修改，也就是说只有在 HTTP 响应状态码（重定向后）为非正常状态码时才会走该 Hook。

```typescript
import ky from 'ky';

await ky('https://example.com', {
  hooks: {
    beforeError: [
      error => {
        const { response } = error;
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

## 拓展实例（extend）

创建一个新的 Ky 实例，其中一些默认值被您自己的覆盖。

与 `ky.create()` 不同，`ky.extend()` 继承其父级的默认值。

您可以将标头作为 `Headers` 实例或普通对象传递。

您可以通过传递带有 `undefined` 值的标头来使用 `.extend()` 删除标头。将 `undefined` 作为字符串传递只会删除来自 `Headers` 实例的标头。

同样，您可以通过使用显式 `undefined` 扩展钩子来删除现有的钩子条目。

```typescript
import ky from 'ky';

const url = 'https://sindresorhus.com';

const original = ky.create({
  headers: {
    rainbow: 'rainbow',
    unicorn: 'unicorn'
  },
  hooks: {
    beforeRequest: [() => console.log('before 1')],
    afterResponse: [() => console.log('after 1')],
  },
});

const extended = original.extend({
  headers: {
    rainbow: undefined
  },
  hooks: {
    beforeRequest: undefined,
    afterResponse: [() => console.log('after 2')],
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

您还可以通过为 `.extend()` 提供一个函数来引用父默认值：

```typescript
import ky from 'ky';

const api = ky.create({ prefixUrl: 'https://example.com/api' });

const usersApi = api.extend((options) => ({ prefixUrl: `${options.prefixUrl}/users` }));

const response = await usersApi.get('123');
//=> 'https://example.com/api/users/123'

const response = await api.get('version');
//=> 'https://example.com/api/version'
```

## 创建全新实例 create

使用全新的默认值创建新的 Ky 实例。

```typescript
const kyInstance = ky.create({
  prefixUrl: '/api',
  retry: 1,
  hooks: {
    beforeRequest: [
      (request, options) => {
        console.log('base beforeRequest');
      }
    ],
  }
});

const newInstance = kyInstance.create({
  prefixUrl: '/api',
  retry: 1,
  hooks: {
    beforeRequest: [
      (request, options) => {
        console.log('new beforeRequest');
      }
    ],
  }
});

await newInstance('success/201').json();
// => new beforeRequest

await kyInstance('success/201').json();
// => base beforeRequest
```

## Ky 内置的 HTTPError 对象

该对象只会在服务器正确响应的情况下才会出现此错误，所以当网络不可达时，Ky 可能不会抛出此异常。

---
**改写说明**：
- 统一和规范了专有名词、代码标识符及技术术语的大小写与标点
- 优化了中英文混排时的空格，使内容间距更一致易读
- 调整了部分句式和段落结构，提升技术表达准确性和条理性

如果您有其他风格或细节方面的偏好，我可以进一步调整内容表达。