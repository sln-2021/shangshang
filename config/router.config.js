
/**
 * root   :    root
 * 赛区     :    superAdmin / admin
 * 渠道     :    superOrganizers /  organizers
 */

const roleGuest = 'guest';
const root = 'root';
const superAdmin = 'superAdmin';
const admin = 'admin';
const superOrganizers = 'superOrganizers';
const organizers = 'organizers';
const superClub = 'superClub';
const club = 'club';
const UNAUTHCONFERENCEUSER = 'UNAUTHCONFERENCEUSER';
const UNAUTHCONFERENCEUSERSUBMIT = 'UNAUTHCONFERENCEUSERSUBMIT';
const UNAUTHCLUBUSER = 'UNAUTHCLUBUSER';
const UNAUTHCLUBUSERSUBMIT = 'UNAUTHCLUBUSERSUBMIT';

const roleAllLoginable = [root, superAdmin, admin, superOrganizers, organizers, superClub,
  club, UNAUTHCONFERENCEUSER, UNAUTHCONFERENCEUSERSUBMIT, UNAUTHCLUBUSER, UNAUTHCLUBUSERSUBMIT];

const roleAuthenticatedinable = [root, superAdmin, admin, superOrganizers, organizers];
const roleAdminLoginable = ['superAdmin', 'admin'];

