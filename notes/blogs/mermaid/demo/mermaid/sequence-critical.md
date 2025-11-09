

```mermaid
sequenceDiagram
    critical 与数据库建立连接
        Service-->DB: 发起连接
    option 网络连接超时
        Service-->Service: 记录错误日志
    option 认证异常
        Service-->Service: 记录错误日志
    end
```