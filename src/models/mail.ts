/* eslint-disable consistent-return */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import { addMailAndProp, fetchMailAndProp, fetchMailAndPropDetail, fetchMailDetail } from '@/services/mail';

export interface StateType {
  mailList?: any;
  mailAndProp?: any;
  detail?: any;
  mailDetail?: any;
}

export interface mailModelType {
  namespace: string;
  state: StateType;
  effects: {
    addMailAndProp: Effect;
    fetchMail: Effect;
    fetchMailAndProp: Effect;
    fetchMailAndPropDetail: Effect;
    fetchMailDetail: Effect;
  };
  reducers: {
    gotMailList: Reducer<StateType>;
    gotMailAndProp: Reducer<StateType>;
    gotDetail: Reducer<StateType>;
    gotMailDetail: Reducer<StateType>;
  };
}

const Model: mailModelType = {
  namespace: 'mail',

  state: {
    mailList: {},
    mailAndProp: {},
    detail: {},
    mailDetail: {},
  },

  effects: {
    *fetchMail({ payload }, { put }) {
      const resp = yield fetchMailAndProp(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotMailList', payload: data });
    },

    *fetchMailAndProp({ payload }, { put }) {
      const resp = yield fetchMailAndProp(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotMailAndProp', payload: data });
    },

    *addMailAndProp({ payload }, { put }) {
      const resp = yield addMailAndProp(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *fetchMailAndPropDetail({ payload }, { put }) {
      const resp = yield fetchMailAndPropDetail(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotDetail', payload: data });
    },

    *fetchMailDetail({ payload }, { put }) {
      const resp = yield fetchMailDetail(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotMailDetail', payload: data });
    },
  },

  reducers: {
    gotMailList(state, { payload }) {
      return { ...state, mailList: payload || [] };
    },

    gotMailAndProp(state, { payload }) {
      return {
        ...state,
        mailAndProp: payload || [],
      };
    },
    gotDetail(state, { payload }) {
      return {
        ...state,
        detail: payload || [],
      };
    },
    gotMailDetail(state, { payload }) {
      return {
        ...state,
        mailDetail: payload || [],
      };
    },
  },

};

export default Model;
