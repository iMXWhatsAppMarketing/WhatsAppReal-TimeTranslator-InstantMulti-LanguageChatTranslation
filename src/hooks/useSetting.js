import { isEqual, forOwn } from 'lodash';
import { settingConfig, globalLangConfig, MessagType, getItem, entries, setItem, sendMessageToServer, SHORTCUT_KEY_ENUM } from '@/shared';

export function useSetting(options = {}) {
  const message = useMessage();
  const { onReady } = options;

  // 响应式数据
  const fontColor = ref(null);
  const fontSize = ref(null);
  const historyLang = ref(null);
  const lang = ref(null);
  const receiveTranslate = ref(null);
  const sendTranslateMode = ref(null);
  const proxyError = ref(null);
  const dynamicTranfer = ref(null);
  const uploaderData = ref(null);
  const shortcutKey = ref(null);

  // 设置配置映射
  const reflectSettingMap = {
    [settingConfig.fontSize.key]: (value) => {
      fontSize.value = value;
    },
    [settingConfig.fontColor.key]: (value) => {
      fontColor.value = value;
    }
  };

  // 语言配置映射
  const reflectLangConfigMap = {
    [globalLangConfig.historyLang.key]: (value) => {
      historyLang.value = value;
    },
    [globalLangConfig.lang.key]: (value) => {
      lang.value = value;
    },
    [globalLangConfig.dynamic.key]: (value) => {
      dynamicTranfer.value = value;
    },
    [globalLangConfig.receiveTranslate.key]: (value) => {
      receiveTranslate.value = value;
    },
    [globalLangConfig.sendTranslateMode.key]: (value) => {
      sendTranslateMode.value = value;
    },
    [globalLangConfig.proxyError.key]: (value) => {
      proxyError.value = value;
    },
    [globalLangConfig.shortcutKey.key]: (value) => {
      shortcutKey.value = value;
    }
  };

  // 默认设置
  const defaultSetting = computed(() => Object.fromEntries(Object.values(settingConfig).map((item) => [item.key, item.defaultValue])));

  // 字体选项
  const fontSizeOptions = computed(() => [
    { label: '12px', key: 12 },
    { label: '14px', key: 14 },
    { label: '16px', key: 16 },
    { label: '18px', key: 18 },
    { label: '20px', key: 20 },
    { label: '28px', key: 28 }
  ]);

  const fontSizeMin = 12; // 最小字体大小
  const fontSizeMax = 50; // 最大字体大小

  // 计算属性 - 语言配置
  const computedLang = computed(() => ({
    [globalLangConfig.historyLang.key]: historyLang.value,
    [globalLangConfig.lang.key]: lang.value,
    [globalLangConfig.dynamic.key]: dynamicTranfer.value,
    [globalLangConfig.receiveTranslate.key]: receiveTranslate.value,
    [globalLangConfig.sendTranslateMode.key]: sendTranslateMode.value,
    [globalLangConfig.proxyError.key]: proxyError.value,
    [globalLangConfig.shortcutKey.key]: shortcutKey.value
  }));

  const shortcutKeyOptions = computed(() => [
    { label: 'Alt + T', key: SHORTCUT_KEY_ENUM.ALT_T, value: SHORTCUT_KEY_ENUM.ALT_T },
    { label: 'Ctrl+Alt+Q', key: SHORTCUT_KEY_ENUM.CTRL_ALT_Q, value: SHORTCUT_KEY_ENUM.CTRL_ALT_Q }
  ]);

  // 计算属性 - 设置配置
  const computedSetting = computed(() => ({
    [settingConfig.fontColor.key]: fontColor.value,
    [settingConfig.fontSize.key]: fontSize.value
  }));

  // 语言初始化
  const langInit = async () => {
    const globalLang = await Object.values(globalLangConfig).reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const val = await getItem(item.key, () => {
        const initVal = item.defaultValue;
        setItem(item.key, initVal);
        return initVal;
      });
      acc[item.key] = val;
      return acc;
    }, Promise.resolve({}));
    entries(globalLang, (key, value) => {
      reflectLangConfigMap[key]?.(value);
    });
  };

  // 设置初始化
  const settingInit = async () => {
    const setting = await getItem('setting', () => {
      const res = { ...defaultSetting.value };
      return res;
    });

    entries(setting, (key, value) => {
      reflectSettingMap[key]?.(value);
    });
  };

  // 监听语言配置变化
  watch(computedLang, (newValue, oldValue) => {
    const changes = {};
    forOwn(newValue, (value, key) => {
      if (!isEqual(value, oldValue[key])) {
        changes[key] = value;
      }
    });

    if (Object.keys(changes).length && chrome) {
      sendMessageToServer({
        type: MessagType.ChangeLang,
        data: {
          changes
        }
      });
    }
  });

  // 监听设置配置变化
  watch(computedSetting, (value) => {
    if (chrome) {
      sendMessageToServer({
        type: MessagType.ChangeSetting,
        data: {
          setting: value
        }
      });
    }
  });

  // 初始化
  const initSetting = async () => {
    await settingInit();
    await langInit();
  };

  // 在hooks内部直接处理挂载逻辑
  onMounted(async () => {
    await initSetting();

    // 初始化完成后调用外部回调
    if (onReady && typeof onReady === 'function') {
      onReady();
    }
  });

  // 返回需要的数据和方法
  return {
    // 响应式数据
    fontColor,
    fontSize,
    historyLang,
    lang,
    dynamicTranfer,
    uploaderData,
    fontSizeMin,
    fontSizeMax,
    receiveTranslate,
    sendTranslateMode,
    proxyError,
    shortcutKey,
    // 计算属性
    fontSizeOptions,
    computedLang,
    computedSetting,
    shortcutKeyOptions,

    // 以下方法现在主要用于手动调用或测试
    initSetting,
    langInit,
    settingInit
  };
}
