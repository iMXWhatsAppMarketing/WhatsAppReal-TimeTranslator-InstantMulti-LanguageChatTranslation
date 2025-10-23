import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import generateManifest from './manifest.config.js';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import ViteYaml from '@modyfi/vite-plugin-yaml';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      crx({ manifest: generateManifest(env) }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ],
        resolvers: [NaiveUiResolver()]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      }),
      ViteYaml()
    ],
    define: {
      // 确保环境变量可以在客户端代码中使用
      __APP_TITLE__: JSON.stringify(env.VITE_APP_NAME),
      __APP_LOGO_URL__: JSON.stringify(env.VITE_APP_LOGO_URL),
      __APP_SERVICE_URL__: JSON.stringify(env.VITE_APP_SERVICE_URL),
      _APP_PROXY_URL: JSON.stringify(env.VITE_APP_PROXY_URL)
    },
    server: {
      cors: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      },
      extensions: ['.vue', '.js', '.ts']
    },
    build: {
      rollupOptions: {
        input: {
          popup: 'index.html',
          options: 'options.html'
        }
      }
    }
  };
});
