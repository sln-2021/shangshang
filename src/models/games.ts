/* eslint-disable consistent-return */
import { Reducer } from 'redux';
import { Effect } from 'dva';
import {
  fetchLandlordsMatch,
  fetchLandlordsCommon,
  updateMatchStates,
  addLandlordsMatch,
  addLandlordsCommon,
  changeMatchsRefund,
  fetchMatchSettings,
  updateMatchSettings,
  changeLandlordsCommon,
  fetchReward,
  deleteMatch,
  pauseMatch,
  fetchMatchInfo,
  updateMatch,
  fetchMatchRankinfo,
  // 冠名赛
  addLandlordsGMSMatch,
  fetchLandlordsGMSMatch,
  fetchLandlordsGMSMatchByID,
  changeLandlordsGMSMatchState,
  deleteLandlordsGMSMatch,
  pauseGMSMatch
} from '@/services/games';
import { useEffect } from 'react';

export interface GameStateType {
  landlordsMatchList?: any;
  landlordsCommonList?: any;
  matchSettings?: any;
  reward?: any;
  matchInfo?: any;
  matchRankinfo?: any;
  landlordsGMSMatch?: any;
  landlordsGMSMatchSingle?: any;
  processStatus:number;
}

export interface GamesModelType {
  namespace: string;
  state: GameStateType;
  effects: {
    fetchLandlordsMatch: Effect;
    fetchLandlordsCommon: Effect;
    changeMatchStates: Effect;
    addLandlordsMatch: Effect;
    addLandlordsCommon: Effect;
    changeMatchsRefund: Effect;
    fetchMatchSettings: Effect;
    changeMatchSettings: Effect;
    changeLandlordsCommon: Effect;
    fetchReward: Effect;
    deleteMatch: Effect;
    pauseMatch: Effect;
    pauseGMSMatch: Effect;
    fetchMatchInfo: Effect;
    updateMatch: Effect;
    fetchMatchRankinfo: Effect;
    addLandlordsGMSMatch: Effect;
    fetchLandlordsGMSMatch: Effect;
    fetchLandlordsGMSMatchByID: Effect;
    changeLandlordsGMSMatchState: Effect;
    deleteLandlordsGMSMatch: Effect;
  };
  reducers: {
    gotGameList: Reducer<GameStateType>;
    gotLandlordsCommonList: Reducer<GameStateType>;
    gotMatchSettings: Reducer<GameStateType>;
    gotReward: Reducer<GameStateType>;
    gotMatchInfo: Reducer<GameStateType>;
    gotMatchRankinfo: Reducer<GameStateType>;
    gotLandlordsGMSMatch: Reducer<GameStateType>;
    gotLandlordsGMSMatchSingle: Reducer<GameStateType>;
  };
}

