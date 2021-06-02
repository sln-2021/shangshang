import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'E:/sln/shangshang/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux, dynamic as _dvaDynamic } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BlankLayout" */ '../../layouts/BlankLayout'),
          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BlankLayout').default,
    routes: [
      {
        path: '/user',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
              LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/UserLayout').default,
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
            exact: true,
          },
          {
            name: '登录',
            path: '/user/login',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__user__login" */ '../user/login'),
                  LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                    .default,
                })
              : require('../user/login').default,
            exact: true,
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                  LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                    .default,
                })
              : require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__SecurityLayout" */ '../../layouts/SecurityLayout'),
              LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/SecurityLayout').default,
        Routes: [require('../Authorized').default],
        routes: [
          {
            path: '/',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
                  LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                    .default,
                })
              : require('../../layouts/BasicLayout').default,
            authority: ['admin', 'root', 'superOrganizers'],
            routes: [
              {
                path: '/',
                redirect: '/match/index',
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                ],
                exact: true,
              },
              {
                path: '/dashboard',
                name: '首页',
                hideInMenu: true,
                icon: 'dashboard',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__dashboard__analysis__model.tsx' */ 'E:/sln/shangshang/src/pages/dashboard/analysis/model.tsx').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../dashboard/analysis'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../dashboard/analysis').default,
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                ],
                exact: true,
              },
              {
                path: '/sponsor-manager',
                name: '主办方管理',
                icon: 'cluster',
                authority: ['root'],
                routes: [
                  {
                    path: '/sponsor-manager/list',
                    name: '主办方列表',
                    authority: ['root'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../sponsor'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../sponsor').default,
                    exact: true,
                  },
                  {
                    path: '/sponsor-manager/new-sponsor',
                    name: '添加主办方',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../sponsor/addSponsor'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../sponsor/addSponsor').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/match',
                name: '赛事管理',
                icon: 'trophy',
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                ],
                routes: [
                  {
                    path: '/match/index',
                    name: '赛事列表',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../match/index'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../match/index').default,
                    exact: true,
                  },
                  {
                    path: '/match/newMatch',
                    name: '创建赛事',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../match/newMatch/index'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../match/newMatch/index').default,
                    exact: true,
                  },
                  {
                    path: '/match/brand',
                    name: '冠名品牌',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../brand'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../brand').default,
                    exact: true,
                  },
                  {
                    path: '/match/ddz-info',
                    name: '斗地主比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../match/updateMatch/infoMatchDDZ'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../match/updateMatch/infoMatchDDZ').default,
                    hideInMenu: true,
                    exact: true,
                  },
                  {
                    path: '/match/ddz-gms-info',
                    name: '斗地主冠名赛比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../match/updateMatch/infoMatchDDZGMS'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../match/updateMatch/infoMatchDDZGMS').default,
                    hideInMenu: true,
                    exact: true,
                  },
                  {
                    path: '/match/tdh-info',
                    name: '推倒胡比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../match/updateMatch/infoMatchTDH'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../match/updateMatch/infoMatchTDH').default,
                    hideInMenu: true,
                    exact: true,
                  },
                  {
                    path: '/match/tdh-gms-info',
                    name: '推倒胡冠名赛比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../match/updateMatch/infoMatchTDHGMS'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../match/updateMatch/infoMatchTDHGMS').default,
                    hideInMenu: true,
                    exact: true,
                  },
                  {
                    path: '/match/award',
                    name: '发奖记录',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../match/award'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../match/award').default,
                    hideInMenu: true,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/organizer-manager',
                name: '渠道管理',
                icon: 'apartment',
                authority: ['admin', 'user', 'superAdmin', 'admin'],
                routes: [
                  {
                    path: '/organizer-manager',
                    redirect: '/organizer-manager/list',
                    exact: true,
                  },
                  {
                    path: '/organizer-manager/list',
                    name: '渠道列表',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../organizer/organizerList'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../organizer/organizerList').default,
                    exact: true,
                  },
                  {
                    path: '/organizer-manager/detail/:id',
                    name: '渠道详情',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../organizer/organizerDetail'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../organizer/organizerDetail').default,
                    exact: true,
                  },
                  {
                    path: '/organizer-manager/unverifiedList',
                    name: '待认证列表',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../organizer/unverifiedList'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../organizer/unverifiedList').default,
                    exact: true,
                  },
                  {
                    path: '/organizer-manager/subordinate',
                    name: '下级列表',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../organizer/subordinate'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../organizer/subordinate').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/unverified-organizer',
                name: '身份认证',
                icon: 'crown',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../user/unverifiedOrganizer'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../user/unverifiedOrganizer').default,
                authority: [
                  'UNAUTHCONFERENCEUSER',
                  'UNAUTHCONFERENCEUSERSUBMIT',
                ],
                exact: true,
              },
              {
                path: '/unverified-club',
                name: '身份认证',
                icon: 'crown',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../user/unverifiedClub'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../user/unverifiedClub').default,
                authority: ['UNAUTHCLUBUSER', 'UNAUTHCLUBUSERSUBMIT'],
                exact: true,
              },
              {
                path: '/bonus',
                name: '兑换券池管理',
                icon: 'smile',
                hideInMenu: true,
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                ],
                routes: [
                  {
                    path: '/bonus/list',
                    name: '审核兑换券池',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../bonus/index'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../bonus/index').default,
                    exact: true,
                  },
                  {
                    path: '/bonus/bill',
                    name: '兑换券池流水',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../bonus/bill'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../bonus/bill').default,
                    authority: [
                      'root',
                      'superAdmin',
                      'admin',
                      'superOrganizers',
                      'organizers',
                    ],
                    exact: true,
                  },
                  {
                    path: '/bonus/detail/:id',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../bonus/detail'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../bonus/detail').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/player',
                name: '玩家管理',
                icon: 'alert',
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                  'playeradmin',
                ],
                routes: [
                  {
                    path: '/player',
                    redirect: '/player/index',
                    exact: true,
                  },
                  {
                    path: '/player/index',
                    name: '玩家管理',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../player/index'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../player/index').default,
                    exact: true,
                  },
                  {
                    path: '/player/relation',
                    name: '玩家推广信息查询',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../player/Relation'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../player/Relation').default,
                    authority: [
                      'admin',
                      'superAdmin',
                      'superOrganizers',
                      'playeradmin',
                    ],
                    exact: true,
                  },
                  {
                    hideInMenu: true,
                    path: '/player/invite/:id',
                    name: '邀请人数',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../player/invite'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../player/invite').default,
                    exact: true,
                  },
                  {
                    hideInMenu: true,
                    path: '/player/record/:id',
                    name: '充值记录',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../player/record'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../player/record').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/finance',
                name: '财务管理',
                icon: 'alert',
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                ],
                routes: [
                  {
                    path: '/finance',
                    redirect: '/finance/gold',
                    exact: true,
                  },
                  {
                    path: '/finance/gold',
                    name: '平台金币产出',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../finance/gold'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../finance/gold').default,
                    exact: true,
                  },
                  {
                    path: '/finance/roomcard',
                    name: '平台钻石产出',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../finance/roomcard'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../finance/roomcard').default,
                    exact: true,
                  },
                  {
                    path: '/finance/ticket',
                    name: '平台奖券产出',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../finance/ticket'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../finance/ticket').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/pay-rank',
                name: '充值管理',
                icon: 'alert',
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                ],
                routes: [
                  {
                    path: '/pay-rank',
                    redirect: '/payRank/index',
                    exact: true,
                  },
                  {
                    path: '/pay-rank/index',
                    name: '充值记录',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../payRank/index'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../payRank/index').default,
                    exact: true,
                  },
                  {
                    path: '/pay-rank/chart',
                    name: '图表统计',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../payRank/chart'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../payRank/chart').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/admin',
                name: '用户管理',
                icon: 'team',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../admin'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../admin').default,
                authority: [
                  'admin',
                  'superAdmin',
                  'superOrganizers',
                  'superClub',
                ],
                exact: true,
              },
              {
                path: '/notice',
                name: '公告管理',
                icon: 'sound',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../notice/index'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../notice/index').default,
                authority: ['root', 'admin', 'superAdmin'],
                exact: true,
              },
              {
                path: '/redeem-code',
                name: '兑换码管理',
                icon: 'code',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../redeemCode'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../redeemCode').default,
                authority: ['root', 'admin', 'superAdmin'],
                exact: true,
              },
              {
                path: '/setting',
                name: '平台设定',
                icon: 'setting',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../setting/index'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../setting/index').default,
                authority: ['root', 'admin', 'superAdmin'],
                exact: true,
              },
              {
                path: '/propsMail-manager',
                name: '道具邮件',
                icon: 'mail',
                authority: ['root', 'admin', 'superAdmin'],
                routes: [
                  {
                    path: '/propsMail-manager',
                    redirect: '/propsMail-manager/index',
                    exact: true,
                  },
                  {
                    path: '/propsMail-manager/index',
                    name: '道具邮件',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../propsMail/index'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../propsMail/index').default,
                    exact: true,
                  },
                  {
                    hideInMenu: true,
                    path: '/propsMail-manager/detail/:id',
                    name: '发奖状态',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../propsMail/mailDetail'),
                          LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../propsMail/mailDetail').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/reward-manager',
                name: '奖励管理',
                icon: 'compass',
                authority: ['root', 'admin', 'superAdmin'],
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../reward/index'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../reward/index').default,
                exact: true,
              },
              {
                path: '/advertising-manager',
                name: '广告管理',
                icon: 'compass',
                authority: ['root', 'admin', 'superAdmin'],
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../advertising/index'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../advertising/index').default,
                exact: true,
              },
              {
                path: '/activity-manager',
                name: '活动管理',
                icon: 'funnel-plot',
                authority: ['root', 'admin', 'superAdmin'],
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../activity/index'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../activity/index').default,
                exact: true,
              },
              {
                path: '/personal',
                name: '个人中心',
                icon: 'user',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../user/personal'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../user/personal').default,
                authority: [
                  'root',
                  'superAdmin',
                  'admin',
                  'superOrganizers',
                  'organizers',
                  'superClub',
                  'club',
                  'UNAUTHCONFERENCEUSER',
                  'UNAUTHCONFERENCEUSERSUBMIT',
                  'UNAUTHCLUBUSER',
                  'UNAUTHCLUBUSERSUBMIT',
                ],
                exact: true,
              },
              {
                path: '/shop',
                name: '商城',
                icon: 'shopping-cart',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../cart/index'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../cart/index').default,
                authority: ['root', 'admin', 'superAdmin'],
                exact: true,
              },
              {
                path: '/online',
                name: '在线人数',
                icon: 'solution',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../online/index'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../online/index').default,
                authority: ['root', 'admin', 'superAdmin'],
                exact: true,
              },
              {
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../404'),
                      LoadingComponent: require('E:/sln/shangshang/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../404').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: () =>
              React.createElement(
                require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: () =>
          React.createElement(
            require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('E:/sln/shangshang/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
