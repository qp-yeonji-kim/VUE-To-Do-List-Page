import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
//import router from './router/index.js'; 뒷 부분은 생략한 것

createApp(App).use(router).mount('#app')
