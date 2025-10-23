<template>
  <div class="translate-config-page">
    <div class="content-wrapper">
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="300px" size="medium">
        <div class="section-title">
          {{ $t('options.contentSettings') }}
        </div>
        <n-form-item :label="$t('common.historyLang')" path="historyLang">
          <lang-select class="translate-config-page--form-item" v-model:value="formValue.historyLang" />
        </n-form-item>

        <n-form-item :label="$t('common.lang')" path="lang">
          <lang-select class="translate-config-page--form-item" v-model:value="formValue.lang" />
        </n-form-item>

        <n-form-item :label="$t('common.fontColor')" path="fontColor">
          <n-color-picker v-model:value="formValue.fontColor" class="translate-config-page--form-item-color" size="small" />
        </n-form-item>

        <n-form-item :label="$t('common.fontSize')" path="fontSize">
          <div class="translate-config-page--form-item">
            <n-input-group>
              <n-input-number v-model:value="formValue.fontSize" style="width: 100%" :min="fontSizeMin" :max="fontSizeMax" :show-button="false" />

              <n-dropdown :options="fontSizeOptions" @select="handleFontSizeSelect" trigger="click">
                <n-button type="default">
                  <template #icon>
                    <n-icon size="20">
                      <ChevronDown />
                    </n-icon>
                  </template>
                </n-button>
              </n-dropdown>
            </n-input-group>
          </div>
        </n-form-item>

        <div class="section-title">{{ $t('options.translateMode') }}</div>

        <n-form-item :label="$t('common.receiveTranslate')" path="receiveTranslate">
          <n-switch v-model:value="formValue.receiveTranslate" />
        </n-form-item>

        <!-- 发送翻译 -->
        <n-form-item :label="$t('common.sendTranslateMode.title')" path="sendTranslateMode">
          <n-radio-group v-model:value="formValue.sendTranslateMode">
            <n-radio :value="SEND_TRANSLATE_MODE_ENUM.AUTO">{{ $t('common.sendTranslateMode.auto') }}</n-radio>
            <n-radio :value="SEND_TRANSLATE_MODE_ENUM.MANUAL">{{ $t('common.sendTranslateMode.manual') }}</n-radio>
          </n-radio-group>
        </n-form-item>

        <n-form-item v-if="!isAutoTranslate" path="shortcutKey">
          <template #label>
            <div class="shortcut-label-wrapper">
              <span>{{ $t('options.shortcutKey') }}</span>
              <n-tooltip placement="top">
                <template #trigger>
                  <n-icon size="16" class="shortcut-info-icon">
                    <InformationFilled />
                  </n-icon>
                </template>
                {{ $t('options.shortcutKeyTip') }}
              </n-tooltip>
            </div>
          </template>
          <n-select v-model:value="formValue.shortcutKey" class="translate-config-page--form-item" :options="shortcutKeyOptions" />
        </n-form-item>

        <!-- 翻译不关注者 -->
        <n-form-item :label="$t('options.proxyError')" path="proxyError">
          <n-switch v-model:value="formValue.proxyError" />
        </n-form-item>

        <template v-if="false">
          <div class="section-title">配置管理</div>

          <n-form-item label="导出配置" path="exportConfig">
            <n-button type="primary" size="small" @click="handleExport"> 开始导出 </n-button>
          </n-form-item>
          <n-form-item label="导入配置" path="importConfig">
            <file-upload v-model:value="formValue.importConfig" allowedTypes=".json" @update:modelValue="handleImportConfig" />
          </n-form-item>
        </template>
      </n-form>

      <!-- 保存按钮 -->
      <div class="form-actions">
        <n-button class="form-actions--button" type="primary" size="large" @click="handleSave">
          {{ $t('common.saveSettings') }}
        </n-button>
        <n-button class="form-actions--button" size="large" @click="handleReset">
          {{ $t('common.reset') }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSetting } from '@/hooks/useSetting';
import LangSelect from '@/components/langSelect';
import { SEND_TRANSLATE_MODE_ENUM, exportConfig } from '@/shared';
import { ChevronDown, InformationFilled } from '@vicons/carbon';
import { useI18n } from 'vue-i18n';
import FileUpload from '@/components/fileUpload';

const { t } = useI18n();
const message = useMessage();
const formRef = ref(null);

