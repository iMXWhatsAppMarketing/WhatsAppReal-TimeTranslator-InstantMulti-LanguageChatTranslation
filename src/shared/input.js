import { sendMessageToServerTransfer } from './message.js';
import { contenteditableClass, sendNodeClass } from './domConfig';
import { MessagType } from './messageType.js';
import { getCurrentChatMessageId } from './utils.js';
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui';
import { computed, ref } from 'vue';
import { useShortcutKey } from '@/hooks/useShortcurKey.js';
import { t } from '@/langs/index.js';

const themeRef = ref('light');
const configProviderPropsRef = computed(() => ({
  theme: themeRef.value === 'light' ? lightTheme : darkTheme
}));

const { message: messageApi } = createDiscreteApi(['message'], {
  configProviderProps: configProviderPropsRef
});

/**
 * @name 使用document.execCommand替换输入框内容
 * @param {HTMLInputElement} input - 要替换内容的输入框元素
 * @param {string} text - 要插入的文本内容
 * @param {function} [callback] - 操作完成后的回调函数
 */
export function replaceByComd(input, text, callback) {
  input.focus();
  const range = document.createRange();
  range.selectNodeContents(input);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('insertText', false, text);
  ['keydown', 'input', 'change', 'keyup'].forEach((type) => {
    input.dispatchEvent(
      new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true
      })
    );
  });
  callback?.();
}

/**
 * @name 使用DataTransfer API通过粘贴事件替换输入框内容
 * @param {HTMLInputElement} input - 要替换内容的输入框元素
 * @param {string} text - 要插入的文本内容
 * @param {function} [callback] - 操作完成后的回调函数
 */
function replaceByDataTransfer(input, text, callback) {
  input.focus();
  const range = document.createRange();
  range.selectNodeContents(input);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', text);

  const pasteEvent = new ClipboardEvent('paste', {
    clipboardData: dataTransfer,
    bubbles: true,
    cancelable: true
  });

  input.dispatchEvent(pasteEvent);

  ['keydown', 'input', 'change', 'keyup'].forEach((type) => {
    input.dispatchEvent(
      new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true
      })
    );
  });

  callback?.(text);
}

/**
 * @name 翻译输入框内容
 * @param {function} [callback] - 翻译完成后的回调函数
 */
export function transferInputText(callback) {
  const input = document.querySelector(contenteditableClass);
  const text = input?.firstChild?.firstChild?.textContent;
  if (text) {
    sendMessageToServerTransfer({
      type: MessagType.TransferSendContent,
      data: {
        content: text,
        chatId: getCurrentChatMessageId()
      },
      callback: async (response) => {
        const { content, error, messageKey } = response;
        if (error) {
          messageApi.error(t(messageKey));
          return;
        }
        const callbackFn =
          callback ||
          (() => {
            sendMessage();
          });
        replaceByDataTransfer(input, content, callbackFn);
      }
    });
  }
}

/**
 * @name 处理键盘输入事件的监听器
 * @param {KeyboardEvent} event - 键盘事件对象
 */
function listenerHandler(event) {
  if (event.key === 'Enter') {
    event.stopImmediatePropagation();
    event.preventDefault();
    transferInputText();
  }
}

/**
 * @name 代理键盘回车事件
 * @param {HTMLElement} el - 要监听回车事件的元素
 */
export function proxyKeydownEnter(el) {
  if (!el) return;
  el.addEventListener('keydown', listenerHandler, true);
}

export function removeKeydownEnter(el) {
  if (!el) return;
  el.removeEventListener('keydown', listenerHandler, true);
}

/**
 * @name 发送消息函数
 */
export function sendMessage() {
  const timer = setTimeout(() => {
    document.querySelector(sendNodeClass)?.click();
    clearTimeout(timer);
  }, 50);
}

export function createInputShortcutKeyProxy(shortcutKey, callback) {
  return useShortcutKey(shortcutKey, callback, { triggerQuery: contenteditableClass });
}
