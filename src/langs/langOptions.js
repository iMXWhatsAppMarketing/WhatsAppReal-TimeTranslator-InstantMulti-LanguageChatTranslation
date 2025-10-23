import { generateMap } from '@/shared';

export const langs = [
  {
    label: '阿布哈兹语',
    value: 'ab'
  },
  {
    label: '亚齐语',
    value: 'ace'
  },
  {
    label: '阿乔利语',
    value: 'ach'
  },
  {
    label: '阿非利卡语',
    value: 'af'
  },
  {
    label: '阿尔巴尼亚语',
    value: 'sq'
  },
  {
    label: '阿尔弗玛语',
    value: 'alz'
  },
  {
    label: '阿姆哈拉语',
    value: 'am'
  },
  {
    label: '阿拉伯语',
    value: 'ar'
  },
  {
    label: '亚美尼亚语',
    value: 'hy'
  },
  {
    label: '阿萨姆语',
    value: 'as'
  },
  {
    label: 'Awadhi',
    value: 'awa'
  },
  {
    label: '艾马拉语',
    value: 'ay'
  },
  {
    label: '阿塞拜疆语',
    value: 'az'
  },
  {
    label: '巴厘语',
    value: 'ban'
  },
  {
    label: '班巴拉语',
    value: 'bm'
  },
  {
    label: '巴什基尔语',
    value: 'ba'
  },
  {
    label: '巴斯克语',
    value: 'eu'
  },
  {
    label: '巴塔克托巴语',
    value: 'btx'
  },
  {
    label: '巴塔克茜玛隆贡语',
    value: 'bts'
  },
  {
    label: '巴塔克托巴语',
    value: 'bbc'
  },
  {
    label: '白俄罗斯语',
    value: 'be'
  },
  {
    label: '本巴语',
    value: 'bem'
  },
  {
    label: '孟加拉语',
    value: 'bn'
  },
  {
    label: '贝陶语',
    value: 'bew'
  },
  {
    label: '博杰普尔语',
    value: 'bho'
  },
  {
    label: '比科尔语',
    value: 'bik'
  },
  {
    label: '波斯尼亚语',
    value: 'bs'
  },
  {
    label: '布列塔尼语',
    value: 'br'
  },
  {
    label: '保加利亚语',
    value: 'bg'
  },
  {
    label: '布里亚特语',
    value: 'bua'
  },
  {
    label: '粤语',
    value: 'yue'
  },
  {
    label: '加泰罗尼亚语',
    value: 'ca'
  },
  {
    label: '宿务语',
    value: 'ceb'
  },
  {
    label: '齐切瓦语',
    value: 'ny'
  },
  {
    label: '中文（简体）',
    value: 'zh-CN'
  },
  {
    label: '中文（繁体）',
    value: 'zh-TW'
  },
  {
    label: '楚瓦什语',
    value: 'cv'
  },
  {
    label: '科西嘉语',
    value: 'co'
  },
  {
    label: '克里米亚鞑靼语',
    value: 'crh'
  },
  {
    label: '克罗地亚语',
    value: 'hr'
  },
  {
    label: '捷克语',
    value: 'cs'
  },
  {
    label: '丹麦语',
    value: 'da'
  },
  {
    label: 'Dinka',
    value: 'din'
  },
  {
    label: '第维埃语',
    value: 'dv'
  },
  {
    label: '多格来语',
    value: 'doi'
  },
  {
    label: '敦贝语',
    value: 'dov'
  },
  {
    label: '荷兰语',
    value: 'nl'
  },
  {
    label: '宗卡语',
    value: 'dz'
  },
  {
    label: '英语',
    value: 'en'
  },
  {
    label: '世界语',
    value: 'eo'
  },
  {
    label: '爱沙尼亚语',
    value: 'et'
  },
  {
    label: 'Ewe',
    value: 'ee'
  },
  {
    label: '斐济语',
    value: 'fj'
  },
  {
    label: '菲律宾语（塔加拉语）',
    value: 'fil'
  },
  {
    label: '芬兰语',
    value: 'fi'
  },
  {
    label: '法语',
    value: 'fr'
  },
  {
    label: '法语（法国）',
    value: 'fr-FR'
  },
  {
    label: '法语（加拿大）',
    value: 'fr-CA'
  },
  {
    label: '弗里斯兰语',
    value: 'fy'
  },
  {
    label: '富拉语',
    value: 'ff'
  },
  {
    label: '加 (Ga) 语',
    value: 'gaa'
  },
  {
    label: '加利西亚语',
    value: 'gl'
  },
  {
    label: '干达语（卢干达语）',
    value: 'lg'
  },
  {
    label: '格鲁吉亚语',
    value: 'ka'
  },
  {
    label: '德语',
    value: 'de'
  },
  {
    label: '希腊语',
    value: 'el'
  },
  {
    label: '瓜拉尼语',
    value: 'gn'
  },
  {
    label: '古吉拉特语',
    value: 'gu'
  },
  {
    label: '海地克里奥尔语',
    value: 'ht'
  },
  {
    label: '哈卡钦语',
    value: 'cnh'
  },
  {
    label: 'Hausa',
    value: 'ha'
  },
  {
    label: '夏威夷语',
    value: 'haw'
  },
  {
    label: '希伯来语',
    value: 'iw'
  },
  {
    label: '希利盖农语',
    value: 'hil'
  },
  {
    label: '印地语',
    value: 'hi'
  },
  {
    label: '苗语',
    value: 'hmn'
  },
  {
    label: '匈牙利语',
    value: 'hu'
  },
  {
    label: '洪斯吕克语',
    value: 'hrx'
  },
  {
    label: '冰岛语',
    value: 'is'
  },
  {
    label: 'Igbo',
    value: 'ig'
  },
  {
    label: '伊洛果语',
    value: 'ilo'
  },
  {
    label: '印度尼西亚语',
    value: 'id'
  },
  {
    label: '爱尔兰语',
    value: 'ga'
  },
  {
    label: '意大利语',
    value: 'it'
  },
  {
    label: '日语',
    value: 'ja'
  },
  {
    label: '爪哇语',
    value: 'jw'
  },
  {
    label: '卡纳达语',
    value: 'kn'
  },
  {
    label: '邦板牙语',
    value: 'pam'
  },
  {
    label: '哈萨克语',
    value: 'kk'
  },
  {
    label: '高棉语',
    value: 'km'
  },
  {
    label: 'Kiga',
    value: 'cgg'
  },
  {
    label: '卢旺达语',
    value: 'rw'
  },
  {
    label: '吉土巴语',
    value: 'ktu'
  },
  {
    label: '贡根语',
    value: 'gom'
  },
  {
    label: '韩语',
    value: 'ko'
  },
  {
    label: 'Krio',
    value: 'kri'
  },
  {
    label: '库尔德语（库尔曼吉语）',
    value: 'ku'
  },
  {
    label: '库尔德语（索拉尼语）',
    value: 'ckb'
  },
  {
    label: '吉尔吉斯语',
    value: 'ky'
  },
  {
    label: '老挝语',
    value: 'lo'
  },
  {
    label: '拉特加莱语',
    value: 'ltg'
  },
  {
    label: '拉丁语',
    value: 'la'
  },
  {
    label: '拉脱维亚语',
    value: 'lv'
  },
  {
    label: '利古里亚语',
    value: 'lij'
  },
  {
    label: '林堡语',
    value: 'li'
  },
  {
    label: '林加拉语',
    value: 'ln'
  },
  {
    label: '立陶宛语',
    value: 'lt'
  },
  {
    label: '伦巴第语',
    value: 'lmo'
  },
  {
    label: 'Luo',
    value: 'luo'
  },
  {
    label: '卢森堡语',
    value: 'lb'
  },
  {
    label: '马其顿语',
    value: 'mk'
  },
  {
    label: '迈蒂利语',
    value: 'mai'
  },
  {
    label: '马卡萨',
    value: 'mak'
  },
  {
    label: '马尔加什语',
    value: 'mg'
  },
  {
    label: '马来语',
    value: 'ms'
  },
  {
    label: '马来语（爪夷文）',
    value: 'ms-Arab'
  },
  {
    label: '马拉雅拉姆语',
    value: 'ml'
  },
  {
    label: '马耳他语',
    value: 'mt'
  },
  {
    label: '毛利语',
    value: 'mi'
  },
  {
    label: '马拉地语',
    value: 'mr'
  },
  {
    label: '草原马里语',
    value: 'chm'
  },
  {
    label: '梅泰语（曼尼普尔语）',
    value: 'mni-Mtei'
  },
  {
    label: '米南语',
    value: 'min'
  },
  {
    label: '米佐语',
    value: 'lus'
  },
  {
    label: '蒙古语',
    value: 'mn'
  },
  {
    label: '缅甸语',
    value: 'my'
  },
  {
    label: '恩德贝莱语（南部）',
    value: 'nr'
  },
  {
    label: '尼泊尔语（尼瓦尔语）',
    value: 'new'
  },
  {
    label: '尼泊尔语',
    value: 'ne'
  },
  {
    label: '北索托语（塞佩蒂语）',
    value: 'nso'
  },
  {
    label: '挪威语',
    value: 'no'
  },
  {
    label: '努尔语',
    value: 'nus'
  },
  {
    label: '奥克斯坦语',
    value: 'oc'
  },
  {
    label: '奥里亚语（奥里亚）',
    value: 'or'
  },
  {
    label: 'Oromo',
    value: 'om'
  },
  {
    label: '邦阿西楠语',
    value: 'pag'
  },
  {
    label: 'Papiamento',
    value: 'pap'
  },
  {
    label: 'Pashto',
    value: 'ps'
  },
  {
    label: '波斯语',
    value: 'fa'
  },
  {
    label: '波兰语',
    value: 'pl'
  },
  {
    label: '葡萄牙语',
    value: 'pt'
  },
  {
    label: '葡萄牙语（葡萄牙）',
    value: 'pt-PT'
  },
  {
    label: '葡萄牙语（巴西）',
    value: 'pt-BR'
  },
  {
    label: '旁遮普语',
    value: 'pa'
  },
  {
    label: '旁遮普语（沙木基文）',
    value: 'pa-Arab'
  },
  {
    label: '克丘亚语',
    value: 'qu'
  },
  {
    label: '罗姆语',
    value: 'rom'
  },
  {
    label: '罗马尼亚语',
    value: 'ro'
  },
  {
    label: 'Rundi',
    value: 'rn'
  },
  {
    label: '俄语',
    value: 'ru'
  },
  {
    label: '萨摩亚语',
    value: 'sm'
  },
  {
    label: 'Sango',
    value: 'sg'
  },
  {
    label: '梵语',
    value: 'sa'
  },
  {
    label: '苏格兰盖尔语',
    value: 'gd'
  },
  {
    label: '塞尔维亚语',
    value: 'sr'
  },
  {
    label: '塞索托语',
    value: 'st'
  },
  {
    label: '塞舌尔克里奥尔语',
    value: 'crs'
  },
  {
    label: '掸语',
    value: 'shn'
  },
  {
    label: '修纳语',
    value: 'sn'
  },
  {
    label: '西西里语',
    value: 'scn'
  },
  {
    label: '西里西亚语',
    value: 'szl'
  },
  {
    label: '信德语',
    value: 'sd'
  },
  {
    label: '僧伽罗语',
    value: 'si'
  },
  {
    label: '斯洛伐克语',
    value: 'sk'
  },
  {
    label: '斯洛文尼亚语',
    value: 'sl'
  },
  {
    label: '索马里语',
    value: 'so'
  },
  {
    label: '西班牙语',
    value: 'es'
  },
  {
    label: '巽他语',
    value: 'su'
  },
  {
    label: '斯瓦希里语',
    value: 'sw'
  },
  {
    label: '斯瓦特语',
    value: 'ss'
  },
  {
    label: '瑞典语',
    value: 'sv'
  },
  {
    label: '塔吉克语',
    value: 'tg'
  },
  {
    label: '泰米尔语',
    value: 'ta'
  },
  {
    label: '鞑靼语',
    value: 'tt'
  },
  {
    label: '泰卢固语',
    value: 'te'
  },
  {
    label: '德顿语',
    value: 'tet'
  },
  {
    label: '泰语',
    value: 'th'
  },
  {
    label: '提格里尼亚语',
    value: 'ti'
  },
  {
    label: '聪加语',
    value: 'ts'
  },
  {
    label: '茨瓦纳语',
    value: 'tn'
  },
  {
    label: '土耳其语',
    value: 'tr'
  },
  {
    label: '土库曼语',
    value: 'tk'
  },
  {
    label: '契维语（阿坎语）',
    value: 'ak'
  },
  {
    label: '乌克兰语',
    value: 'uk'
  },
  {
    label: '乌尔都语',
    value: 'ur'
  },
  {
    label: '维吾尔语',
    value: 'ug'
  },
  {
    label: '乌兹别克语',
    value: 'uz'
  },
  {
    label: '越南语',
    value: 'vi'
  },
  {
    label: '威尔士语',
    value: 'cy'
  },
  {
    label: '科萨语',
    value: 'xh'
  },
  {
    label: '意第绪语',
    value: 'yi'
  },
  {
    label: '约鲁巴语',
    value: 'yo'
  },
  {
    label: '尤卡坦玛雅语',
    value: 'yua'
  },
  {
    label: '祖鲁语',
    value: 'zu'
  }
];

export const langsMap = generateMap(langs, 'value', (item) => item.label);
