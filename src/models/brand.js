/* eslint-disable consistent-return */
import {
  addBrandType, fetchBrandType, changeBrandType, addBrand, changeBrand, fetchBrand, fetchBrandLevel, fetchBrandTypeList
} from '@/services/brand';

const Model = {
  namespace: 'brand',

  state: {
    brandType: [],
    brandTypeList: {},
    brand: [],
    brandLevel: []
  },

  effects: {
    *addBrandType({ payload }) {
      const resp = yield addBrandType(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      payload.onOk(data);
    },

    *fetchBrandType({ payload }, { put }) {
      const resp = yield fetchBrandType();
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      yield put({ type: 'gotBrandType', payload: data });
    },

    *changeBrandType({ payload }) {
      const resp = yield changeBrandType(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      payload.onOk(data);
    },

    *fetchBrandTypeList({ payload }, { put }) {
      const resp = yield fetchBrandTypeList(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      yield put({ type: 'gotBrandTypeList', payload: data });
    },

    *addBrand({ payload }) {
      const resp = yield addBrand(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      payload.onOk(data);
    },

    *changeBrand({ payload }) {
      const resp = yield changeBrand(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      payload.onOk(data);
    },

    *fetchBrand({ payload }, { put }) {
      const resp = yield fetchBrand(payload);
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      yield put({ type: 'gotBrand', payload: data });
    },

    *fetchBrandLevel({ payload }, { put }) {
      const resp = yield fetchBrandLevel();
      if (!resp) return;
      if (resp.status !== 200) return payload.onError(resp);
      const { data } = resp;
      yield put({ type: 'gotBrandLevel', payload: data });
    },
  },

  reducers: {
    gotBrandType(state, { payload }) {
      return { ...state, brandType: payload || [] };
    },
    gotBrandTypeList(state, { payload }) {
      return { ...state, brandTypeList: payload || [] };
    },
    gotBrand(state, { payload }) {
      return { ...state, brand: payload || [] };
    },
    gotBrandLevel(state, { payload }) {
      return { ...state, brandLevel: payload || [] };
    },
  },
};

export default Model;
