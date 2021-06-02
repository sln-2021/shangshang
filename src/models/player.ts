import { Reducer } from 'redux';
import { Effect } from 'dva';
import _ from 'lodash';
import {
  fetchPlayer,
  fetchInvite,
  changePlayer,
  addPlayer,
  deletePlayer,
  fetchPlayerDetail,
  fetchRecord
} from '@/services/player';

export interface PlayerStateType {
  playerList?: any;
  inviteList?: any;
  playerDetail?: any;
  record?: any;
}

export interface PlayerModelType {
  namespace: string;
  state: PlayerStateType;
  effects: {
    fetchPlayer: Effect;
    fetchInvite: Effect;
    changePlayer: Effect;
    addPlayer: Effect;
    deletePlayer: Effect;
    fetchPlayerDetail: Effect;
    fetchRecord: Effect;
  };
  reducers: {
    gotPlayerList: Reducer<PlayerStateType>;
    gotInviteList: Reducer<PlayerStateType>;
    gotPlayerDetail: Reducer<PlayerStateType>;
    gotRecord: Reducer<PlayerStateType>;
  };
}

const Model: PlayerModelType = {
  namespace: 'player',

  state: {
    playerList: {},
    playerDetail: {},
    record: {}
  },

  effects: {
    *fetchPlayer({ payload }, { put }) {
      const resp = yield fetchPlayer(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotPlayerList', payload: data });
    },

    *fetchInvite({ payload }, { put }) {
      const resp = yield fetchInvite(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotInviteList', payload: data });
    },

    *changePlayer({ payload }) {
      const resp = yield changePlayer(payload);

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

    *deletePlayer({ payload }) {
      const resp = yield deletePlayer(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *fetchPlayerDetail({ payload }, { put }) {
      const resp = yield fetchPlayerDetail(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotPlayerDetail', payload: data });
    },

    *fetchRecord({ payload }, { put }) {
      const resp = yield fetchRecord(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotRecord', payload: data });
    },
  },

  reducers: {
    gotPlayerList(state, { payload }) {
      return { ...state, playerList: payload || [] };
    },
    gotInviteList(state, { payload }) {
      return { ...state, inviteList: payload || [] };
    },
    gotPlayerDetail(state, { payload }) {
      return { ...state, playerDetail: payload };
    },
    gotRecord(state, { payload }) {
      return { ...state, record: payload || [] };
    },
  },
};

export default Model;
