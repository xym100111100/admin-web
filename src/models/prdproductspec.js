import { message } from 'antd';
import { list, existSpecCode } from '../services/prdproductspec';

export default {
  namespace: 'prdproductspec',

  state: {
    prdproductspec: [],
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

    *existSpecCode({ payload, callback }, { call }) {
      const response = yield call(existSpecCode, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        prdproductspec: action.payload,
      };
    },
  },
};
