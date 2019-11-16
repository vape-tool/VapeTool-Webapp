import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'en-US',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/login',
          component: '../layouts/SignupLayout',
          routes: [
            {
              name: 'login',
              path: '/login',
              component: './login',
            },
            {
              name: 'successLogin',
              path: '/login/success',
              component: './login/success',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout',
          routes: [
            {
              path: '/',
              component: '../layouts/BasicLayout',
              authority: ['admin', 'user'],
              routes: [
                {
                  hideInMenu: true,
                  name: 'payment',
                  path: '/payment',
                  component: './payment/Payment',
                },
                {
                  hideInMenu: true,
                  name: 'paymentSuccess',
                  path: '/payment/success',
                  component: './payment/Success',
                },
                {
                  hideInMenu: true,
                  name: 'paymentCancel',
                  path: '/payment/cancel',
                  component: './payment/Cancel',
                },
                {
                  hideInMenu: true,
                  name: 'uploadPhoto',
                  path: '/cloud/upload-photo',
                  component: './cloud/UploadPhoto',
                },
                {
                  hideInMenu: true,
                  name: 'userWizard',
                  path: '/user/wizard',
                  component: './user/wizard',
                },
                {
                  path: '/',
                  name: 'welcome',
                  icon: 'smile',
                  component: './Welcome',
                },
                {
                  path: '/cloud',
                  name: 'cloud',
                  icon: 'cloud',
                  component: './cloud/Cloud',
                },
                {
                  path: '/coil-calculator',
                  name: 'coil-calculator',
                  icon: 'https://web.vapetool.app/img/menu_icons/menu_coil_calculator.svg',
                  component: './coil/CoilCalculator',
                },
                {
                  path: '/liquid-blender',
                  name: 'liquid-blender',
                  icon: 'https://web.vapetool.app/img/menu_icons/menu_liquid_blender.svg',
                  component: './liquid/LiquidBlender',
                },
                {
                  path: '/ohm-law',
                  name: 'ohm-law',
                  icon: 'https://web.vapetool.app/img/menu_icons/menu_ohm_law.svg',
                  component: './ohm/OhmLaw',
                },
                {
                  path: '/batteries',
                  name: 'batteries',
                  icon: 'https://web.vapetool.app/img/menu_icons/menu_batteries.svg',
                  component: './batteries/Batteries',
                },
                // {
                //   path: '/converters',
                //   name: 'converters',
                //   icon: 'https://web.vapetool.app/img/menu_icons/menu_converters.svg',
                //   component: './converters/Converters',
                // },
                // {
                //   path: '/battery-life',
                //   name: 'battery-life',
                //   icon: 'https://web.vapetool.app/img/menu_icons/menu_battery_life.svg',
                //   component: './batterylife/BatteryLife',
                // },
                // {
                //   path: '/knowledge',
                //   name: 'knowledge',
                //   icon: 'https://web.vapetool.app/img/menu_icons/menu_knowledge_zone.svg',
                //   component: './knowledge/Knowledge',
                // },
                {
                  name: 'center',
                  icon: 'user',
                  path: '/user/center',
                  component: './user/center',
                },
                {
                  component: './404',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // theme: darkTheme,
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'https://web.vapetool.app/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  copy: [
    {
      from: 'img',
      to: 'img',
    },
  ],
} as IConfig;
