<script setup>
import { ref, computed } from 'vue'

const sourceCode = ref(`export const version = __VERSION__;
export const author = __AUTHOR__;
export const env = process.env.NODE_ENV;`)

const options = ref(`{
  "__VERSION__": "\\"1.0.0\\"",
  "__AUTHOR__": "\\"naecoo\\"",
  "process.env.NODE_ENV": "\\"production\\""
}`)

const delimiters = ref('["", ""]')

const outputCode = computed(() => {
  try {
    let code = sourceCode.value
    const opts = JSON.parse(options.value)
    const delims = JSON.parse(delimiters.value)
    
    for (const [key, value] of Object.entries(opts)) {
      const escaped = key.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
      const pattern = delims[0] && delims[1]
        ? new RegExp(escaped.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'), 'g')
        : new RegExp(`\\\\b${escaped}\\\\b`, 'g')
      code = code.replace(pattern, value)
    }
    
    return code
  } catch (e) {
    return `Error: ${e.message}`
  }
})

const copyOutput = () => {
  navigator.clipboard.writeText(outputCode.value)
}
</script>

<template>
  <div class="demo-container">
    <h1>Live Demo</h1>
    <p>Try the esbuild-plugin-replace plugin in your browser!</p>
    
    <div class="editor-grid">
      <div class="editor-panel">
        <h3>Source Code</h3>
        <textarea v-model="sourceCode" rows="8"></textarea>
      </div>
      
      <div class="editor-panel">
        <h3>Plugin Options</h3>
        <textarea v-model="options" rows="8"></textarea>
        <div class="delimiters-row">
          <label>Delimiters:</label>
          <input v-model="delimiters" />
        </div>
      </div>
      
      <div class="editor-panel output">
        <h3>Output</h3>
        <pre><code>{{ outputCode }}</code></pre>
        <button @click="copyOutput">Copy</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.editor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.editor-panel {
  display: flex;
  flex-direction: column;
}

.editor-panel.output {
  grid-column: 1 / -1;
}

h3 {
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand);
}

textarea, input {
  font-family: monospace;
  font-size: 14px;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  resize: vertical;
}

textarea:focus, input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.delimiters-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.delimiters-row label {
  white-space: nowrap;
}

.delimiters-row input {
  flex: 1;
}

pre {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  min-height: 100px;
}

button {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start;
}

button:hover {
  opacity: 0.9;
}
</style>
