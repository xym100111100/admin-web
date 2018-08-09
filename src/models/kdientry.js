import { message } from 'antd';
import { companynameandcode, add } from '../services/kdientry';

export default {
  namespace: 'kdientry',

  state: {
    kdientry: [],
  },

  effects: {
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *companynameandcode({ payload, callback }, { call, put }) {
      const response = yield call(companynameandcode, payload);
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
        kdientry: action.payload,
      };
    },
  },
};
