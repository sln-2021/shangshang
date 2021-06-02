import { Reducer } from 'redux';
import { Effect } from 'dva';
import {
    //话费
    fetchBillList,
    addBillItems,
    updateBillItems
    //商品


} from '@/services/shop';
export interface ShopStateType {
    BillList?: any;
    RewardList?: any;
}
export interface ShopModelType {
    namespace: string;
    state: ShopStateType;
    effects: {
        fetchBillList: Effect;
        addBillItems: Effect;
        updateBillItems: Effect;
    },
    reducers: {
        getBillList: Reducer<ShopStateType>;
    }
}
const Model: ShopModelType = {
    namespace: 'shop',
    state: {
        BillList: {},
    },
    effects: {
        // 话费
        *fetchBillList({ payload }, { put }) {
            const resp = yield fetchBillList(payload);
            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);
            const { data } = resp;
            yield put({ type: 'getBillList', payload: data });
        },

        *addBillItems({ payload }) {
            const resp = yield addBillItems(payload);
            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);
            const { data } = resp;
            payload.onOk(data);
        },
        *updateBillItems({ payload }) {
            const resp = yield updateBillItems(payload);

            if (!resp) return;
            if (resp.status !== 200) return payload.onError(resp);

            const { data } = resp;
            payload.onOk(data);
        },
    },
    reducers: {
        getBillList(state, { payload }) {
            return { ...state, BillList: payload || [] };
        },
    }
}
export default Model;
