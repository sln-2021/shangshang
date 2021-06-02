import { Reducer } from 'redux';
import { Effect } from 'dva';
import _ from 'lodash';
import {
    fetchOrganizer,
    fetchUnverified,
    changeOrganizer,
    fetchOrganizerSelect,
    addOrganizer,
    DeleteOrganizer,
    fetchOrganizerDetail,
    fetchOrganizerNumber,
    fetchOrganizerTree
} from '@/services/organizer';

export interface OrganizerStateType {
    organizerList?: any;
    unverifiedList?: any;
    organizerDetail?: any;
    organizerSelect?: any;
    organizerNumber?: any;
    organizerTree?: any;
}

export interface OrganizerModelType {
    namespace: string;
    state: OrganizerStateType;
    effects: {
        fetchOrganizer: Effect;
        fetchUnverified: Effect;
        changeOrganizer: Effect;
        fetchOrganizerSelect: Effect;
        addOrganizer: Effect;
        DeleteOrganizer: Effect;
        fetchOrganizerDetail: Effect;
        fetchOrganizerNumber: Effect;
        fetchOrganizerTree: Effect;
    };
    reducers: {
        gotOrganizerList: Reducer<StateType>;
        gotUnverifiedList: Reducer<StateType>;
        gotOrganizerDetail: Reducer<StateType>;
        gotOrganizerSelect: Reducer<StateType>;
        gotOrganizerNumber: Reducer<StateType>;
        gotOrganizerTree: Reducer<StateType>;
    };
}

const Model: OrganizerModelType = {
    namespace: 'organizer',

    state: {
        organizerList: {},
        unverifiedList: {},
        organizerDetail: {},
        organizerSelect: [],
        organizerNumber: {},
        organizerTree: [],
    },

    effects: {
        *fetchOrganizer({ payload }, { put }) {
            const resp = yield fetchOrganizer(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotOrganizerList', payload: data });
        },

        *fetchUnverified({ payload }, { put }) {
            const resp = yield fetchUnverified(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotUnverifiedList', payload: data });
        },

        *changeOrganizer({ payload }) {
            const resp = yield changeOrganizer(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchOrganizerSelect({ payload }, { put }) {
            const resp = yield fetchOrganizerSelect(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotOrganizerSelect', payload: data });
        },

        *addOrganizer({ payload }) {
            const resp = yield addOrganizer(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *DeleteOrganizer({ payload }) {
            const resp = yield DeleteOrganizer(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },

        *fetchOrganizerDetail({ payload }, { put }) {
            const resp = yield fetchOrganizerDetail(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotOrganizerDetail', payload: data });
        },

        *fetchOrganizerNumber({ payload }, { put }) {
            const resp = yield fetchOrganizerNumber();

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotOrganizerNumber', payload: data });
        },

        *fetchOrganizerTree({ payload }, { put }) {
            const resp = yield fetchOrganizerTree();

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotOrganizerTree', payload: data });
        },
    },

    reducers: {
        gotOrganizerList(state, { payload }) { return { ...state, organizerList: payload || [] }; },
        gotUnverifiedList(state, { payload }) { return { ...state, unverifiedList: payload || [] }; },
        gotOrganizerDetail(state, { payload }) { return { ...state, organizerDetail: payload }; },
        gotOrganizerSelect(state, { payload }) { return { ...state, organizerSelect: payload }; },
        gotOrganizerNumber(state, { payload }) { return { ...state, organizerNumber: payload }; },
        gotOrganizerTree(state, { payload }) { return { ...state, organizerTree: payload }; },
    },
};

export default Model;
