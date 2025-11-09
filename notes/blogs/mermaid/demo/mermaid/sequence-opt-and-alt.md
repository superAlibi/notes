

```mermaid
sequenceDiagram
    小王->>小明: 小明, 最近咋样?
    alt 病了
        小明->>小王: 不太好 :(
    else 状态不错
        小明->>小王: 活力四射
    end
    opt 额外的回复
        小明->>小王: 谢谢你的关心
    end
```