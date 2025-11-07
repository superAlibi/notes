<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{ code: string }>()

const svg = ref<string>('')
const id = ref<string>('')

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false, theme: 'base' })
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