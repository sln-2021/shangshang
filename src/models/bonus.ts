import { Reducer } from 'redux';
import { Effect } from 'dva';
import _ from 'lodash';
import { stringify } from 'querystring';
import {
    fetchBonus, updateBonus, addBonus, deleteBonus, fetchBonusDetail,
    fetchBonusTotal, fetchAccountStatement, fetchAccountStatementForMyself, fetcAccountStatementForSubordinate
} from '@/services/bonus';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
    bonusList?: any;
    bonusDetail?: any;
    bonusTotal?: any;
    accountStatement?: any;
    accountStatementForMyself?: any;
    accountStatementForSubordinate?: any;
}

export interface BonusModelType {
    namespace: string;
    state: StateType;
    effects: {
        fetchBonus: Effect;
        changeBonus: Effect;
        addBonus: Effect;
        deleteBonus: Effect;
        fetchBonusDetail: Effect;
        fetchBonusTotal: Effect;
        fetchAccountStatement: Effect;
        fetchAccountStatementForMyself: Effect;
        fetcAccountStatementForSubordinate: Effect;
    };
    reducers: {
        gotBonusList: Reducer<StateType>;
        gotBonusDetail: Reducer<StateType>;
        gotBonusTotal: Reducer<StateType>;
        gotAccountStatement: Reducer<StateType>;
        gotAccountStatementForMyself: Reducer<StateType>;
        gotAccountStatementForSubordinate: Reducer<StateType>;
    };
}

const Model: BonusModelType = {
    namespace: 'bonus',

    state: {
        bonusList: {},
        bonusDetail: {},
        bonusTotal: {},
        accountStatement: {},
        accountStatementForMyself: {},
        accountStatementForSubordinate: {},
    },

    effects: {
        *fetchBonus({ payload }, { put }) {
            const resp = yield fetchBonus(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotBonusList', payload: data });
        },

        *changeBonus({ payload }) {
            const resp = yield updateBonus(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *addBonus({ payload }) {
            const resp = yield addBonus(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *deleteBonus({ payload }) {
            const resp = yield deleteBonus(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchBonusDetail({ payload }, { put }) {
            const resp = yield fetchBonusDetail(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotBonusDetail', payload: data });
        },

        *fetchBonusTotal({ payload }, { put }) {
            const resp = yield fetchBonusTotal();

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotBonusTotal', payload: data });
        },

        *fetchAccountStatement({ payload }, { put }) {
            const resp = yield fetchAccountStatement(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotAccountStatement', payload: data });

            payload.onOk();
        },

        *fetchAccountStatementForMyself({ payload }, { put }) {
            const resp = yield fetchAccountStatementForMyself(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotAccountStatementForMyself', payload: data });
        },

        *fetcAccountStatementForSubordinate({ payload }, { put }) {
            const resp = yield fetcAccountStatementForSubordinate(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotAccountStatementForSubordinate', payload: data });
        },
    },

    reducers: {
        gotBonusList(state, { payload }) { return { ...state, bonusList: payload || [] }; },
        gotBonusDetail(state, { payload }) { return { ...state, bonusDetail: payload }; },
        gotBonusTotal(state, { payload }) { return { ...state, bonusTotal: payload }; },
        gotAccountStatement(state, { payload }) { return { ...state, accountStatement: payload }; },
        gotAccountStatementForMyself(state, { payload }) { return { ...state, accountStatementForMyself: payload }; },
        gotAccountStatementForSubordinate(state, { payload }) { return { ...state, accountStatementForSubordinate: payload }; },
    },
};

export default Model;
