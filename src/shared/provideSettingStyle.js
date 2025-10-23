/**
 * @name 根据setting注入css变量
 * @param {object} setting
 */
export function provideSettingStyle(setting = {}) {
  const htmlElement = document.querySelector('html');
  for (const [key, value] of Object.entries(setting)) {
    htmlElement.style.setProperty(key, value);
  }
}
