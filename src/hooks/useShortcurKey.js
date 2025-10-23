import { SHORTCUT_KEY_ENUM } from '@/shared/langConfig';

/**
 * 根据 SHORTCUT_KEY_ENUM 值创建快捷键代理按钮事件
 * @param {Object} options - 配置选项
 * @param {string} options.shortcutKey - SHORTCUT_KEY_ENUM 的值
 * @param {Function} options.callback - 按下快捷键时触发的回调函数
 * @param {HTMLElement} options.targetElement - 可选，指定监听的元素，默认为 document
 * @param {string} options.triggerQuery - 可选，目标元素的 CSS 选择器，默认为 'div[contenteditable="true"][data-tab="10"]'
 * @returns {Function} 返回清理函数，用于移除事件监听
 */
export const createShortcutKeyProxy = (options = {}) => {
  const { shortcutKey, callback, targetElement = document, triggerQuery = '' } = options;

  if (!shortcutKey || typeof callback !== 'function') {
    console.warn('createShortcutKeyProxy: shortcutKey 和 callback 参数都是必需的');
    return () => {};
  }

  const handleKeyDown = (event) => {
    // 使用 CSS 选择器匹配目标元素
    if (!event.target || !event.target.matches || !event.target.matches(triggerQuery)) {
      return;
    }

    let isMatch = false;

    switch (shortcutKey) {
      case SHORTCUT_KEY_ENUM.ALT_T:
        isMatch = event.altKey && event.key.toLowerCase() === 't' && !event.ctrlKey && !event.shiftKey;
        break;
      case SHORTCUT_KEY_ENUM.CTRL_ALT_Q:
        isMatch = event.ctrlKey && event.altKey && event.key.toLowerCase() === 'q' && !event.shiftKey;
        break;
      default:
        console.warn(`createShortcutKeyProxy: 未知的快捷键类型 ${shortcutKey}`);
        return;
    }

    if (isMatch) {
      event.preventDefault();
      event.stopPropagation();

      try {
        callback(event);
      } catch (error) {
        console.error('快捷键回调函数执行错误:', error);
      }
    }
  };

  // 添加事件监听
  targetElement.addEventListener('keydown', handleKeyDown, { passive: false });

  // 返回清理函数
  return () => {
    targetElement.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * 批量创建多个快捷键代理
 * @param {Array} shortcuts - 快捷键配置数组 [{ key: SHORTCUT_KEY_ENUM.ALT_T, callback: () => {} }]
 * @param {HTMLElement} targetElement - 可选，指定监听的元素，默认为 document
 * @param {string} triggerQuery - 可选，目标元素的 CSS 选择器
 * @returns {Function} 返回清理所有快捷键的函数
 */
export const createMultipleShortcutKeyProxy = (shortcuts, targetElement = document, triggerQuery = '') => {
  if (!Array.isArray(shortcuts)) {
    console.warn('createMultipleShortcutKeyProxy: shortcuts 必须是数组');
    return () => {};
  }

  const cleanupFunctions = shortcuts
    .filter(({ key, callback }) => key && typeof callback === 'function')
    .map(({ key, callback }) => {
      return createShortcutKeyProxy({
        shortcutKey: key,
        callback,
        targetElement,
        triggerQuery
      });
    });

  // 返回清理所有快捷键的函数
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
};

/**
 * 获取快捷键的显示文本
 * @param {string} shortcutKey - SHORTCUT_KEY_ENUM 的值
 * @returns {string} 快捷键的显示文本
 */
export const getShortcutKeyLabel = (shortcutKey) => {
  const labels = {
    [SHORTCUT_KEY_ENUM.ALT_T]: 'Alt + T',
    [SHORTCUT_KEY_ENUM.CTRL_ALT_Q]: 'Ctrl + Alt + Q'
  };

  return labels[shortcutKey] || '未知快捷键';
};

/**
 * 响应式快捷键管理器
 * @param {Object} options - 配置选项
 * @param {string} options.shortcutKey - SHORTCUT_KEY_ENUM 的值
 * @param {Function} options.callback - 回调函数
 * @param {HTMLElement} options.targetElement - 目标元素
 * @param {boolean} options.enabled - 是否启用
 * @param {string} options.triggerQuery - 目标元素的 CSS 选择器
 */
export const useShortcutKeyManager = (options = {}) => {
  const {
    shortcutKey: initialShortcutKey,
    callback: initialCallback,
    targetElement = document,
    enabled: initialEnabled = true,
    triggerQuery = ''
  } = options;

  const shortcutKey = ref(initialShortcutKey);
  const enabled = ref(initialEnabled);
  let currentCallback = initialCallback;
  let cleanup = null;

  const setup = () => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }

    if (enabled.value && shortcutKey.value && currentCallback) {
      cleanup = createShortcutKeyProxy({
        shortcutKey: shortcutKey.value,
        callback: currentCallback,
        targetElement,
        triggerQuery
      });
    }
  };

  const destroy = () => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  };

  const updateCallback = (newCallback) => {
    if (typeof newCallback === 'function') {
      currentCallback = newCallback;
      nextTick(setup);
    }
  };

  const updateShortcutKey = (newShortcutKey) => {
    shortcutKey.value = newShortcutKey;
  };

  const enable = () => {
    enabled.value = true;
  };

  const disable = () => {
    enabled.value = false;
  };

  const toggle = () => {
    enabled.value = !enabled.value;
  };

  // 监听响应式变化
  watch([shortcutKey, enabled], setup, { immediate: false });

  return {
    shortcutKey,
    enabled,
    setup,
    destroy,
    updateCallback,
    updateShortcutKey,
    enable,
    disable,
    toggle,
    getLabel: () => getShortcutKeyLabel(shortcutKey.value)
  };
};

