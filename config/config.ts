import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import routes from './routes';
import { defineConfig } from 'umi';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default false
    // default zh-CN
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: './components/PageLoading/index',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
  },

  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
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
