import { Reducer } from 'redux';
import { Effect } from 'dva';
import _ from 'lodash';
import {
    fetchSponsor,
    changeSponsor,
    fetchSponsorSelect,
    addSponsor,
    fetchSponsorDetail,
} from '@/services/sponsor';

export interface StateType {
    sponsorList?: any;
    unverifiedList?: any;
    sponsorDetail?: any;
    sponsorSelect?: any;
    sponsorNumber?: any;
}

export interface SponsorModelType {
    namespace: string;
    state: StateType;
    effects: {
        fetchSponsor: Effect;
        changeSponsor: Effect;
        fetchSponsorSelect: Effect;
        addSponsor: Effect;
        fetchSponsorDetail: Effect;
    };
    reducers: {
        gotSponsorList: Reducer<StateType>;
        gotSponsorDetail: Reducer<StateType>;
        gotSponsorSelect: Reducer<StateType>;
    };
}

const Model: SponsorModelType = {
    namespace: 'sponsor',

    state: {
        sponsorList: {},
        sponsorDetail: {},
        sponsorSelect: [],
    },
 
    effects: {
        *fetchSponsor({ payload }, { put }) {
            const resp = yield fetchSponsor(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotSponsorList', payload: data });
        },

        *changeSponsor({ payload }) {
            const resp = yield changeSponsor(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchSponsorSelect({ payload }, { put }) {
            const resp = yield fetchSponsorSelect();

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotSponsorSelect', payload: data });
        },

        *addSponsor({ payload }) {
            const resp = yield addSponsor(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchSponsorDetail({ payload }, { put }) {
            const resp = yield fetchSponsorDetail(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotSponsorDetail', payload: data });
        },

    },

    reducers: {
        gotSponsorList(state, { payload }) { return { ...state, sponsorList: payload || [] }; },
        gotSponsorDetail(state, { payload }) { return { ...state, sponsorDetail: payload }; },
        gotSponsorSelect(state, { payload }) { return { ...state, sponsorSelect: payload }; },
    },
};

export default Model;