export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: '登录',
            path: '/user/login',
            component: './user/login',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        // 新增 未知
        Routes: ['src/pages/Authorized'],
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'root', 'superOrganizers'],
            routes: [
              {
                path: '/',
                redirect: '/match/index',
                authority: [...roleAuthenticatedinable],
              },
              {
                path: '/dashboard',
                name: '首页',
                hideInMenu: true,
                icon: 'dashboard',

                component: './dashboard/analysis',
                authority: [...roleAuthenticatedinable],
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
                    component: './sponsor',
                  },
                  {
                    path: '/sponsor-manager/new-sponsor',
                    name: '添加主办方',
                    component: './sponsor/addSponsor',
                  },
                ],
              },
              {
                path: '/match',
                name: '赛事管理',
                icon: 'trophy',
                authority: [...roleAuthenticatedinable],
                routes: [
                  {
                    path: '/match/index',
                    name: '赛事列表',
                    component: './match/index',
                  },
                  {
                    path: '/match/newMatch',
                    name: '创建赛事',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: './match/newMatch/index',
                  },
                  {
                    path: '/match/brand',
                    name: '冠名品牌',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: './brand',
                  },
                  {
                    path: '/match/ddz-info',
                    name: '斗地主比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: './match/updateMatch/infoMatchDDZ',
                    hideInMenu: true,
                  },
                  {
                    path: '/match/ddz-gms-info',
                    name: '斗地主冠名赛比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: './match/updateMatch/infoMatchDDZGMS',
                    hideInMenu: true,
                  },
                  {
                    path: '/match/tdh-info',
                    name: '推倒胡比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: './match/updateMatch/infoMatchTDH',
                    hideInMenu: true,
                  },
                  {
                    path: '/match/tdh-gms-info',
                    name: '推倒胡冠名赛比赛详情',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: './match/updateMatch/infoMatchTDHGMS',
                    hideInMenu: true,
                  },
                  {
                    path: '/match/award',
                    name: '发奖记录',
                    authority: ['root', 'superAdmin', 'admin'],
                    component: './match/award',
                    hideInMenu: true,
                  },
                ],
              },
              {
                path: '/organizer-manager',
                name: '渠道管理',
                icon: 'apartment',
                authority: ['admin', 'user', ...roleAdminLoginable],
                routes: [
                  {
                    path: '/organizer-manager',
                    redirect: '/organizer-manager/list',
                  },
                  {
                    path: '/organizer-manager/list',
                    name: '渠道列表',
                    component: './organizer/organizerList',
                  },
                  {
                    path: '/organizer-manager/detail/:id',
                    name: '渠道详情',
                    hideInMenu: true,
                    component: './organizer/organizerDetail',
                  },
                  {
                    path: '/organizer-manager/unverifiedList',
                    name: '待认证列表',
                    component: './organizer/unverifiedList',
                  },
                  {
                    path: '/organizer-manager/subordinate',
                    name: '下级列表',
                    component: './organizer/subordinate',
                  },
                ],
              },
              {
                path: '/unverified-organizer',
                name: '身份认证',
                icon: 'crown',
                component: './user/unverifiedOrganizer',
                authority: ['UNAUTHCONFERENCEUSER', 'UNAUTHCONFERENCEUSERSUBMIT'],
              },
              // {
              //   path: '/club-manager',
              //   name: '协办方管理',
              //   icon: 'trophy',
              //   authority: ['admin', 'user', ...roleOrganizersLoginable],
              //   routes: [
              //     {
              //       path: '/club-manager',
              //       redirect: '/club-manager/list',
              //     },
              //     {
              //       path: '/club-manager/list',
              //       name: '协办方列表',
              //       component: './club/clubList',
              //     },
              //     {
              //       path: '/club-manager/detail/:id',
              //       name: '协办方详情',
              //       hideInMenu: true,
              //       component: './club/clubDetail',
              //     },
              //     {
              //       path: '/club-manager/unverifiedList',
              //       name: '待认证列表',
              //       component: './club/unverifiedList',
              //     },
              //   ],
              // },
              {
                path: '/unverified-club',
                name: '身份认证',
                icon: 'crown',
                component: './user/unverifiedClub',
                authority: ['UNAUTHCLUBUSER', 'UNAUTHCLUBUSERSUBMIT'],
              },
              {
                path: '/bonus',
                name: '兑换券池管理',
                icon: 'smile',
                hideInMenu: true,
                authority: [...roleAuthenticatedinable],
                routes: [
                  {
                    path: '/bonus/list',
                    name: '审核兑换券池',
                    component: './bonus/index',
                  },
                  {
                    path: '/bonus/bill',
                    name: '兑换券池流水',
                    component: './bonus/bill',
                    authority: roleAuthenticatedinable,
                  },
                  // 兑换券池详情
                  {
                    path: '/bonus/detail/:id',
                    component: './bonus/detail',
                  },
                ],
              },
              {
                path: '/player',
                name: '玩家管理',
                icon: 'alert',
                authority: [...roleAuthenticatedinable,'playeradmin'],
                routes: [
                  {
                    path: '/player',
                    redirect: '/player/index',
                  },
                  {
                    path: '/player/index',
                    name: '玩家管理',
                    component: './player/index',
                  },
                  {
                    path: '/player/relation',
                    name: '玩家推广信息查询',
                    component: './player/Relation',
                    authority: ['admin', 'superAdmin', 'superOrganizers','playeradmin'],
                  },
                  {
                    hideInMenu: true,
                    path: '/player/invite/:id',
                    name: '邀请人数',
                    component: './player/invite',
                  },
                  {
                    hideInMenu: true,
                    path: '/player/record/:id',
                    name: '充值记录',
                    component: './player/record',
                  },
                ],
              },
              {
                path: '/finance',
                name: '财务管理',
                icon: 'alert',
                authority: roleAuthenticatedinable,
                routes: [
                  {
                    path: '/finance',
                    redirect: '/finance/gold',
                  },
                  {
                    path: '/finance/gold',
                    name: '平台金币产出',
                    component: './finance/gold',
                  },
                  {
                    path: '/finance/roomcard',
                    name: '平台钻石产出',
                    component: './finance/roomcard',
                  },
                  {
                    path: '/finance/ticket',
                    name: '平台奖券产出',
                    component: './finance/ticket',
                  }
                ],
              },
              {
                path: '/pay-rank',
                name: '充值管理',
                icon: 'alert',
                authority: roleAuthenticatedinable,
                routes: [
                  {
                    path: '/pay-rank',
                    redirect: '/payRank/index',
                  },
                  {
                    path: '/pay-rank/index',
                    name: '充值记录',
                    component: './payRank/index',
                  },
                  {
                    path: '/pay-rank/chart',
                    name: '图表统计',
                    component: './payRank/chart',
                  },
                ],
              },
              {
                path: '/admin',
                name: '用户管理',
                icon: 'team',
                component: './admin',
                authority: ['admin', 'superAdmin', 'superOrganizers', 'superClub'],
              },
              {
                path: '/notice',
                name: '公告管理',
                icon: 'sound',
                component: './notice/index',
                authority: ['root', 'admin', 'superAdmin'],
              },
              {
                path: '/redeem-code',
                name: '兑换码管理',
                icon: 'code',
                component: './redeemCode',
                authority: ['root', 'admin', 'superAdmin'],
              },
              {
                path: '/setting',
                name: '平台设定',
                icon: 'setting',
                component: './setting/index',
                authority: ['root', 'admin', 'superAdmin'],
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
                  },
                  {
                    path: '/propsMail-manager/index',
                    name: '道具邮件',
                    component: './propsMail/index',
                  },

                  {
                    hideInMenu: true,
                    path: '/propsMail-manager/detail/:id',
                    name: '发奖状态',
                    component: './propsMail/mailDetail',
                  },
                ],
              },

              {
                path: '/reward-manager',
                name: '奖励管理',
                icon: 'compass',
                authority: ['root', 'admin', 'superAdmin'],
                component: './reward/index',
              },
              {
                path: '/advertising-manager',
                name: '广告管理',
                icon: 'compass',
                authority: ['root', 'admin', 'superAdmin'],
                component: './advertising/index',
              },
              {
                path: '/activity-manager',
                name: '活动管理',
                icon: 'funnel-plot',
                authority: ['root', 'admin', 'superAdmin'],
                component: './activity/index',
              },
              {
                path: '/personal',
                name: '个人中心',
                icon: 'user',
                component: './user/personal',
                authority: roleAllLoginable,
              },
              {
                path: '/shop',
                name: '商城',
                icon: 'shopping-cart',
                component: './cart/index',
                authority: ['root', 'admin', 'superAdmin'],
              },
              {
                path: '/online',
                name: '在线人数',
                icon: 'solution',
                component: './online/index',
                authority: ['root', 'admin', 'superAdmin'],
              },
              {
                component: '404',
              },
            ],
          },
        ],
      },
    ],
  },
];
