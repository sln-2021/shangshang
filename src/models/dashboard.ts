import { Reducer } from 'redux';
import { Effect } from 'dva';
import { fetchStatistics } from '@/services/dashboard';

export interface StateType {
    statistics?: any;
}

export interface DashboardModelType {
    namespace: string;
    state: StateType;
    effects: {
        fetchStatistics: Effect;
    };
    reducers: {
        gotStatistics: Reducer<StateType>;
    };
}

const Model: DashboardModelType = {
    namespace: 'dashboard',

    state: {
        statistics: {},
    },

    effects: {
        *fetchStatistics({ payload }, { put }) {
            const resp = yield fetchStatistics(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            yield put({ type: 'gotStatistics', payload: data });
        },
    },

    reducers: {
        gotStatistics(state, { payload }) { return { ...state, statistics: payload }; },
    },
};

export default Model;
