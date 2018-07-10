import { message } from 'antd';
import { list, modify } from '../services/pfmactimenu';

export default {
  namespace: 'pfmactimenu',

  state: {
    pfmacti: [],
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
    *modify({ payload, callback }, { call }) {
      const response = yield call(modify, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    changeList(state, action) {
      return { pfmactimenu: action.payload };
    },
  },
};
