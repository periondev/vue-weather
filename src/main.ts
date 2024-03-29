import './assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import i18n from './plugins/vue-i18n';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia.use(piniaPluginPersistedstate));
app.use(router);
app.use(i18n);
app.mount('#app');
