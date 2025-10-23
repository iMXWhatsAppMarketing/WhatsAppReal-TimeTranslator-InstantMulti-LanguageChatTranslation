import { createApp } from 'vue';
import './popup.css';
import App from './App.vue';
import i18n, { loadI18nMessages, getLanguage } from '@/langs';

const app = createApp(App);

async function bootstrap() {
  const lang = getLanguage();
  await loadI18nMessages(lang);
  app.use(i18n);
  app.mount('#app');
}

bootstrap();
