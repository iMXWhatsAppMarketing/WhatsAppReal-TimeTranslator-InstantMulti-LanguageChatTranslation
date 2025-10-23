import { contenteditableClass } from './domConfig';

/**
 * @name 通过模拟键盘删除键逐步清空元素内容
 * @param {HTMLElement} element - 要清空内容的DOM元素
 * @returns {Promise<void>}
 */
export async function clearByKeyboard(element) {
  element.focus();
  while (element.textContent.length > 0) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    const delEvent = new KeyboardEvent('keydown', {
      key: 'Delete',
      code: 'Delete',
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(delEvent);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * @name 通过模拟Ctrl+A全选后删除来清空元素内容
 * @param {HTMLElement} element - 要清空内容的DOM元素
 */
export function clearByCtrlA(element) {
  element = element || document.querySelector(contenteditableClass);
  element.focus();
  const ctrlAEvent = new KeyboardEvent('keydown', {
    key: 'a',
    code: 'KeyA',
    ctrlKey: true,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(ctrlAEvent);
  const delEvent = new KeyboardEvent('keydown', {
    key: 'Delete',
    code: 'Delete',
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(delEvent);
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}
