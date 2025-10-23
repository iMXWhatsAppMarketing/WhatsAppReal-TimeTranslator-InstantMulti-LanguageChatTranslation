import { createApp } from 'vue';
import App from './Options.vue';
import router from './router.js';
import i18n, { loadI18nMessages, getLanguage } from '@/langs';

const app = createApp(App);

async function bootstrap() {
  const lang = getLanguage();
  await loadI18nMessages(lang);

  // 注册插件
  app.use(i18n);
  app.use(router);

  app.mount('#appOptions');
}

bootstrap();
