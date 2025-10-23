import { createApp } from 'vue';
import './content.css';
import App from './Content.vue';
import './inject';
import i18n, { loadI18nMessages, getLanguage } from '@/langs';
import { contentScriptId } from '@/shared/domConfig';

const root = document.createElement('div');
root.id = contentScriptId;
document.body.append(root);

const app = createApp(App);

async function bootstrap() {
  const lang = getLanguage();
  await loadI18nMessages(lang);
  app.use(i18n);
  app.mount(root);
}

bootstrap();
