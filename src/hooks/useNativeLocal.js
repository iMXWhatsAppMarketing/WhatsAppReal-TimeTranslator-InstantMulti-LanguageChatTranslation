import { zhCN, enUS, zhTW, viVN, idID, kmKH, dateZhCN, dateEnUS, dateZhTW, dateViVN, dateIdID, dateKmKH } from 'naive-ui';
import { getLanguage } from '@/langs';
import { computed } from 'vue';

export function useNativeLocal() {
  // 语言映射表
  const localeMap = {
    zh_CN: zhCN,
    zh_TW: zhTW,
    en_US: enUS,
    vi: viVN,
    id: idID,
    km: kmKH,
    my: enUS // 缅甸语暂时使用英语
  };

  // 日期语言映射表
  const dateLocaleMap = {
    zh_CN: dateZhCN,
    zh_TW: dateZhTW,
    en_US: dateEnUS,
    vi: dateViVN,
    id: dateIdID,
    km: dateKmKH,
    my: dateEnUS // 缅甸语暂时使用英语
  };

  // 获取当前语言
  const currentLanguage = computed(() => getLanguage());

  // 获取对应的naive-ui语言包
  const locale = computed(() => {
    const lang = currentLanguage.value;
    return localeMap[lang] || enUS; // 默认使用英语
  });

  // 获取对应的日期语言包
  const dateLocale = computed(() => {
    const lang = currentLanguage.value;
    return dateLocaleMap[lang] || dateEnUS; // 默认使用英语
  });

  return {
    locale,
    dateLocale,
    currentLanguage
  };
}
