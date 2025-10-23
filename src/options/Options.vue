<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
    <n-message-provider>
      <div class="app-container">
        <n-layout>
          <!-- 顶部导航栏 -->
          <n-layout-header class="navbar">
            <div class="navbar-content">
              <div class="logo-section">
                <img :src="logoUrl" alt="logo" class="logo-icon" />
                <span class="logo-text">{{ title }}</span>
              </div>
            </div>
          </n-layout-header>

          <!-- 主体内容区 -->
          <n-layout has-sider class="main-content">
            <!-- 左侧侧边栏 -->
            <n-layout-sider bordered :width="240" :show-trigger="false" class="sidebar">
              <n-menu v-model:value="activeKey" :options="menuOptions" @update:value="handleMenuSelect" />
            </n-layout-sider>

            <!-- 右侧内容区 -->
            <n-layout>
              <n-layout-content class="content-area">
                <router-view />
              </n-layout-content>
            </n-layout>
          </n-layout>
        </n-layout>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { Translate } from '@vicons/carbon';
import { useThemeOverrides } from '@/hooks/useThemeOverrides';
import { useI18n } from 'vue-i18n';
import { useNativeLocal } from '@/hooks/useNativeLocal';

const { t } = useI18n();

const router = useRouter();

// 获取环境变量中的Logo URL
const logoUrl = import.meta.env.VITE_APP_LOGO_URL;
const title = import.meta.env.VITE_APP_NAME;

// 使用主题配置 hook
const { themeOverrides } = useThemeOverrides();

const { locale, dateLocale } = useNativeLocal();

const activeKey = ref('translate-config');

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// 菜单选项
const menuOptions = [
  {
    label: t('options.translateConfig'),
    key: 'translate-config',
    icon: renderIcon(Translate)
  }
];

// 处理菜单选择
const handleMenuSelect = (key) => {
  activeKey.value = key;
  router.push(`/${key}`);
};
</script>

<style lang="scss" scoped>
$prefix: 'app-container';
$sidebar-prefix: 'sidebar';

.#{$prefix} {
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部导航栏 */
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0;

  &-content {
    width: 100%;
    padding: 0 24px;
  }
}

.logo {
  &-section {
    display: flex;
    align-items: center;
  }

  &-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  &-text {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
  }
}

/* 主体内容区 */
.main-content {
  height: calc(100vh - 64px);
}

.#{$sidebar-prefix} {
  background-color: #fff;
  height: 100%;
}

.content-area {
  padding: 0;
  background-color: #ffffff;
  height: 100%;
}

/* 深度选择器样式 */
:deep(.n-layout-header) {
  height: 64px !important;
  flex-shrink: 0;
}

:deep(.n-layout-sider) {
  height: 100% !important;
}

:deep(.n-layout-sider-scroll-container) {
  padding: 20px;
}
:deep(.n-menu .n-menu-item-content.n-menu-item-content--selected::before) {
  background: linear-gradient(68deg, #2584f6 4%, #72faff 100%);
}

:deep(.n-layout-content) {
  height: 100%;
  overflow-y: auto;
}
</style>
