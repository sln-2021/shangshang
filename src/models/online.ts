import { Reducer } from 'redux';
import { Effect } from 'dva';
import {

    fetchOnlineList,
    fetchNewList

} from '@/services/online';
export interface OnlineStateType {
    OnlineList?: any;
    NewList?:any;
}
export interface OnlineModelType {
    namespace: string;
    state: OnlineStateType;
    effects: {
        fetchOnlineList: Effect;
        fetchNewList:Effect;
    },
    reducers: {
        getOnlineList: Reducer<OnlineStateType>;
        getNewList: Reducer<OnlineStateType>;
    }
}
const Model: OnlineModelType = {
    namespace: 'online',
    state: {
        OnlineList: {},
        NewList:{}
    },
    effects: {
        *fetchOnlineList({ payload }, { put }) {
            const resp = yield fetchOnlineList(payload);
            if(!resp) return;
            yield put({ type: 'getOnlineList', payload: resp });
        },
        *fetchNewList({ payload }, { put }) {
            const resp = yield fetchNewList(payload);
            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);
            const { data } = resp;
            yield put({ type: 'getNewList', payload: data });
        },
    },
    reducers: {
        getOnlineList(state, { payload }) {
            return { ...state, OnlineList: payload || [] };
        },
        getNewList(state, { payload }) {
            return { ...state, NewList: payload || [] };
        },
    }
}
export default Model;
