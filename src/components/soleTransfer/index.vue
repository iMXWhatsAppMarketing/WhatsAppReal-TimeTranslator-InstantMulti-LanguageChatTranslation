<template>
  <n-float-button :show="showFloatButton" @click="toggleTransfer" :position="position" :type="floatButtonType" :size="floatButtonSize">
    <n-icon size="20">
      <Translate />
    </n-icon>
  </n-float-button>

  <n-drawer v-model:show="showDrawer" :width="drawerWidth" :placement="drawerPlacement" :trap-focus="false" :block-scroll="false">
    <n-drawer-content title="语言切换设置">
      <n-spin :show="show">
        <div class="sole-transfer">
          <div class="sole-transfer--item">
            <div>
              当前聊天记录语言：
              <span class="sole-transfer--primary">
                {{ currentHistoryLangLabel }}
              </span>
            </div>
            <div class="sole-transfer--lang">
              <span> 切换语言： </span>
              <lang-select class="sole-transfer--lang-select" v-model:modelValue="historyLang" @change="handleHistoryChange" />
            </div>
          </div>
          <div class="sole-transfer--item">
            <div>
              当前发送语言：
              <span class="sole-transfer--primary">
                {{ currentLangLabel }}
              </span>
            </div>
            <div class="sole-transfer--lang">
              <span> 切换语言： </span>
              <lang-select class="sole-transfer--lang-select" v-model:modelValue="lang" @change="handleChange" />
            </div>
          </div>
        </div>
      </n-spin>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { globalLangConfig, getSoleLangKey, getLangConfig, setItem } from '@/shared';
import { langsMap } from '@/langs/langOptions';
import LangSelect from '@/components/langSelect';
import { Translate } from '@vicons/carbon';

// 浮动按钮相关状态
const showFloatButton = ref(true);
const showDrawer = ref(false);
const position = ref('bottom-right');
const floatButtonType = ref('primary');
const floatButtonSize = ref('large');
const drawerWidth = ref(600);
const drawerPlacement = ref('right');

// 原有状态
const show = ref(false);
const lang = ref();
const historyLang = ref();

// 切换抽屉显示状态
const toggleTransfer = () => {
  showDrawer.value = !showDrawer.value;
  if (showDrawer.value) {
    getChatLang();
  }
};

const getChatLang = async () => {
  show.value = true;
  const { chatId, key, historyKey } = getSoleLangKey();
  const globalLang = await getLangConfig(globalLangConfig.lang);
  const globalHistoryLang = await getLangConfig(globalLangConfig.historyLang);
  if (chatId) {
    const langTarget = { key, defaultValue: globalLang };
    lang.value = await getLangConfig(langTarget);

    const historyLangTarget = {
      key: historyKey,
      defaultValue: globalHistoryLang
    };
    historyLang.value = await getLangConfig(historyLangTarget);
  }
  show.value = false;
};

const currentLangLabel = computed(() => langsMap[lang.value]);
const currentHistoryLangLabel = computed(() => langsMap[historyLang.value]);

onMounted(async () => {});

const handleChange = (val) => {
  const { key } = getSoleLangKey();
  setItem(key, val);
};

const handleHistoryChange = (val) => {
  const { historyKey } = getSoleLangKey();
  setItem(historyKey, val);
};
</script>

<style lang="scss" scoped>
$prefix: 'sole-transfer';

.#{$prefix} {
  padding: 20px 0;
}
.#{$prefix}--primary {
  color: #209cdf;
}

.#{$prefix}--item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;

  &:first-child {
    margin-bottom: 10px;
  }
}

.#{$prefix}--lang {
  display: flex;
  align-items: center;
  gap: 5px;
}

.#{$prefix}--lang-select {
  flex: 1;
  max-width: 300px;
  min-width: 150px;
}
</style>
