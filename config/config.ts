import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings;

/**详情注释请参考根目录下 备注.md* */

// const roleOrganizersLoginable = ['superOrganizers', 'organizers'];
// const roleClubLoginable = [superClub, club];
// const roleUnclubLoginable = [UNAUTHCLUBUSER, UNAUTHCLUBUSERSUBMIT];
// const roleUnorganizersLoginable = [UNAUTHCONFERENCEUSER, UNAUTHCONFERENCEUSERSUBMIT];

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
                enable: false,
                // default zh-CN
                default: 'zh-CN',
                // default true, when it is true, will use `navigator.language` overwrite default
                baseNavigator: true,
            },
            dynamicImport: {
                loadingComponent: './components/PageLoading/index',
                webpackChunkName: true,
                level: 3,
            },
            pwa: pwa
                ? {
                    workboxPluginMode: 'InjectManifest',
                    workboxOptions: {
                        importWorkboxFrom: 'local',
                    },
                }
                : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
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
];

if (isAntDesignProPreview) {
    // 针对 preview.pro.ant.design 的 GA 统计代码
    plugins.push([
        'umi-plugin-ga',
        {
            code: 'UA-72788897-6',
        },
    ]);
    plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
    plugins,
    hash: true,
    targets: {
        ie: 11,
    },
    // umi routes: https://umijs.org/zh/guide/router.html

    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
        // ...darkTheme,
    },
    define: {
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '',
        // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
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
    // chainWebpack: webpackPlugin,
    proxy: {
        '/api': {
            // target: 'http://xiaocheng.nat300.top/api',/*本地调试用(1) */
            target: 'http://101.200.140.230:8099/api/', /*本地调试用(一般用这个) */
            // target: 'http://106.75.51.104:9190/api/', /*测试服 (其他地方也可以使用这个地址) */
            // target: 'http://117.50.100.128:9190/api/',  /* 提审服 (几乎用不到)*/
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
} as IConfig;
