import { computed } from 'vue';
import { langs as rawLangs } from '@/langs/langOptions';
import { generateMap } from '@/shared';
import i18n from '@/langs';

export function useLang() {
  // 国际化的语言选项
  const langs = computed(() => {
    return rawLangs.map((lang) => ({
      ...lang,
      label: i18n.global.t(`lang.${lang.value}`, lang.label) // 如果翻译不存在，使用原始 label 作为后备
    }));
  });

  // 根据 value 查找语言名称
  const getLangLabel = (value) => {
    const lang = langs.value.find((item) => item.value === value);
    return lang ? lang.label : value;
  };

  // 根据 label 查找语言代码
  const getLangValue = (label) => {
    const lang = langs.value.find((item) => item.label === label);
    return lang ? lang.value : label;
  };

  // 创建语言映射
  const langMap = computed(() => generateMap(langs.value, 'value', (item) => item.label));

  // label to value 映射
  const langLabel2ValueMap = computed(() => generateMap(langs.value, 'label', (item) => item.value));

  return {
    langs,
    langMap,
    langLabel2ValueMap,
    getLangLabel,
    getLangValue
  };
}
