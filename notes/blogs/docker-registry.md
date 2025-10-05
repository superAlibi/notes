---
outline: [3,4]
---

本文为自建镜像仓库中心所遇到的问题点, 由ai负责总结/输出的. 

本人已早有决心搭建一个个人的镜像注册中心, 受限于工作的繁忙和琐事, 一时没有完整的文案输出. 前段时间结合edge的copilot阅读文档时, 总结了本文

本文已有一些详细地址, 但是均需要相关权限才能正常使用


## 待补充内容

- 变量规则与config.yml的关系, 此为registry与config.yml 配合 补充了 registry 的配置能力

## Podman + Docker Registry + NPM 配置指南

### 🧱 一、目标架构

你成功构建了一个安全的私有镜像仓库系统：

```
Podman 客户端 → HTTPS → Nginx Proxy Manager (NPM) → Docker Registry (带 htpasswd 认证)
```

- 使用 NPM 提供 HTTPS（通过 Let's Encrypt）
- Registry 本身启用 Basic Auth（`htpasswd`）
- 支持非标准端口（如 `4443`）

---

### 🔐 二、认证机制

- 使用 `htpasswd` 创建用户认证文件：
  ```bash
  htpasswd -b -B ./auth/htpasswd username password
  ```
- 可通过 `htpasswd-ui` 提供 Web UI 管理用户
- Registry 配置环境变量启用认证：
  ```yaml
  REGISTRY_AUTH: htpasswd
  REGISTRY_AUTH_HTPASSWD_REALM: "Docker Registry"
  REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
  ```

---

### ⚙️ 三、Podman 与 Systemd 集成

- 使用 `podman generate systemd --name <container>` 生成服务文件
- 用户级服务文件路径为：
  ```
  ~/.config/systemd/user/
  ```
- 启用 linger 后可实现开机自动启动：
  ```bash
  sudo loginctl enable-linger yourusername
  ```

---

### 🌐 四、Nginx Proxy Manager 配置

- 添加 Proxy Host：
  - 域名：`dr.lucardo.website`
  - 转发地址：`localhost:5000`
  - 启用 SSL（Let's Encrypt）
  - 勾选 Websockets 和 Block Common Exploits
- 支持非标准端口（如 `4443`）通过外部防火墙或端口映射实现

---

### 🧠 五、Podman 客户端信任配置

- 创建配置文件 `/etc/containers/registries.conf.d/dr.conf`：
  ```toml
  [[registry]]
  prefix = "dr.lucardo.website:4443"
  location = "dr.lucardo.website:4443"
  insecure = false
  ```
- 如果使用自签名证书，需将 CA 放入：
  ```
  /etc/containers/certs.d/dr.lucardo.website:4443/ca.crt
  ```

---

### 🧪 六、Registry 配置文件覆盖机制

- 使用完整的 `config.yml` 文件挂载到容器中：
  ```yaml
  http:
    addr: :5000
    host: https://dr.lucardo.website:4443
  ```
- 环境变量如 `REGISTRY_HTTP_HOST` 可覆盖简单字段，但不推荐用于嵌套结构

---

### 🔍 七、查看远程 Registry 内容

- 使用 Skopeo：
  ```bash
  skopeo list-tags docker://dr.lucardo.website:4443/registry
  ```
