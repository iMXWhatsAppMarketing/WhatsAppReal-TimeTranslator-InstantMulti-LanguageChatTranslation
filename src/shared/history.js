import { sendMessageToServerTransfer } from './message';
import { classPrefix } from './domConfig';
import { MessagType } from './messageType';
import { delay } from 'lodash';
import { getCurrentChatMessageId } from './utils';

/**
 * @name 创建翻译节点DOM元素
 * @param {Object} options - 配置选项
 * @param {string} [options.prefix=''] - CSS类名前缀
 * @param {string} [options.textContent=''] - 文本内容
 * @returns {HTMLDivElement} 创建的翻译节点
 */
export function createTransDiv({ prefix = classPrefix, textContent = '' }) {
  const div = document.createElement('div');
  div.className = prefix;
  const hr = document.createElement('hr');
  hr.className = `${prefix}--divider`;
  const span = document.createElement('span');
  span.className = `${prefix}-content selectable-text copyable-text`;
  span.textContent = textContent;
  div.appendChild(hr);
  div.appendChild(span);
  return div;
}

/**
 * @name 更新翻译节点DOM元素
 * @param {Object} options - 配置选项
 * @param {string} [options.prefix=''] - CSS类名前缀
 * @param {string} [options.textContent=''] - 文本内容
 * @param {HTMLDivElement} [options.el=''] - 父级查找元素
 */
function updateTransDiv({ el, prefix = classPrefix, textContent = '' }) {
  const ele = el?.querySelector(`.${prefix}-content.selectable-text.copyable-text`);
  if (ele) {
    ele.textContent = textContent;
    return ele;
  }
}

/**
 * @name 通过textContent去拿节点下的所有文本时，whatsapp有个不可见的时间span，所以通过此方法移除
 * @param {Element} element - 要处理的DOM元素
 * @returns {string} 处理后的文本内容
 */
function getTobeTransferText(element) {
  if (!element) return '';
  const clonedElement = element.cloneNode(true);
  if (clonedElement.children.length > 0) {
    const lastChild = clonedElement.children[clonedElement.children.length - 1];
    clonedElement.removeChild(lastChild);
  }
  const textContent = clonedElement.textContent || '';
  return textContent;
}

/**
 * @name 插入翻译节点到指定元素
 * @param {HTMLElement} element - 要插入翻译节点的目标元素
 * @param {Boolean} update - 是否是更新
 */
export function insertTransferNode(element, update = false) {
  const originText = element?.getAttribute('origin-text');
  const text = originText || getTobeTransferText(element);
  const child = element?.querySelector(`[class^="${classPrefix}"]`);
  const chatId = getCurrentChatMessageId(element);
  if (update || !child) {
    sendMessageToServerTransfer({
      type: MessagType.TransferHistory,
      data: {
        content: text,
        chatId
      },
      callback: (response) => {
        const { content } = response;
        if (update) {
          updateTransDiv({ el: child, textContent: content });
          if (child) {
            child.style.height = '0px';
            delay(() => {
              child.style.height = child.scrollHeight + 'px';
            }, 100);
          }
        } else {
          const div = createTransDiv({ textContent: content });
          element.appendChild(div);
          div.style.height = div.scrollHeight + 'px';
          !originText && element.setAttribute('origin-text', text);
        }
      }
    });
  }
}

/**
 * @name 通过textContent去拿节点下的所有文本时，whatsapp有个不可见的时间span，所以通过此方法移除
 * @param {string} text - 要处理的文本
 */
function removeTrailingNumbers(text) {
  if (!text) return text;

  // 匹配末尾的时间格式：数字:数字 am/pm (可选)
  // 支持 1:23, 12:34, 1:23 am, 12:34 pm 等格式
  const regex = /\s*\d{1,2}:\d{2}\s*(am|pm)?$/i;

  return regex.test(text) ? text.replace(regex, '') : text;
}

/**
 * @name 移除所有由createTransDiv创建的div元素。
 * @name 移除全部翻译结果div
 * @param {string} prefix - 需要移除的div的class前缀。
 */
export function removeAllTransDiv(prefix = classPrefix) {
  const divs = document.querySelectorAll(`div.${prefix}`);
  divs.forEach((div) => div.remove());
}
