import './scss/main.scss';
import { createApp } from 'vue';
import { Tooltip } from 'bootstrap';
import App from './App.vue';
import store from './store';

const app = createApp(App);

// Creates directive v-tooltip
app.directive('tooltip', {
  mounted(el) {
    // eslint-disable-next-line no-new
    new Tooltip(el);
  },
});

app.use(store).mount('#app');
