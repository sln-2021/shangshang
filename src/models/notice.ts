import { Reducer } from 'redux';
import { Effect } from 'dva';
import _ from 'lodash';
import {
    fetchProvisionalNotice, fetchNotice, addProvisionalNotice, changeNotice, fetchNoticeDetail
} from '@/services/notice';

export interface StateType {
    provisionalNotice?: any;
    notice?: any;
    noticeDetail?: any;
}

export interface PlayerModelType {
    namespace: string;
    state: StateType;
    effects: {
        fetchProvisionalNotice: Effect;
        fetchNotice: Effect;
        addProvisionalNotice: Effect;
        changeNotice: Effect;
        fetchNoticeDetail: Effect;
    };
    reducers: {
        gotProvisionalNotice: Reducer<StateType>;
        gotNotice: Reducer<StateType>;
        gotNoticeDetail: Reducer<StateType>;
    };
}

const Model: PlayerModelType = {
    namespace: 'notice',

    state: {
        provisionalNotice: {},
        notice: {},
        noticeDetail: {},
    },

    effects: {
        *fetchProvisionalNotice({ payload }, { put }) {
            const resp = yield fetchProvisionalNotice(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotProvisionalNotice', payload: data });
        },

        *fetchNotice({ payload }, { put }) {
            const resp = yield fetchNotice(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotNotice', payload: data });
        },

        *changeNotice({ payload }) {
            const resp = yield changeNotice(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *addProvisionalNotice({ payload }) {
            const resp = yield addProvisionalNotice(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchNoticeDetail({ payload }, { put }) {
            const resp = yield fetchNoticeDetail(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotNoticeDetail', payload: data });
        },
    },

    reducers: {
        gotProvisionalNotice(state, { payload }) { return { ...state, provisionalNotice: payload || [] }; },
        gotNotice(state, { payload }) { return { ...state, notice: payload }; },
        gotNoticeDetail(state, { payload }) { return { ...state, noticeDetail: payload }; },
    },
};

export default Model;
