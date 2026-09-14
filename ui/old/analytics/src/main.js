import { createApp } from 'vue'
import store from "./store.js";
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import '@/styles/theme-new.css'
import 'es6-promise/auto'

const app = createApp(App)
app.use(store)
app.mount('#app')
