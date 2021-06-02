import fs from 'fs';
import pageRoutes from './config/router.config';
import webpackPlugin from './config/plugin.config';
import defaultSettings from './config/defaultSettings';
import { defineConfig, utils } from 'umi';

const { winPath } = utils;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  publicPath: '/',
  dva: {
    skipModelValidate: true,
    hmr: true,
    immer: true,
    // 注：如需兼容 IE11，需配置 { immer: { enableES5: true }}。
  },
  locale: {
    default: 'zh-CN', // default zh-CN
    baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
    antd: false,
  },
  targets: {
    chrome: 79,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'layout-header-background': '#000',
    'menu-bg': '#000',
    'menu-dark-bg': '#000',
    'menu-dark-submenu-bg': '#151515',
  },
  /**
   * 部署（build）模式下无效，仅供开发环境下
   */
  proxy: {
    '/api': {
      // target: 'http://msl.api.songbaoqiang.cn:8000/api/', /* 肖城电脑 */
      // target: 'http://xiaocheng.nat300.top/api',
      target: 'http://101.200.140.230:8099/api/',
      // target: 'http://106.75.51.104:9190/api/',
      // target: 'http://117.50.100.128:9190/api/',  /* 提审服 */
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/c': {
      target: 'http://123.57.52.171:9140/c/',
      changeOrigin: true,
      pathRewrite: { '^/c': '' },
    },
    '/corsapi': {
      target: 'http://123.57.52.171:9140/c/',
      changeOrigin: true,
      pathRewrite: { '^/corsapi': '' },
    }
  },
  ignoreMomentLocale: true,
  inlineLimit: 1,
  // 暂时关闭
  pwa: false,
  lessLoader: {
    javascriptEnabled: true,
  },
  crossorigin: true,
  cssLoader: {
    localsConvention: 'camelCase',
    modules: {
      getLocalIdent: (context, _, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          // css的防冲突 以文件位置来索引
          if (match[1].includes('.css')) {
            const antdProPath = match[1].replace('.css', '');
            const arr = winPath(antdProPath)
              .split('/')
              .map((a) => a.replace(/([A-Z])/g, '-$1'))
              .map((a) => a.toLowerCase());
            return `${arr.join('-')}-${localName}`.replace(/--/g, '-');
          }
          // less的防冲突 以文件位置来索引
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a) => a.replace(/([A-Z])/g, '-$1'))
            .map((a) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },

  },
  manifest: {
    basePath: '/',
  },
  // 引入被 external 库的 scripts
  // 区分 development 和 production，使用不同的产物
  scripts: process.env.NODE_ENV === "development" ? [
    "https://cdn.jsdelivr.net/npm/react@16.14.0/umd/react.development.min.js",
    "https://cdn.jsdelivr.net/npm/react-dom@16.14.0/umd/react-dom.development.min.js",
    "https://cdn.jsdelivr.net/npm/react-dom@16.14.0/umd/react-dom-server.browser.development.js"
  ] : [
    "https://gw.alipayobjects.com/os/lib/react/16.14.0/umd/react.production.min.js",
    "https://gw.alipayobjects.com/os/lib/react-dom/16.14.0/umd/react-dom.production.min.js",
    "https://gw.alipayobjects.com/os/lib/react-dom/16.14.0/umd/react-dom-server.browser.production.min.js"
  ],
  chainWebpack: webpackPlugin,
  dynamicImport: {
    loading: "@/components/pageLoading"
  },
  antd: {},
  externals: {
    "react": "window.React",
    "react-dom": "window.ReactDOM",
  },
  // devtool: "eval",
  devtool: false,
  esbuild: {}
});
