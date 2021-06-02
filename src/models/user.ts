import { Effect } from 'dva';
import { Reducer } from 'redux';
import { saveTokenInfo, clearTokenInfo, getUserType } from '../utils/tokenStorage';
import { reloadAuthorized } from '@/utils/Authorized';
import { queryUserInfo, changeUserState, addUsers, addFinance, addPlayer, changeUserInfo, fetchAdminUsers, changeRestPassword, deleteUser, fetchSubordinate } from '@/services/user';


export interface UserInfo {
  avatar?: string;
  clubId: number;
  conferenceId: number;
  id: number;
  leagueId: number;
  password?: string;
  userStatus: number;
  userType: string;
  username: string;
  bz: string;
}

export interface Users {
  id: string;
  username: string;
  userStatus: -1 | 0 | 1;
  bz: string;
}


export interface UserModelState {
  userInfo?: UserInfo;
  adminUser?: Users;
  subordinate?: any
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchUserInfo: Effect;
    changeUserState: Effect;
    addUsers: Effect;
    addFinance: Effect;
    addPlayer: Effect;
    deleteUser: Effect;
    changeUserInfo: Effect;
    fetchAdminUsers: Effect;
    changeRestPassword: Effect;
    fetchSubordinate: Effect;
  };
  reducers: {
    gotUserInfo: Reducer<UserModelState>;
    gotAdminUsers: Reducer<UserModelState>;
    gotSubordinate: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    userInfo: {},
    adminUser: {},
    subordinate: {},
  },

  effects: {
    *fetchUserInfo({ payload }, { put }) {
      const resp = yield queryUserInfo();

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotUserInfo', payload: data });
      payload.onOk(data);
    },

    *changeUserState({ payload }) {
      const resp = yield changeUserState(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *addUsers({ payload }) {
      const resp = yield addUsers(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *addFinance({ payload }) {
      const resp = yield addFinance(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },
    *addPlayer({ payload }) {
      const resp = yield addPlayer(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *changeUserInfo({ payload }) {
      const resp = yield changeUserInfo(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *fetchAdminUsers({ payload }, { put }) {
      const resp = yield fetchAdminUsers(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotAdminUsers', payload: data });
    },

    *changeRestPassword({ payload }) {
      const resp = yield changeRestPassword(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *deleteUser({ payload }) {
      const resp = yield deleteUser(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *fetchSubordinate({ payload }, { put }) {
      const resp = yield fetchSubordinate(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotSubordinate', payload: data });
    },
  },

  reducers: {
    gotUserInfo(state, { payload }) {
      saveTokenInfo(payload); // 保存到 localStorage 中以便访问 API 时取出使用
      reloadAuthorized();
      return { ...state, userInfo: payload };
    },
    gotAdminUsers(state, { payload }) { return { ...state, adminUser: payload || [] }; },
    gotSubordinate(state, { payload }) { return { ...state, subordinate: payload || [] }; },
  },
};

export default UserModel;
