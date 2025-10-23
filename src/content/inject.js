import {
  startObserver,
  updateObserverConfig,
  provideSettingStyle,
  insertOrUpdateTransferNode,
  globalLangConfig,
  getItem,
  getSoleLangKey
} from '@/shared';

const { historyLang, receiveTranslate, sendTranslateMode, shortcutKey } = globalLangConfig;

chrome.runtime.onMessage.addListener((request) => {
  console.log(request);
});

const settingMap = {
  [globalLangConfig.historyLang.key]: async () => {
    const { historyKey } = getSoleLangKey();
    const soleLang = await getItem(historyKey, null);
    if (soleLang) return;
    const dynamic = await getItem(globalLangConfig.dynamic.key, false);
    dynamic && insertOrUpdateTransferNode(true);
  },
  [`${historyLang.key}--*`]: async () => {
    const { historyKey } = getSoleLangKey();
    const soleLang = await getItem(historyKey, null);
    if (soleLang) {
      const dynamic = await getItem(globalLangConfig.dynamic.key, false);
      console.log(dynamic, 'dynamic');
      dynamic && insertOrUpdateTransferNode(true);
    }
  },
  [receiveTranslate.key]: async () => {
    const history = await getItem(receiveTranslate.key, false);
    updateObserverConfig({
      history
    });
  },
  [sendTranslateMode.key]: async () => {
    const sendMode = await getItem(sendTranslateMode.key, sendTranslateMode.defaultValue);
    updateObserverConfig({
      sendTranslateMode: sendMode
    });
  },
  [shortcutKey.key]: async () => {
    const key = await getItem(shortcutKey.key, shortcutKey.defaultValue);
    updateObserverConfig({
      shortcutKey: key
    });
  },
  setting: (value) => {
    provideSettingStyle(value);
  }
  // [globalLangConfig.sendTranslateMode.key]: (value) => {

  // },
  // // 快捷键
  // [globalLangConfig.shortcutKey.key]: (value) => {
  // 	useShortcutKeyManager({
  // 		shortcutKey: value,
  // 		callback: () => {
  // 			console.log('shortcutKey', value)
  // 		}
  // 	})
  // }
};

// 处理带后缀的键名匹配
const handleSettingChange = (key, newValue) => {
  // 直接匹配
  if (settingMap[key]) {
    settingMap[key](newValue);
    return;
  }

  // 通配符模式匹配
  for (const [pattern, handler] of Object.entries(settingMap)) {
    if (pattern.endsWith('--*')) {
      const basePattern = pattern.slice(0, -3); // 移除 '--*' (3个字符)
      if (key.startsWith(basePattern + '--')) {
        handler(newValue);
        return;
      }
    }
  }
};

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    for (const key in changes) {
      const { newValue } = changes[key];
      handleSettingChange(key, newValue);
    }
  }
});

async function provideObserver() {
  const history = await getItem(receiveTranslate.key, receiveTranslate.defaultValue);
  const sendMode = await getItem(sendTranslateMode.key, sendTranslateMode.defaultValue);
  const key = await getItem(shortcutKey.key, shortcutKey.defaultValue);
  startObserver({
    history,
    sendTranslateMode: sendMode,
    shortcutKey: key
  });
}

provideObserver();
