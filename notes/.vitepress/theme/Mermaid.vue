<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'
import { useData } from 'vitepress'
const props = defineProps<{ code: string }>()
const {isDark}=useData()

const svg = ref<string>('')
const id = ref<string>('')

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false, theme: isDark.value ? "dark" : "base" })
  await render()
})

watch(() => props.code, render)

async function render() {
  id.value = `mermaid-${Math.random().toString(36).slice(2)}`
  const { svg: res } = await mermaid.render(id.value, decodeURIComponent(props.code))
  svg.value = res
}
</script>

<template>
  <div class="mermaid" v-html="svg" />
</template>

<style scoped>
.mermaid { display: flex; justify-content: center; }
</style>