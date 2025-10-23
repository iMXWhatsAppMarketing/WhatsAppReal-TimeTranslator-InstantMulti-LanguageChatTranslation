import { observerHooks } from './observer';
import { MessagType } from './messageType';

const messageBeforeMap = {
  [MessagType.TransferSendContent]: () => {
    observerHooks?.beforeSendTranslate?.forEach((fn) => fn());
  },
  [MessagType.TransferHistory]: () => {
    observerHooks?.beforeHistoryTranslate?.forEach((fn) => fn());
  }
};
const messageEndMap = {
  [MessagType.TransferSendContent]: () => {
    observerHooks?.afterSendTranslate?.forEach((fn) => fn());
  },
  [MessagType.TransferHistory]: () => {
    observerHooks?.afterHistoryTranslate?.forEach((fn) => fn());
  }
};

/**
 * @name 发送消息通知服务端翻译
 */
export function sendMessageToServerTransfer({ type, data, callback }) {
  messageBeforeMap[type]?.();
  sendMessageToServer({
    type,
    data,
    callback: (response) => {
      messageEndMap[type]?.();
      callback?.(response);
    }
  });
}

export function sendMessageToServer({ type, data, callback }) {
  chrome.runtime.sendMessage(
    {
      type,
      data
    },
    function (response) {
      if (chrome.runtime.lastError) {
        console.error('发送消息时出错: ', chrome.runtime.lastError);
        return;
      }
      callback?.(response);
    }
  );
}
