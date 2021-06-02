import { Reducer } from 'redux';
import { Effect } from 'dva';
import _ from 'lodash';
import {
    fetchClub,
    fetchUnverified,
    changeClub,
    fetchClubSelect,
    addClub,
    deleteClub,
    fetchClubDetail,
    fetchClubNumber
} from '@/services/club';

export interface StateType {
    clubList?: any;
    unverifiedList?: any;
    clubDetail?: any;
    clubSelect?: any;
    clubNumber?: any;
}

export interface ClubModelType {
    namespace: string;
    state: StateType;
    effects: {
        fetchClub: Effect;
        fetchUnverified: Effect;
        changeClub: Effect;
        fetchClubSelect: Effect;
        addClub: Effect;
        deleteClub: Effect;
        fetchClubDetail: Effect;
        fetchClubNumber: Effect;
    };
    reducers: {
        gotClubList: Reducer<StateType>;
        gotUnverifiedList: Reducer<StateType>;
        gotClubDetail: Reducer<StateType>;
        gotClubSelect: Reducer<StateType>;
        gotClubNumber: Reducer<StateType>;
    };
}

const Model: ClubModelType = {
    namespace: 'club',

    state: {
        clubList: {},
        unverifiedList: {},
        clubDetail: {},
        clubSelect: [],
        clubNumber: {},
    },

    effects: {
        *fetchClub({ payload }, { put }) {
            const resp = yield fetchClub(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotClubList', payload: data });
        },

        *fetchUnverified({ payload }, { put }) {
            const resp = yield fetchUnverified(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotUnverifiedList', payload: data });
        },

        *changeClub({ payload }) {
            const resp = yield changeClub(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchClubSelect({ payload }, { put }) {
            const resp = yield fetchClubSelect(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotClubSelect', payload: data });
        },

        *addClub({ payload }) {
            // delete payload.onError
            // delete payload.onOk
            const resp = yield addClub(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *deleteClub({ payload }) {
            const resp = yield deleteClub(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchClubDetail({ payload }, { put }) {
            const resp = yield fetchClubDetail(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotClubDetail', payload: data });
        },

        *fetchClubNumber({ payload }, { put }) {
            const resp = yield fetchClubNumber();

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotClubNumber', payload: data });
        },
    },

    reducers: {
        gotClubList(state, { payload }) { return { ...state, clubList: payload || []}; },
        gotUnverifiedList(state, { payload }) { return { ...state, unverifiedList: payload || []}; },
        gotClubDetail(state, { payload }) { return { ...state, clubDetail: payload }; },
        gotClubSelect(state, { payload }) { return { ...state, clubSelect: payload }; },
        gotClubNumber(state, { payload }) { return { ...state, clubNumber: payload }; },
    },
};

export default Model;
