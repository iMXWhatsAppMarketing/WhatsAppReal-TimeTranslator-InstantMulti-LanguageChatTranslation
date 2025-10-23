// 要插入聊天记录节点的class
const classPrefix = 'imx-provide-trans';

// 要插入品牌节点的class
const brandClassPrefix = 'imx-provide-brand';

// 输入框节点的class
const inputNodeClass = '._ak1r';

// 代理最底层发送按钮
// const proxySendNodeClass = `${inputNodeClass} span[data-icon="send"]`
const proxySendNodeClass = `${inputNodeClass} span[data-icon="wds-ic-send-filled"]`;

// 发送按钮节点的class
const sendNodeClass = `${inputNodeClass} *[aria-label="发送"]`;

// 需要拦截的contenteditable元素class
const contenteditableClass = `${inputNodeClass} div[contenteditable="true"][data-tab="10"]`;

// 要插入聊天记录目标的class
const insertTransferNodeQuery = '[class*="_akbu"]';

// 聊天记录节点的class
const historyNodeQuery = '#main';

// 输入框文本节点的选择器
const inputTextNodeTarget = 'span[data-lexical-text=true]';

// 聊天记录滚动容器
const scrollContainerClass = `${historyNodeQuery} div[class*="x1rife3k"]`;

// 注入品牌dom
const brandNodeQuery = 'span[aria-label="WhatsApp"]';

// content script id
const contentScriptId = 'imx-crx-root';

export {
  classPrefix,
  proxySendNodeClass,
  contenteditableClass,
  insertTransferNodeQuery,
  historyNodeQuery,
  inputNodeClass,
  sendNodeClass,
  inputTextNodeTarget,
  scrollContainerClass,
  brandNodeQuery,
  brandClassPrefix,
  contentScriptId
};
