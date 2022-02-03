import './scss/main.scss';
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import 'bootstrap';

createApp(App).use(store).mount('#app');
