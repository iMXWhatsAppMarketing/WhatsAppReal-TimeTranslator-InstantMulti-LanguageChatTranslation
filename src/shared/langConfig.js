export const SEND_TRANSLATE_MODE_ENUM = {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL'
};

export const SHORTCUT_KEY_ENUM = {
  ALT_T: 'AltT',
  CTRL_ALT_Q: 'CtrlAltQ'
};

export const globalLangConfig = {
  // 接收信息翻译
  historyLang: {
    key: '--global-history-lang',
    defaultValue: 'zh-CN'
  },
  // 发送信息翻译
  lang: {
    key: '--global-lang',
    defaultValue: 'en'
  },
  dynamic: {
    key: '--global-dynamic',
    defaultValue: true
  },
  // 接收翻译
  receiveTranslate: {
    key: '--global-receive-translate',
    defaultValue: true
  },
  // 发送翻译配置
  sendTranslateMode: {
    key: '--global-send-translate-mode',
    defaultValue: SEND_TRANSLATE_MODE_ENUM.AUTO
  },
  // 翻译失败拦截
  proxyError: {
    key: '--global-proxy-error',
    defaultValue: true
  },
  // 快捷键
  shortcutKey: {
    key: '--global-shortcut-key',
    defaultValue: SHORTCUT_KEY_ENUM.ALT_T
  }
};
