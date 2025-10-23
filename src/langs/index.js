export * from './langOptions';

import { createI18n } from 'vue-i18n';

const modules = import.meta.glob('./**/*.yaml');
const messages = {};
for (const [modulePath, module] of Object.entries(modules)) {
  const [_, lang, ns] = modulePath.match(/\/(.*?)\/(.*?)\./);
  if (!messages[lang]) {
    messages[lang] = {};
  }
  messages[lang][ns] = module;
}

export const languages = Object.keys(messages);

const CHROME_LANGUAGE_MAP = {
  'en-US': 'en_US',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  vi: 'vi',
  id: 'id'
};

export const getLanguage = () => {
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    const chromeLanguage = chrome.i18n.getUILanguage();
    const current = CHROME_LANGUAGE_MAP[chromeLanguage] || 'en_US';
    return current;
  }
  return 'en_US';
};

const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {}
});

function setI18nLanguage(locale) {
  i18n.global.locale.value = locale;
}

const loadedLanguages = new Set();

export async function loadI18nMessages(lang) {
  if (unref(i18n.global.locale) === lang) {
    return setI18nLanguage(lang);
  }
  if (loadedLanguages.has(lang)) {
    return setI18nLanguage(lang);
  }
  const message = {};
  for (const ns of Object.keys(messages[lang])) {
    const module = messages[lang][ns];
    message[ns] = (await module()).default;
  }

  if (!message.language || !Object.keys(message.language).includes(lang)) {
    lang = 'en_US';
  }

  i18n.global.setLocaleMessage(lang, message);
  loadedLanguages.add(lang);

  return setI18nLanguage(lang);
}

export default i18n;
export const t = i18n.global.t;