- 使用浏览器访问 Registry API：
  - 查看仓库列表：[dr.lucardo.website:4443/v2/_catalog](https://dr.lucardo.website:4443/v2/_catalog)
  - 查看某仓库 tags：[dr.lucardo.website:4443/v2/registry/tags/list](https://dr.lucardo.website:4443/v2/_catalog)



---

## 🧾 Podman Registry 部署总结

### 🐳 容器运行命令

```bash
podman run -p 5000:5000 \
  -d \
  --name registry \
  -e REGISTRY_AUTH=htpasswd \
  -e REGISTRY_HTTP_HOST=https://dr.lucardo.website:4443 \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -v data:/var/lib/registry:Z \
  -v auth:/auth:Z \
  docker.io/library/registry:3
```

---

### 🔐 功能说明

| 配置项                                               | 作用                                                 |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `REGISTRY_AUTH=htpasswd`                             | 启用 Basic Auth 认证                                 |
| `REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd`         | 指定认证文件路径                                     |
| `REGISTRY_AUTH_HTPASSWD_REALM="Registry Realm"`      | 设置认证提示名称                                     |
| `REGISTRY_HTTP_HOST=https://dr.lucardo.website:4443` | 显式指定 Registry 外部访问地址（解决非标准端口问题） |
| `-v data:/var/lib/registry:Z`                        | 持久化镜像数据                                       |
| `-v auth:/auth:Z`                                    | 挂载认证文件目录                                     |
| `-p 5000:5000`                                       | 映射 Registry 端口到主机                             |

---

### 🌐 Nginx Proxy Manager 配置

- 域名：`dr.lucardo.website`
- 转发地址：`localhost:5000`
- 启用 SSL（Let's Encrypt）
- 强制 HTTPS、启用 Websockets 和 Block Common Exploits
- 外部访问端口：`4443`（通过防火墙或端口映射实现）

---

### 🧠 客户端配置（Podman）

#### 配置 Registry 信任：

```toml
# /etc/containers/registries.conf.d/dr.conf
[[registry]]
prefix = "dr.lucardo.website:4443"
location = "dr.lucardo.website:4443"
insecure = false
```

#### 如果使用自签名证书：

```bash
/etc/containers/certs.d/dr.lucardo.website:4443/ca.crt
```

---

### 🔍 查看远程 Registry 内容

你成功访问了：

```
https://dr.lucardo.website:4443/v2/_catalog
```

返回内容：

```json
{
  "repositories": ["myimage", "react-router", "registry"]
}
```

说明你的 Registry 已成功运行并存储镜像。





完全理解你的顾虑 👍。如果你不打算使用 OpenTelemetry trace 功能，目前最稳妥的做法就是**彻底屏蔽掉 trace 上传行为**，避免日志持续增长、资源浪费或安全隐患。

---

## ✅ 屏蔽 OpenTelemetry trace 的方法（推荐）

### 🧱 方法一：设置环境变量禁用 trace 导出

在你的容器或服务启动时添加：

```bash
-e OTEL_TRACES_EXPORTER=none
```

这会完全关闭 trace 数据的导出功能。

---

### ⚙️ 方法二：Podman 层面禁用 Telemetry（如果是 Podman 自身触发）

编辑 Podman 的配置文件：

```bash
sudo nano /etc/containers/podman.conf
```

添加或修改：

```ini
[engine]
events_logger = "file"  # 或 "journald"，避免使用 "otel"
```

然后重启 Podman 服务：

```bash
systemctl restart podman
```

---

### 🔍 方法三：关闭 OpenTelemetry Collector（如果你部署了它）

如果你运行了 `otel-collector` 容器并监听 `4318` 端口，可以直接停止它：

```bash
podman stop otel-collector
podman rm otel-collector
```

或者在防火墙中屏蔽 `4318` 端口。

---

### 🧠 补充建议

- 如果你使用的是某些语言 SDK（如 Java、Go、Node.js），也可以在代码中禁用 tracer 初始化
- 检查是否有自动注入的 agent 或 sidecar（如 `opentelemetry-javaagent.jar`）

---

如果你想我帮你生成一个干净的 Podman 配置模板，完全禁用 trace 和 telemetry，我可以一步到位帮你搞定。你希望只保留日志功能，还是连事件记录都关闭？





```text
time="2025-09-14T16:26:01.256759178Z" level=debug msg="{\"Name\":\"Stat\",\"SpanContext\":{\"TraceID\":\"15f7c5ff99e1ee3f3cba295afac7d758\",\"SpanID\":\"b90fc7a0bc511fd6\",\"TraceFlags\":\"01\",\"TraceState\":\"\",\"Remote\":false},\"Parent\":{\"TraceID\":\"00000000000000000000000000000000\",\"SpanID\":\"0000000000000000\",\"TraceFlags\":\"00\",\"TraceState\":\"\",\"Remote\":false},\"SpanKind\":1,\"StartTime\":\"2025-09-14T16:26:01.219992961Z\",\"EndTime\":\"2025-09-14T16:26:01.220109559Z\",\"Attributes\":[{\"Key\":\"io.cncf.distribution.storage.driver.name\",\"Value\":{\"Type\":\"STRING\",\"Value\":\"filesystem\"}},{\"Key\":\"io.cncf.distribution.storage.path\",\"Value\":{\"Type\":\"STRING\",\"Value\":\"/\"}}],\"Events\":null,\"Links\":null,\"Status\":{\"Code\":\"Unset\",\"Description\":\"\"},\"DroppedAttributes\":0,\"DroppedEvents\":0,\"DroppedLinks\":0,\"ChildSpanCount\":0,\"Resource\":[{\"Key\":\"service.name\",\"Value\":{\"Type\":\"STRING\",\"Value\":\"distribution\"}},{\"Key\":\"service.version\",\"Value\":{\"Type\":\"STRING\",\"Value\":\"3.0.0\"}}],\"InstrumentationScope\":{\"Name\":\"github.com/distribution/distribution/v3/registry/storage/driver/base\",\"Version\":\"\",\"SchemaURL\":\"\",\"Attributes\":null},\"InstrumentationLibrary\":{\"Name\":\"github.com/distribution/distribution/v3/registry/storage/driver/base\",\"Version\":\"\",\"SchemaURL\":\"\",\"Attributes\":null}}\n" environment=development go.version=go1.23.7 instance.id=5d93eacb-919b-40fe-be00-1d7e727ec579 service=registry version=3.0.0

```


你看到的这段日志是 Docker Registry v3 的 OpenTelemetry trace 数据，它以 JSON 格式输出了一个完整的 span（链路追踪单元），记录了 Registry 对存储驱动的调用（`Stat` 操作）。虽然它是 debug 级别，但如果你没有启用 trace 后端（如 Jaeger 或 Tempo），这些日志就会不断堆积，造成干扰。

---

## 🔍 日志内容解析（简要）

- `Name: "Stat"`：表示一次文件系统状态检查
- `Attributes`：
  - `storage.driver.name: filesystem`
  - `storage.path: /`
- `SpanContext`：包含 trace ID 和 span ID
- `Resource`：标识服务名为 `distribution`，版本为 `3.0.0`
- `InstrumentationLibrary`：来自 Registry 的存储驱动模块

这些 trace 是 Registry 内部自动生成的，目的是支持 OpenTelemetry 可观测性。但如果你没有 Collector 或后端接收器，它们就只会作为日志输出。

---

## ✅ 如何彻底屏蔽这些 trace 日志

### 1️⃣ 设置环境变量禁用 trace 导出

在容器启动命令中添加：

```bash
-e OTEL_TRACES_EXPORTER=none
```

这会阻止 Registry 初始化 trace 导出器，从而避免生成这些 span。

---

### 2️⃣ 降低日志级别（从 debug 改为 info 或 warn）

如果你使用的是 `config.yml` 文件，可以添加：

```yaml
log:
  level: info
```

或者在环境变量中设置：

```bash
-e REGISTRY_LOG_LEVEL=info
```

这将避免输出 debug 级别的 trace span 日志。

---

### 3️⃣ 使用日志驱动限制日志大小（Podman）

```bash
--log-opt max-size=10m --log-opt max-file=3
```

这可以防止日志无限增长。

---

## 🧠 总结建议

| 操作                        | 目的                               |
| --------------------------- | ---------------------------------- |
| `OTEL_TRACES_EXPORTER=none` | 禁用 trace 生成                    |
| `REGISTRY_LOG_LEVEL=info`   | 降低日志级别，屏蔽 debug 输出      |
| `--log-opt`                 | 控制日志大小，避免磁盘占满         |
| 停用 otel-collector         | 如果你部署了它但未使用，可直接停止 |

---

如果你希望我帮你生成一个干净的 `podman run` 命令，完全禁用 trace 和 debug 日志，我可以一步到位帮你搞定。你希望保留哪些日志级别？是否还需要记录错误或认证事件？