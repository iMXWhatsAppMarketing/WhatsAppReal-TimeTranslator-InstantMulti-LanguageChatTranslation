import { getItem, globalLangConfig, entries, getLangConfig, getSoleKey, extractNumberFromString, setItem } from '@/shared';
import { MessagType } from '@/shared/messageType';
import i18n from '@/langs';

const messageMap = {
  [MessagType.TransferHistory]: sendResoponseTransfer,
  [MessagType.TransferSendContent]: sendResoponseTransfer,
  [MessagType.ChangeSetting]: sendResoponseSetting,
  [MessagType.ChangeLang]: sendResoponseLang
};

const messageGetTransferTargetMap = {
  [MessagType.TransferHistory]: globalLangConfig.historyLang,
  [MessagType.TransferSendContent]: globalLangConfig.lang
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message;
  messageMap[type]?.(message, sendResponse);
  return true;
});

function getTransferKey(chatId, lang) {
  return `${chatId}--${lang}`;
}

async function sendResoponseTransfer(message, sendResponse) {
  const { data, type } = message;
  const { chatId } = data;
  const flag = type === MessagType.TransferSendContent;
  if (flag) {
    const serverValue = await getTransferText(type, data);
    const content = serverValue.translation;
    sendResponse(serverValue.error ? serverValue : { content });
  } else {
    const targetLang = await getTargetLang(type, chatId);
    const storageKey = getTransferKey(chatId, targetLang);
    const localValue = await getItem(storageKey, null);
    if (localValue) {
      sendResponse({ content: localValue });
    } else {
      const serverValue = await getTransferText(type, data);
      const content = serverValue.translation;
      chatId && setItem(storageKey, content);
      sendResponse({ content });
    }
  }
}

function sendResoponseSetting(message, sendResponse) {
  const { setting } = message?.data || {};
  setItem('setting', setting);
}

function sendResoponseLang(message, sendResponse) {
  const data = message?.data || {};
  const { changes } = data;
  entries(changes, (key, value) => {
    setItem(key, value);
  });
}

async function getTargetLang(type, chatId) {
  const soleKey = getSoleKey(messageGetTransferTargetMap[type].key, extractNumberFromString(chatId));
  const soleLang = await getItem(soleKey, null);
  const globalLLang = await getLangConfig(messageGetTransferTargetMap[type]);
  return soleLang || globalLLang;
}

async function getTransferText(type, data) {
  const { chatId, content } = data;
  const url = 'https://translate-pa.googleapis.com/v1/translate/';
  const targetLang = await getTargetLang(type, chatId);
  const proxyError = await getItem(globalLangConfig.proxyError.key, false);
  const params = new URLSearchParams({
    'params.client': 'gtx',
    'query.source_language': 'auto',
    'query.target_language': targetLang,
    'query.display_language': 'es',
    'query.text': content,
    key: 'AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA',
    data_types: 'TRANSLATION'
  });
  params.append('data_types', 'SENTENCE_SPLITS');
  params.append('data_types', 'BILINGUAL_DICTIONARY_FULL');
  const typeFlag = type === MessagType.TransferSendContent;
  return fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      if (!response.ok) {
        return getProxyError(proxyError, content, response, typeFlag);
      }
      return response.json();
    })
    .catch((error) => {
      return getProxyError(proxyError, content, error, typeFlag);
    });
}

function getProxyError(proxyError, content, response, typeFlag) {
  if (typeFlag) {
    return proxyError ? { error: true, messageKey: 'message.server.translateError', translation: content } : { translation: content };
  } else {
    throw new Error(`网络响应错误: ${response.status} ${response.statusText}`);
  }
}
