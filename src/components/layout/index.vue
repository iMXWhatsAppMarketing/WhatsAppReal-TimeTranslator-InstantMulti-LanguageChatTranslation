<template>
  <div class="layout">
    <!-- <n-form-item class="layout--mx" label="动态翻译：">
					<n-switch v-model:value="dynamicTranfer"/>
				</n-form-item> -->
    <n-form-item class="layout--mx" :label="$t('common.historyLang')" :show-feedback="false">
      <lang-select v-model:value="historyLang" :menu-props="menuProps" />
    </n-form-item>
    <n-form-item class="layout--mx" :label="$t('common.lang')" :show-feedback="false">
      <lang-select v-model:value="lang" :menu-props="menuProps" />
    </n-form-item>
    <div class="layout--between layout--mx">
      <div>{{ $t('common.receiveTranslate') }}</div>
      <n-switch v-model:value="receiveTranslate" />
    </div>

    <n-form-item class="layout--mx" :label="$t('common.sendTranslateMode.title')" :show-feedback="false">
      <n-radio-group v-model:value="sendTranslateMode">
        <n-radio :value="SEND_TRANSLATE_MODE_ENUM.AUTO">{{ $t('common.sendTranslateMode.auto') }}</n-radio>
        <n-radio :value="SEND_TRANSLATE_MODE_ENUM.MANUAL">{{ $t('common.sendTranslateMode.manual') }}</n-radio>
      </n-radio-group>
    </n-form-item>
    <div class="layout--handle">
      <n-button @click="handleToOption" type="primary">
        <template #icon>
          <n-icon>
            <Settings />
          </n-icon>
        </template>
        {{ $t('common.moreSettings') }}
      </n-button>
      <n-button type="primary" @click="handleToContactUs">
        <template #icon>
          <n-icon>
            <Headset />
          </n-icon>
        </template>
        {{ $t('common.contactUs') }}
      </n-button>
    </div>
  </div>
</template>
<script setup>
import LangSelect from '@/components/langSelect';
import { useI18n } from 'vue-i18n';
import { useSetting } from '@/hooks/useSetting';
import { Settings, Headset } from '@vicons/carbon';
import { SEND_TRANSLATE_MODE_ENUM } from '@/shared';

const contactUsUrl = import.meta.env.VITE_APP_SERVICE_URL;

const { t } = useI18n();

// 使用setting hooks（自动处理初始化）
const { historyLang, lang, receiveTranslate, sendTranslateMode } = useSetting();

const handleToOption = () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('option.html'));
  }
};

const handleToContactUs = () => {
  window.open(contactUsUrl, '_blank');
};

const menuProps = {
  style: {
    '--n-height': 'calc(var(--n-option-height) * 4.6)'
  }
};
</script>

<style lang="scss" scoped>
$prefix: 'layout';
.#{$prefix} {
  padding: 20px;
}
.#{$prefix}--mx {
  margin: 10px 0;
}
@mixin space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.#{$prefix}--between {
  @include space-between;
}
.#{$prefix}--handle {
  @include space-between;
}
:deep(.n-radio-group) {
  @include space-between;
  width: 100%;
}
// :deep(.n-radio) {
// 	flex: 1 !important;
// 	display: flex !important;
// 	justify-content: center !important;
// 	align-items: center !important;
// 	width: 50% !important;
// 	box-sizing: border-box !important;
// }
// :deep(.n-radio__dot-wrapper) {
// 	flex-shrink: 0 !important;
// }
:deep(.n-radio__label) {
  flex: 1 !important;
  white-space: nowrap !important;
}
</style>
