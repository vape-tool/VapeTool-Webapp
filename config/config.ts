// https://umijs.org/config/
import { defineConfig } from 'umi';
import routes from './routes';
import defaultSettings from './defaultSettings';

export default defineConfig({
  hash: true,
  base: '/',
  publicPath: '/',
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Vape Tool',
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  exportStatic: {},
  proxy: {
    '/api/': {
      target: 'http://localhost:8001',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': '',
      // },
    },
  },
});
