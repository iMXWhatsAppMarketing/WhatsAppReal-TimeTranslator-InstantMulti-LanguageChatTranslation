import { createRouter, createMemoryHistory } from 'vue-router';

// 导入路由组件
import TranslateConfig from '@/options/views/TranslateConfig.vue';

import i18n from '@/langs';

// 定义路由
const routes = [
  { path: '/', redirect: '/translate-config' },
  { path: '/translate-config', component: TranslateConfig, name: 'TranslateConfig', meta: { title: 'TranslateConfig' } }
];

// 创建路由器实例
const router = createRouter({
  history: createMemoryHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${i18n.global.t(`route.${to.meta.title}`)}`;
  }
  next();
});

export default router;