// 从hooks初始化表单数据
const initFormData = () => {
  formValue.historyLang = historyLang.value;
  formValue.lang = lang.value;
  formValue.fontColor = fontColor.value;
  formValue.fontSize = parseInt(fontSize.value);
  formValue.receiveTranslate = receiveTranslate.value;
  formValue.sendTranslateMode = sendTranslateMode.value;
  formValue.proxyError = proxyError.value;
  formValue.shortcutKey = shortcutKey.value;
};
// 使用setting hooks（传入初始化完成回调）
const {
  // 响应式数据
  fontColor,
  fontSize,
  historyLang,
  lang,
  shortcutKey,
  fontSizeMin,
  fontSizeMax,
  receiveTranslate,
  sendTranslateMode,
  proxyError,
  fontSizeOptions,
  shortcutKeyOptions
} = useSetting({
  onReady: initFormData
});

// 表单数据（独立管理，不与hooks实时同步）
const formValue = reactive({
  historyLang: null,
  lang: null,
  fontColor: null,
  fontSize: null,
  receiveTranslate: null,
  sendTranslateMode: null,
  proxyError: null,
  shortcutKey: null,
  importConfig: null
});

const isAutoTranslate = computed(() => {
  return formValue.sendTranslateMode === SEND_TRANSLATE_MODE_ENUM.AUTO;
});

// 处理字体大小选择
const handleFontSizeSelect = (key) => {
  formValue.fontSize = key;
};

// 保存设置 - 将表单数据同步到hooks
const handleSave = () => {
  historyLang.value = formValue.historyLang;
  lang.value = formValue.lang;
  fontColor.value = formValue.fontColor;
  fontSize.value = formValue.fontSize + 'px';
  receiveTranslate.value = formValue.receiveTranslate;
  sendTranslateMode.value = formValue.sendTranslateMode;
  proxyError.value = formValue.proxyError;
  shortcutKey.value = formValue.shortcutKey;
  message.success(t('common.settingsSaved'));
};

const handleExport = () => {
  exportConfig(formValue);
};

const handleImportConfig = (payload) => {
  if (!payload) return;
  // 兼容 file-upload 组件的多种返回格式
  const realFile = payload?.file || payload?.[0] || payload;
  if (!(realFile instanceof File)) {
    message.error('请选择正确的配置文件');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const configData = JSON.parse(e.target.result);
      const validKeys = Object.keys(toRaw(formValue));
      console.log(validKeys);
      const hasValidConfig = validKeys.some((key) => configData.hasOwnProperty(key));
      if (!hasValidConfig) {
        message.error('配置文件格式不正确，请选择有效的配置文件');
        return;
      }
      Object.keys(configData).forEach((key) => {
        if (formValue.hasOwnProperty(key)) {
          formValue[key] = configData[key];
        }
      });
      message.success('配置导入成功');
    } catch (error) {
      console.error('解析配置文件失败:', error);
      message.error('配置文件格式错误，请选择有效的JSON文件');
    }
  };
  reader.readAsText(realFile);
};

// 重置表单 - 恢复到hooks当前值或默认值
const handleReset = () => {
  initFormData();
  message.info(t('common.formReset'));
};
</script>

<style lang="scss" scoped>
$prefix: 'translate-config-page';
.#{$prefix} {
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}
.#{$prefix}--form-item {
  width: 300px;
}
.#{$prefix}--form-item-color {
  width: 80px;
}

/* 快捷键标签样式 */
.shortcut-label-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.shortcut-info-icon {
  color: #999;
  cursor: help;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.shortcut-info-icon:hover {
  opacity: 1;
  color: #666;
}

.#{$prefix}--form-item-info {
  position: absolute;
}

.page-header {
  padding: 24px 32px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 32px;
  flex-shrink: 0;
}

.page-header h1 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.content-wrapper {
  padding: 0 32px 32px;
  max-width: 800px;
  flex: 1;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 32px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.form-actions {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

:deep(.n-form-item-label) {
  color: #595959;
  font-weight: 500;
  text-align: left;
  justify-content: flex-start;
}

:deep(.n-form-item-blank) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

:deep(.n-input) {
  border-radius: 6px;
}

:deep(.n-button) {
  border-radius: 6px;
}

:deep(.n-color-picker-trigger__value) {
  display: none;
}

:deep(.n-radio-button) {
  border-radius: 6px;
}
.form-actions--button:not(:first-child) {
  margin-left: 12px;
}
</style>
