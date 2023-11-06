import { createApp } from 'vue'
import App from './App.vue'

// import './assets/main.css'
import '/node_modules/todomvc-common/base.css'
import '/node_modules/todomvc-app-css/index.css'

const app = createApp(App)
app.directive('app-focus', (el,binding) => {
    el.focus()
})
app.mount('#app')
