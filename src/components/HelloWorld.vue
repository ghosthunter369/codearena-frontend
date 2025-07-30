<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://vitejs.dev/guide/" target="_blank" rel="noopener">Vite documentation</a>.
    </p>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3</a></li>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">Vue Router</a></li>
      <li><a href="https://pinia.vuejs.org" target="_blank" rel="noopener">Pinia</a></li>
      <li><a href="https://axios-http.com" target="_blank" rel="noopener">Axios</a></li>
    </ul>
    <button @click="incrementCounter">Count: {{ counter }}</button>
  </div>
</template>

<script>
import { useCounterStore } from '../store/counter'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const counterStore = useCounterStore()
    
    return {
      counter: counterStore.count,
      incrementCounter: counterStore.increment
    }
  }
}
</script>

<style scoped>
.hello {
  margin: 40px 0;
}

h2 {
  margin: 0 0 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #369870;
}
</style>