import { createInputShortcutKeyProxy, proxyKeydownEnter, sendMessage, transferInputText, removeKeydownEnter } from './input';
import { insertTransferNode, removeAllTransDiv } from './history';
import { clearByCtrlA } from './deleteContent';
import {
  contenteditableClass,
  insertTransferNodeQuery,
  historyNodeQuery,
  inputNodeClass,
  proxySendNodeClass,
  brandNodeQuery,
  brandClassPrefix
} from './domConfig';
import { SEND_TRANSLATE_MODE_ENUM, SHORTCUT_KEY_ENUM } from './langConfig';

let globalObserverInSection = null;
let globalHistoryObserver = null;
let globObserver = null;
let globSendObserver = null;
let globalTextChangeObserver = null;
let globalKeyboardObserver = null;
let globBrandObserver = null;
const globalObserverConfig = {
  history: true,
  send: true,
  sendTranslateMode: SEND_TRANSLATE_MODE_ENUM.AUTO,
  shortcutKey: SHORTCUT_KEY_ENUM.ALT_T
};

let sendButtonNode = null;

// 统一管理所有 observer 钩子
export const observerHooks = {
  textChange: [],
  chatChange: [],
  beforeSendTranslate: [],
  afterSendTranslate: [],
  beforeHistoryTranslate: [],
  afterHistoryTranslate: [],
  brandChange: []
};

/**
 * @name 注册observer钩子
 * @param {keyof typeof observerHooks} type
 * @param {Function} fn
 * @returns {Function} 返回一个函数，用于移除钩子
 */
export function addObserverHook(type, fn) {
  if (observerHooks[type] && typeof fn === 'function') {
    observerHooks[type].push(fn);
    return () => {
      const idx = observerHooks[type].indexOf(fn);
      if (idx !== -1) observerHooks[type].splice(idx, 1);
    };
  }
  return () => {};
}

/**
 * @name 清除observer钩子
 */
export function clearObserverHooks() {
  Object.keys(observerHooks).forEach((key) => {
    observerHooks[key] = [];
  });
}

/**
 * @name 关闭聊天历史的拦截
 */
function closeHistoryProxy() {
  globalObserverInSection?.disconnect();
  globalHistoryObserver?.disconnect();
  globalObserverInSection = null;
  globalHistoryObserver = null;
}

/**
 * @name 关闭发送消息的拦截
 */
export function closeSendMessageProxy() {
  cancelProxySendButton();
  globSendObserver?.disconnect();
  globalTextChangeObserver?.disconnect();
  globalTextChangeObserver = null;
  globSendObserver = null;
  clearManualObserver();
}

/**
 * @name 关闭拦截
 */
function closeProxy() {
  closeHistoryProxy();
  closeSendMessageProxy();
}

/**
 * @name 重置观察器状态
 */
function resetObserver() {
  closeProxy();
  observerInSection(appendTransDiv);
  observerSendMessage();
}

function observerKeydownEnter() {
  proxyKeydownEnter(document.querySelector(contenteditableClass));
}

/**
 * @name 发送消息相关观察
 */
export function observerSendMessage() {
  if (!globalObserverConfig.send) return;
  const manualMode = globalObserverConfig.sendTranslateMode === SEND_TRANSLATE_MODE_ENUM.MANUAL;
  if (manualMode) {
    observerManual();
  } else {
    observerKeydownEnter();
    observerSendButton();
  }
  observerSendTextChange();
}

function clearManualObserver() {
  removeKeydownEnter(document.querySelector(contenteditableClass));
  globalKeyboardObserver?.destroy();
  globalKeyboardObserver = null;
}

function observerManual() {
  globalKeyboardObserver = createInputShortcutKeyProxy(globalObserverConfig.shortcutKey, () => {
    transferInputText(() => console.log('翻译完成'));
  });
  globalKeyboardObserver.setup();
}

function observerSendTextChange() {
  globalTextChangeObserver = observeElementContent({
    el: document.querySelector(contenteditableClass),
    callback: (content) => {
      observerHooks?.textChange?.forEach((fn) => fn(content));
    }
  });
}

function observerSendButton() {
  const el = document.querySelector(inputNodeClass);
  if (!el) return;
  proxySendButton(document.querySelector(proxySendNodeClass));
  globSendObserver = observeElement({
    el,
    findTarget: (node) => node.matches(proxySendNodeClass),
    deepTarget: proxySendNodeClass,
    callback: (node) => {
      cancelProxySendButton();
      proxySendButton(node);
    }
  });
}

/**
 * @name 代理发送按钮的点击事件
 * @function proxySendButton
 * @param {HTMLElement} node - 发送按钮元素
 */
function proxySendButton(node) {
  if (!node) return;
  const ensureButton = sendButtonNode || (sendButtonNode = node);
  ensureButton.addEventListener('click', proxyClickHandler, true);
}

/**
 * @name 取消发送按钮的代理
 * @function cancelProxySendButton
 */
function cancelProxySendButton() {
  if (sendButtonNode) {
    sendButtonNode.removeEventListener('click', proxyClickHandler, true);
    sendButtonNode = null;
  }
}

/**
 * @name 发送按钮点击事件处理函数
 * @function proxyClickHandler
 * @param {Event} event - 点击事件对象
 */
function proxyClickHandler(event) {
  event.stopPropagation();
  clearByCtrlA();
  transferInputText(() => {
    sendMessage();
  });
}

