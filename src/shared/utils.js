import { isEmpty, isNil } from 'lodash';
import { insertTransferNodeQuery } from './domConfig';
import { globalLangConfig, SHORTCUT_KEY_ENUM } from './langConfig';
import dayjs from 'dayjs';

/**
 * @name 从chrome.storage.local获取指定key的值，如果为空则返回默认值。
 * @param {string} key - 要获取的存储 key。
 * @param {Object|Function} [defaultValue={}] - 默认值或返回默认值的函数。
 * @returns {Promise<any>} 获取到的值或默认值。
 */
export function getItem(key, defaultValue = {}) {
  return chrome.storage.local.get(key).then(async (res) => {
    const val = res[key];
    if (isNil(val)) {
      return typeof defaultValue === 'function' ? await defaultValue(res) : defaultValue;
    } else {
      return res[key];
    }
  });
}

export function setItem(key, value) {
  return chrome?.storage?.local?.set({ [key]: value });
}

export function getLangConfig(target) {
  return getItem(target?.key, () => {
    const initVal = target?.defaultValue;
    setItem(target.key, initVal);
    return initVal;
  });
}

/**
 * @name 遍历对象的每个键值对，并执行回调。
 * @param {Object} [target={}] - 要遍历的对象。
 * @param {(key: string, value: any) => void} callback - 回调函数，参数为 key 和 value。
 */
export function entries(target = {}, callback) {
  if (target && typeof target === 'object') {
    Object.entries(target).forEach(([key, value]) => {
      callback(key, value);
    });
  }
}

/**
 * @name 判断对象是否为空或包含空值。
 * @param {Object} [target={}] - 要检查的对象。
 * @returns {boolean} 是否为空或包含空值。
 */
export function objectHasEmptyValue(target = {}) {
  if (typeof target !== 'object') return false;
  return isEmpty(target) || Object.values(target).some((item) => isEmpty(item));
}

/**
 * @name 通过dom查找当前message的id信息
 * @param {HTMLElement} element - element对象
 */
export function getCurrentChatMessageId(element) {
  const el = element ? element : document.querySelector(insertTransferNodeQuery);
  return el?.closest('[role="row"]')?.firstChild?.getAttribute?.('data-id');
}

/**
 * @name message的id信息获取当前用户id
 * @param {HTMLElement} element - element对象
 */
export function getSoleLangKey() {
  const chatId = getCurrentChatId();
  const key = getSoleKey(globalLangConfig.lang.key, chatId);
  const historyKey = getSoleKey(globalLangConfig.historyLang.key, chatId);
  return { chatId, key, historyKey };
}

/**
 * @name 获取当前会话id
 */
export function getCurrentChatId() {
  const info = getCurrentChatMessageId();
  return extractNumberFromString(info);
}

/**
 * 从字符串中提取 true_|false_ 到第一个 @ 之间的数字
 * @param {string} str - 输入的字符串
 * @returns {string|null} 提取的数字，如果没有找到则返回 null
 */
export function extractNumberFromString(str) {
  if (!str || typeof str !== 'string') {
    return null;
  }
  // 使用正则表达式匹配 true_ 或 false_ 后面的数字，直到遇到第一个 @
  const regex = /(?:true_|false_)(\d+)@/;
  const match = str.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * @param {?String} key
 * @param {Object} item
 */
function getKey(key, item) {
  if (!key) return item;
  const property = fnGet(key, item);
  return Object.hasOwnProperty.call(item, property) ? item[property] : property;
}

/**
 * @param {?String | Function} key
 * @param {Object} item
 */
function fnGet(key, item) {
  if (!key) return item;
  return typeof key === 'function' ? key(item) : key;
}

/**
 * 将Array转化为Maps
 * @param {Array<object>} target 目标数组
 * @param {?Function | String} key 集合键
 * @param {?Function | String} value 集合值
 */
export function generateMap(target, key, value) {
  if (target instanceof Array) {
    const map = {};
    for (const item of target) {
      map[getKey(fnGet(key, item), item)] = fnGet(value, item);
    }
    return map;
  }
  return target;
}

export function getSoleKey(globalKey, chatId) {
  return `${globalKey}--${chatId}`;
}

/**
 *
 * @template T
 * @param {T | T[]} source
 * @returns {T[]}
 */
export function ensureArray(source) {
  if (source == null) return [];
  if (Array.isArray(source)) return source;
  return [source];
}

export function exportConfig(formValue) {
  // 创建配置对象
  const configData = {
    historyLang: formValue.historyLang,
    lang: formValue.lang,
    fontColor: formValue.fontColor,
    fontSize: formValue.fontSize,
    receiveTranslate: formValue.receiveTranslate,
    sendTranslateMode: formValue.sendTranslateMode,
    proxyError: formValue.proxyError,
    shortcutKey: formValue.shortcutKey
  };

  // 转换为JSON字符串
  const jsonString = JSON.stringify(configData, null, 2);

  // 创建Blob对象
  const blob = new Blob([jsonString], { type: 'application/json' });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = dayjs().format('YYYY-MM-DD_HH-mm-ss');
  link.download = `translate-config-${dateStr}.json`;

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
