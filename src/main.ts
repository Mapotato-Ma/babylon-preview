import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { router } from './route';
import { vuetify } from './vuetify';
import { grass } from '@/common/directives';
createApp(App).use(vuetify).use(router).directive('grass', grass).mount('#app');
