/* eslint-disable consistent-return */
import { fetchSystemAd, changeSystemAd, fetchLcsz, changeLcsz } from '@/services/setting'

const Model = {
  namespace: 'setting',

  state: {
    SystemAd: {},
    lcsz: {}
  },

  effects: {
    *fetchSystemAd({ payload }, { put }) {
      const resp = yield fetchSystemAd();
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp);
      const { data } = resp;
      yield put({ type: 'gotSystemAd', payload: data })
    },

    *changeSystemAd({ payload }) {
      const resp = yield changeSystemAd(payload);
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp)
      const { data } = resp;
      payload.onOk(data)
    },

    *fetchLcsz({ payload }, { put }) {
      console.log(payload)
      const resp = yield fetchLcsz();
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp);
      const { data } = resp;
      yield put({ type: 'gotLcsz', payload: data })
      payload.onOk(data)
    },

    *changeLcsz({ payload }) {
      const resp = yield changeLcsz(payload);
      if (!resp) return
      if (resp.status !== 200) return payload.OnError(resp)
      const { data } = resp;
      payload.onOk(data)
    },
  },

  reducers: {
    gotSystemAd(state, { payload }) { return { ...state, SystemAd: payload || {} } },
    gotLcsz(state, { payload }) { return { ...state, lcsz: payload || {} } }
  }
}

export default Model;