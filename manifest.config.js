import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';
const { version } = packageJson;

const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/);

const getArrowUrl = (url) => `${url}*`;

export default function generateManifest(viteEnv) {
  return defineManifest(async (env) => ({
    manifest_version: 3,
    name: viteEnv.VITE_APP_PACKAGE_NAME,
    description: viteEnv.VITE_APP_DESCRIPTION,
    version: `${major}.${minor}.${patch}.${label}`,
    version_name: version,
    icons: {
      16: 'src/assets/images/icon-16.png',
      32: 'src/assets/images/icon-32.png',
      48: 'src/assets/images/icon-48.png',
      128: 'src/assets/images/icon-128.png'
    },
    action: {
      default_popup: 'index.html',
      default_icon: {
        16: 'src/assets/images/icon-16.png',
        32: 'src/assets/images/icon-32.png',
        48: 'src/assets/images/icon-48.png',
        128: 'src/assets/images/icon-128.png'
      }
    },
    content_scripts: [
      {
        js: ['src/content/content.js'],
        matches: [getArrowUrl(viteEnv.VITE_APP_PROXY_URL)],
        type: 'module'
      }
    ],
    background: {
      service_worker: 'src/popup/server.js'
    },
    permissions: ['tabs', 'storage', 'scripting'],
    host_permissions: [getArrowUrl(viteEnv.VITE_APP_PROXY_URL)],
    web_accessible_resources: [
      {
        resources: ['icons/*.png'],
        matches: []
      }
    ],
    options_page: 'options.html'
  }));
}
