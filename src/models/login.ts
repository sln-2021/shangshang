import { Effect } from 'dva';
import { stringify } from 'querystring';
import { history as router } from 'umi';
import { reloadAuthorized } from '@/utils/Authorized';
import { userLogin, logout } from '@/services/login';
import { saveTokenInfo, clearTokenInfo, getUserType } from '../utils/tokenStorage';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 200 | 401;
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin' | 'root';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {};
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { put }) {
      const resp = yield userLogin(payload);
      if (!resp) return;
      if (resp.status === '200') {
        yield put({ type: 'gotStatus', payload: 200 });
        saveTokenInfo(resp.data); // 保存到 localStorage 中以便访问 API 时取出使用
        reloadAuthorized();
        // 根据登录者信息 跳转不同路由
        routerTo();
      } else {
        yield put({ type: 'gotStatus', payload: 401 });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    /** 用户点击 "退出登录" 按钮主动退出 ( 会尝试发送 HTTP 请求清除 seesion ) */
    *logout() {
      clearTokenInfo(); // 清除 localStorage 中的 token 信息
      reloadAuthorized();
      yield logout();
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    gotStatus(state, { payload }) {
      return { ...state, status: payload };
    },
  },
};

export default Model;

/**
 * @param { string } root : 超级管理员
 * @param { string } superAdmin：超级主办方管理员
 * @param { string } admin：主办方管理员
 * @param { string } playeradmin：运营管理员
 * @param { string } superOrganizers：超级渠道管理员
 * @param { string } organizers：渠道管理员
 * @param { string } superClub：超级协办方管理员
 * @param { string } club：协办方管理员
 * @param { string } UNAUTHCONFERENCEUSER：未认证渠道管理员
 * @param { string } UNAUTHCONFERENCEUSERSUBMIT：未认证渠道管理员(已提交数据)
 * @param { string } UNAUTHCLUBUSER：未认证协办方管理员
 * @param { string } UNAUTHCLUBUSERSUBMIT：未认证协办方管理员(已提交数据)
 */

function routerTo() {
  const userType = getUserType();
  console.log(userType);
  if (userType === 'root') router.push('/sponsor-manager/list');
  if (userType === 'superAdmin') router.push('/');
  if (userType === 'admin') router.push('/');
  if (userType === 'playeradmin') router.push('/player');
  if (userType === 'superOrganizers') router.push('/');
  if (userType === 'organizers') router.push('/');
  if (userType === 'superClub') router.push('/');
  if (userType === 'club') router.push('/');
  if (userType === 'UNAUTHCONFERENCEUSER') router.push('/unverified-organizer');
  if (userType === 'UNAUTHCONFERENCEUSERSUBMIT') router.push('/unverified-organizer');
  if (userType === 'UNAUTHCLUBUSER') router.push('/unverified-club');
  if (userType === 'UNAUTHCLUBUSERSUBMIT') router.push('/unverified-club');
  // else router.push('/user/login')
}
