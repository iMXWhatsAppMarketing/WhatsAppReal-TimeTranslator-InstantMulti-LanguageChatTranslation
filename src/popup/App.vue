<script setup>
import Layout from '@/components/layout/index.vue';
import { useThemeOverrides } from '@/hooks/useThemeOverrides';
import { useNativeLocal } from '@/hooks/useNativeLocal';
import { contentScriptId } from '@/shared/domConfig';
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';

// const logoUrl = chrome.runtime.getURL(logo);
const targetUrl = import.meta.env.VITE_APP_PROXY_URL;

const { themeOverrides } = useThemeOverrides();

const { locale, dateLocale } = useNativeLocal();

const { t } = useI18n();

const getContentScriptInjection = async (currentTab) => {
  return chrome?.scripting?.executeScript({
    target: { tabId: currentTab.id },
    func: (scriptId) => {
      console.log('func', scriptId, !!document.getElementById(scriptId));
      return !!document.getElementById(scriptId);
    },
    args: [contentScriptId],
    injectImmediately: true
  });
};

// 创建离散 API 实例
const { dialog } = createDiscreteApi(['dialog']);

// 显示错误对话框的函数
const showErrorDialog = (currentTab) => {
  dialog.error({
    title: '',
    closable: false,
    content: t('message.server.installReloadContent'),
    positiveText: t('message.server.installReloadHandle'),
    onPositiveClick: () => {
      chrome.tabs.reload(currentTab.id);
    }
  });
};

const checkContentScriptInjection = async (currentTab) => {
  const res = await getContentScriptInjection(currentTab).catch((err) => {
    console.log('catch', err);
    return { result: false };
  });
  console.log('res', res);
  if (!res?.[0]?.result) {
    showErrorDialog(currentTab);
  }
};

onMounted(() => {
  console.log('onMounted');
  chrome?.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.tabs.query({}, (allTabs) => {
      const foundTab = allTabs.find((t) => t.url === targetUrl);
      if (foundTab) {
        if (currentTab.url !== targetUrl) {
          chrome.tabs.update(foundTab.id, { active: true });
        }
        checkContentScriptInjection(foundTab);
      } else {
        chrome.tabs.create({ url: targetUrl });
      }
    });
  });
});
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
    <n-dialog-provider>
      <n-message-provider>
        <Layout />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped></style>
