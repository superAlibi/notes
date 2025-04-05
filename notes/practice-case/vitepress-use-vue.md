---
title: 在markdown中使用vue
editLink: true
---

# {{ $frontmatter.title }}



## 代码演示

下面的代码就跟你平时写vue模板代码一样,直接在markdown文件中编写就好

***markdown中vue代码部分***

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## Markdown Content

当前的count是: {{ count }}

<button :class="$style.button" @click="count++">累加</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>
```

***渲染结果***

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## Markdown Content

当前的count是: {{ count }}

<button :class="$style.button" @click="count++">累加</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>