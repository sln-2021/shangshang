/* eslint-disable consistent-return */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import { fetchActivity, addActivity, updateActivity, deleteActivity } from '@/services/activity';

export interface ActivityStateType {
  activity?: any;
}

export interface mailModelType {
  namespace: string;
  state: ActivityStateType;
  effects: {
    fetchActivity: Effect;
    addActivity: Effect;
    updateActivity: Effect;
    deleteActivity: Effect;
  };
  reducers: {
    gothActivity: Reducer<ActivityStateType>;
  };
}

const Model: mailModelType = {
  namespace: 'activity',

  state: {
    activity: {},
  },

  effects: {
    *fetchActivity({ payload }, { put }) {
      const resp = yield fetchActivity(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gothActivity', payload: data });
    },

    *addActivity({ payload }, { put }) {
      const resp = yield addActivity(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *updateActivity({ payload }, { put }) {
      const resp = yield updateActivity(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *deleteActivity({ payload }, { put }) {
      const resp = yield deleteActivity(payload.id);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },
  },

  reducers: {
    gothActivity(state, { payload }) {
      return { ...state, activity: payload || [] };
    },
  },
};

export default Model;