/**
 * @name 插入或更新观察区翻译元素
 * @param {Boolean} update - 是否是更新
 */
export function insertOrUpdateTransferNode(update = false) {
  const nodes = document.querySelectorAll(insertTransferNodeQuery);
  nodes?.forEach((node) => insertTransferNode(node, update));
}

/**
 * @name 观察指定区域内的元素
 * @param {Function} callback - 当元素进入可视区域时的回调函数
 */
function observerInSection(callback) {
  if (!globalObserverConfig.history) return;
  insertOrUpdateTransferNode();
  globalObserverInSection = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  });

  globalHistoryObserver = observeElement({
    el: document.querySelector(historyNodeQuery),
    findTarget: (node) => node.matches(insertTransferNodeQuery),
    callback: (node) => {
      globalObserverInSection.observe(node);
    },
    deepTarget: insertTransferNodeQuery
  });
}

/**
 * @name 观察元素变化
 * @param {Object} options - 配置选项
 * @param {HTMLElement} options.el - 要观察的目标元素
 * @param {Function} options.findTarget - 判断是否为目标元素的函数
 * @param {Function} [options.callback] - 发现目标元素时的回调函数
 * @param {string} [options.deepTarget=null] - 深层目标元素选择器
 * @param {MutationObserverInit} [options.mergeConfig=null] - 合并变更类型
 * @returns {MutationObserver} 创建的观察器实例
 */
function observeElement({ el, findTarget, callback, deepTarget = null, mergeConfig = {} }) {
  if (!el) return null;
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (!findTarget && !deepTarget) {
              callback?.(node);
            }

            if (findTarget(node)) {
              callback?.(node);
            }

            if (deepTarget) {
              const akbuElements = node.querySelectorAll(deepTarget);
              akbuElements.forEach((akbuElement) => {
                callback?.(akbuElement);
              });
            }
          }
        });
      }
    }
  });

  const config = {
    childList: true,
    subtree: true,
    ...mergeConfig
  };
  observer.observe(el, config);

  return observer;
}

/**
 * @name 观察元素文本变化
 * @param {Object} options - 配置选项
 * @param {HTMLElement} options.el - 要观察的目标元素
 * @param {Function} [options.callback] - 发现目标元素时的回调函数
 * @param {Function} [options.immediate] - 是否首次就触发callback
 * @returns {MutationObserver} 创建的观察器实例
 */
function observeElementContent({ el, callback, immediate = true }) {
  if (!el) return null;
  immediate && callback?.(el.textContent);
  const observer = new MutationObserver(() => {
    callback?.(el.textContent);
  });

  const config = {
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(el, config);

  return observer;
}

/**
 * @name 添加翻译div到目标元素
 * @param {IntersectionObserverEntry} entry - 交叉观察器条目
 */
function appendTransDiv(entry) {
  const { target } = entry;
  insertTransferNode(target);
}

/**
 * @name 提供品牌信息，替换元素内容为logo和标题
 * @param {string} imageSrc - 图片的src地址
 * @param {string} title - 标题文本
 */
export function provideBrand(imageSrc, title) {
  const el = document.querySelector(brandNodeQuery);
  if (!el) return;
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  const brandDiv = document.createElement('div');
  brandDiv.className = brandClassPrefix;

  // const logoDiv = document.createElement('div')
  // logoDiv.className = `${brandClassPrefix}--logo`

  // const img = document.createElement('img')
  // img.src = imageSrc
  // img.alt = title || 'Brand Logo'
  // logoDiv.appendChild(img)
  const titleDiv = document.createElement('div');
  titleDiv.className = `${brandClassPrefix}--title`;
  titleDiv.textContent = title || '';
  // brandDiv.appendChild(logoDiv)
  brandDiv.appendChild(titleDiv);
  el.appendChild(brandDiv);
}

/**
 * @name 启动全局观察器
 */
export function startObserver(config = {}) {
  updateObserverConfig(config);
  globObserver = observeElement({
    el: document.body,
    findTarget: (node) => node.id === 'main',
    callback: () => {
      observerHooks?.chatChange?.forEach((fn) => fn());
      resetObserver();
    }
  });
  globBrandObserver = observeElement({
    el: document.body,
    findTarget: (node) => node.matches(brandNodeQuery),
    deepTarget: brandNodeQuery,
    callback: () => {
      observerHooks?.brandChange?.forEach((fn) => fn());
    }
  });
}

const updateProcessMap = {
  sendTranslateMode: () => {
    closeSendMessageProxy();
    observerSendMessage();
  },
  shortcutKey: (value) => {
    globalKeyboardObserver?.updateShortcutKey(value);
  },
  history: (value) => {
    if (value) {
      observerInSection(appendTransDiv);
    } else {
      closeHistoryProxy(value);
      removeAllTransDiv();
    }
  }
};

/**
 * @name 更新观察器配置
 * @param {Object} config - 配置对象
 * @returns {Object} 更新后的配置对象
 */
export function updateObserverConfig(config = {}) {
  const keys = Object.keys(globalObserverConfig);
  Object.entries(config).forEach(([key, value]) => {
    if (keys.includes(key)) {
      globalObserverConfig[key] = value;
      updateProcessMap[key]?.(value);
    }
  });
  return globalObserverConfig;
}

/**
 * @name 停止全局观察器
 */
export function stopObserver() {
  globObserver?.disconnect();
  globObserver = null;
  globBrandObserver?.disconnect();
  globBrandObserver = null;
  closeProxy();
  removeAllTransDiv();
}
