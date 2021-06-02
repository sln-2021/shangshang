/* eslint-disable consistent-return */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import {
  fetchRewards,
  addReward,
  fetchRewardItems,
  addRewardItems,
  updateRewardItem,
} from '@/services/reward';

export interface RewardStateType {
  rewards?: any;
  rewardItems?: any;
}

export interface GamesModelType {
  namespace: string;
  state: RewardStateType;
  effects: {
    fetchRewards: Effect;
    addReward: Effect;
    fetchRewardItems: Effect;
    addRewardItems: Effect;
    changeRewardItem: Effect;
  };
  reducers: {
    gotRewards: Reducer<RewardStateType>;
    gotRewardItems: Reducer<RewardStateType>;
  };
}

const Model: GamesModelType = {
  namespace: 'reward',

  state: {
    rewards: [],
    rewardItems: [],
  },

  effects: {
    *fetchRewards({ payload }, { put }) {
      const resp = yield fetchRewards();

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotRewards', payload: data });
    },

    *addReward({ payload }) {
      const resp = yield addReward(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *fetchRewardItems({ payload }, { put }) {
      const resp = yield fetchRewardItems(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotRewardItems', payload: data });
    },

    *addRewardItems({ payload }) {
      const resp = yield addRewardItems(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *changeRewardItem({ payload }) {
      const resp = yield updateRewardItem(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },
  },

  reducers: {
    gotRewards(state, { payload }) {
      return { ...state, rewards: payload || [] };
    },
    gotRewardItems(state, { payload }) {
      return { ...state, rewardItems: payload || [] };
    },
  },
};

export default Model;
