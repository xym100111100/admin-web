import { message } from 'antd';

import { list, getById } from '../services/afcwithdrawaccount';

export default {
  namespace: 'withdrawaccount',

  state: {
    withdrawaccount: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      console.log(response);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        withdrawaccount: action.payload,
      };
    },
  },
};