const Model: GamesModelType = {
  namespace: 'games',

  state: {
    landlordsMatchList: {},
    landlordsCommonList: {},
    matchSettings: {},
    reward: [],
    matchInfo: [],
    matchRankinfo: {},
    landlordsGMSMatch: [],
    landlordsGMSMatchSingle: {},
  },

  effects: {
    *fetchLandlordsMatch({ payload }, { put }) {
      const resp = yield fetchLandlordsMatch(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotGameList', payload: data });
    },

    *fetchLandlordsCommon({ payload }, { put }) {
      const resp = yield fetchLandlordsCommon(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotLandlordsCommonList', payload: data });
    },

    *changeMatchStates({ payload }) {
      const resp = yield updateMatchStates(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *changeLandlordsCommon({ payload }) {
      const resp = yield changeLandlordsCommon(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *addLandlordsMatch({ payload }) {
      if(payload.type === 4 || payload.type === 5) {
        delete payload.baseScore
      }
      if(payload.type === 1 || payload.type === 2) {
        const arr = ['firstPoint', 'matchFirstPoint', 'addPoint', 'form', 'maxNum', 'riseNum', 'addCount', 'fusaiForm', 'fusaiMaxNum', 'fusaiAddCount', 'fusaiRiseNum', 'finalsTurn', 'finalsFushu']
        arr.forEach((k) =>{
          delete payload[k];
        });
      }
      const resp = yield addLandlordsMatch(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *addLandlordsCommon({ payload }) {
      const resp = yield addLandlordsCommon(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *changeMatchsRefund({ payload }) {
      const resp = yield changeMatchsRefund(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *fetchMatchSettings({ payload }, { put }) {
      const resp = yield fetchMatchSettings();

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotMatchSettings', payload: data });
    },

    *changeMatchSettings({ payload }) {
      const resp = yield updateMatchSettings(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    *fetchReward({ payload }, { put }) {
      const resp = yield fetchReward();

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotReward', payload: data });
    },

    *fetchMatchInfo({ payload }, { put }) {
      const resp = yield fetchMatchInfo(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotMatchInfo', payload: data });
      payload.onOk(data);
    },

    *fetchMatchRankinfo({ payload }, { put }) {
      const resp = yield fetchMatchRankinfo(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      yield put({ type: 'gotMatchRankinfo', payload: data });
    },

    *deleteMatch({ payload }) {
      const resp = yield deleteMatch(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },

    // 暂停比赛场比赛
    *pauseMatch({ payload }) {
      const resp = yield pauseMatch(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },
    // 暂停冠名赛比赛
    
    *pauseGMSMatch({ payload }) {
      const resp = yield pauseGMSMatch(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },
    *updateMatch({ payload }) {
      const resp = yield updateMatch(payload);

      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);

      const { data } = resp;
      payload.onOk(data);
    },
    // =======================================================================================
    //   _____                     __  __ _                _____       _ 
    //  / ____|                   |  \/  (_)              / ____|     (_)
    // | |  __ _   _  __ _ _ __   | \  / |_ _ __   __ _  | (___   __ _ _ 
    // | | |_ | | | |/ _` | '_ \  | |\/| | | '_ \ / _` |  \___ \ / _` | |
    // | |__| | |_| | (_| | | | | | |  | | | | | | (_| |  ____) | (_| | |
    //  \_____|\__,_|\__,_|_| |_| |_|  |_|_|_| |_|\__, | |_____/ \__,_|_|
    //                                            __/ |                 
    //                                           |___/      
    // 冠名赛 
    // ========================================================================================
    // 创建
    *addLandlordsGMSMatch({ payload }) {
      const resp = yield addLandlordsGMSMatch(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      payload.onOk(data);
    },
    // 集合
    *fetchLandlordsGMSMatch({ payload }, { put }) {
      const resp = yield fetchLandlordsGMSMatch(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      yield put({ type: 'gotLandlordsGMSMatch', payload: data });
    },
    // 单个
    *fetchLandlordsGMSMatchByID({ payload }, { put }) {
      const resp = yield fetchLandlordsGMSMatchByID(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      yield put({ type: 'gotLandlordsGMSMatchSingle', payload: data });
      payload.onOk(data);
    },
    // 审核
    *changeLandlordsGMSMatchState({ payload }) {
      const resp = yield changeLandlordsGMSMatchState(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      payload.onOk(data);
    },
    // 删除
    *deleteLandlordsGMSMatch({ payload }) {
      const resp = yield deleteLandlordsGMSMatch(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      payload.onOk(data);
    },
  },

  reducers: {
    gotGameList(state, { payload }) {
      return { ...state, landlordsMatchList: payload || [] };
    },
    gotLandlordsCommonList(state, { payload }) {
      return { ...state, landlordsCommonList: payload || [] };
    },
    gotMatchSettings(state, { payload }) {
      return { ...state, matchSettings: payload || [] };
    },
    gotReward(state, { payload }) {
      return { ...state, reward: payload || [] };
    },
    gotMatchInfo(state, { payload }) {
      return { ...state, matchInfo: payload || [] };
    },
    gotMatchRankinfo(state, { payload }) {
      return { ...state, matchRankinfo: payload || [] };
    },
    gotLandlordsGMSMatch(state, { payload }) {
      return { ...state, landlordsGMSMatch: payload || [] };
    },
    gotLandlordsGMSMatchSingle(state, { payload }) {
      return { ...state, landlordsGMSMatchSingle: payload || [] };
    },
  },
};

export default Model;
