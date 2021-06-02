/* eslint-disable consistent-return */
import { addRedeemCode, fetchRedeemCode, changeRedeemCode, deleteRedeemCode } from '@/services/redeemCode'

const Model = {
  namespace: 'redeemCode',

  state: {
    redeemCode: {}
  },

  effects: {
    *fetchRedeemCode({ payload }, { put }) {
      const resp = yield fetchRedeemCode(payload);
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp);
      const { data } = resp;
      yield put({ type: 'gotRedeemCode', payload: data })
    },

    *addRedeemCode({ payload }) {
      const resp = yield addRedeemCode(payload);
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp)
      const { data } = resp;
      payload.onOk(data)
    },

    *changeRedeemCode({ payload }) {
      const resp = yield changeRedeemCode(payload);
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp)
      const { data } = resp;
      payload.onOk(data)
    },

    *deleteRedeemCode({ payload }) {
      const resp = yield deleteRedeemCode(payload.id)
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp)
      const { data } = resp;
      payload.onOk(data)
    }
  },

  reducers: {
    gotRedeemCode(state, { payload }) { return { ...state, redeemCode: payload || [] } }
  }
}

export default Model;