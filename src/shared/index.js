// const modules = import.meta.glob('./*.js', { eager: true });
// const exportModules = {};
// for (const path in modules) {
//   const moduleExports = modules[path];
//   Object.keys(moduleExports).forEach((key) => {
//     exportModules[key] = moduleExports[key];
//   });
// }

// export default exportModules;

export {
  startObserver,
  stopObserver,
  addObserverHook,
  insertOrUpdateTransferNode,
  updateObserverConfig,
  closeSendMessageProxy,
  observerSendMessage,
  provideBrand
} from './observer';
export { provideSettingStyle } from './provideSettingStyle';
export { clearByCtrlA } from './deleteContent';
export { transferInputText } from './input';
export * from './messageType';
export * from './settingConfig';
export * from './langConfig';
export * from './utils';
export * from './message';
