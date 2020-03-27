import { list } from '../services/prdproductpic';

export default {
  namespace: 'prdproductpic',

  state: {
    prdproductpic: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        prdproductpic: action.payload,
      };
    },
  },
};