/**
 * Vue 组合式 API 的快捷键钩子（简化版）
 * @param {string|Ref} shortcutKey - SHORTCUT_KEY_ENUM 的值或响应式引用
 * @param {Function} callback - 按下快捷键时触发的回调函数
 * @param {Object} options - 配置选项
 * @param {HTMLElement} options.targetElement - 可选，指定监听的元素，默认为 document
 * @param {boolean|Ref} options.enabled - 可选，是否启用快捷键，默认为 true
 * @param {string} options.triggerQuery - 可选，目标元素的 CSS 选择器
 */
export const useShortcutKey = (shortcutKey, callback, options = {}) => {
  const { targetElement = document, enabled = true, triggerQuery = '' } = options;

  const manager = useShortcutKeyManager({
    shortcutKey: typeof shortcutKey === 'string' ? shortcutKey : shortcutKey.value,
    callback,
    targetElement,
    enabled: typeof enabled === 'boolean' ? enabled : enabled.value,
    triggerQuery
  });

  // 如果传入的是响应式值，监听变化
  if (typeof shortcutKey !== 'string') {
    watch(shortcutKey, (newKey) => {
      manager.updateShortcutKey(newKey);
    });
  }

  if (typeof enabled !== 'boolean') {
    watch(enabled, (newEnabled) => {
      manager.enabled.value = newEnabled;
    });
  }

  onMounted(() => {
    manager.setup();
  });

  onUnmounted(() => {
    manager.destroy();
  });

  return manager;
};

/**
 * 批量管理多个快捷键的钩子
 * @param {Array} shortcuts - 快捷键配置数组
 * @param {Object} options - 配置选项
 * @param {HTMLElement} options.targetElement - 可选，指定监听的元素，默认为 document
 * @param {string} options.triggerQuery - 可选，目标元素的 CSS 选择器
 */
export const useMultipleShortcutKeys = (shortcuts = [], options = {}) => {
  const { targetElement = document, triggerQuery = '' } = options;

  const managers = ref([]);

  const setupManagers = () => {
    // 清理现有管理器
    managers.value.forEach((manager) => manager.destroy());

    // 创建新管理器
    managers.value = shortcuts.map((config) => {
      const manager = useShortcutKeyManager({
        ...config,
        targetElement,
        triggerQuery
      });
      manager.setup();
      return manager;
    });
  };

  const destroyManagers = () => {
    managers.value.forEach((manager) => manager.destroy());
    managers.value = [];
  };

  const enableAll = () => {
    managers.value.forEach((manager) => manager.enable());
  };

  const disableAll = () => {
    managers.value.forEach((manager) => manager.disable());
  };

  const getManager = (shortcutKey) => {
    return managers.value.find((manager) => manager.shortcutKey.value === shortcutKey);
  };

  onMounted(setupManagers);
  onUnmounted(destroyManagers);

  return {
    managers,
    enableAll,
    disableAll,
    getManager,
    refresh: setupManagers
  };
};
