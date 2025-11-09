<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'
import { useData } from 'vitepress'
const props = defineProps<{ code: string }>()
const { isDark } = useData()

const svg = ref<string>('')

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false, theme: isDark.value ? "dark" : "base" })
  await render(props.code)
})

watch(() => props.code, render)

async function render(code: string) {
  let id = `mermaid-${Math.random().toString(36).slice(2)}`
  const { svg: res } = await mermaid.render(id, decodeURIComponent(code))
  svg.value = res
}
</script>

<template>
  <div class="mermaid" v-html="svg" />
</template>

<style scoped>
.mermaid {
  display: flex;
  justify-content: center;
}
</style>