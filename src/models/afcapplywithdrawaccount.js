import { message } from 'antd';

import { list, getById, reject } from '../services/afcapplywithdrawaccount';
import {  review } from '../services/damai';
export default {
  namespace: 'afcapplywithdrawaccount',

  state: {
    afcapplywithdrawaccount: [],
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
    *reject({ payload, callback }, { call }) {
      const response = yield call(reject, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *review({ payload, callback }, { call }) {
      const response = yield call(review, payload);
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
      return {
        afcapplywithdrawaccount: action.payload,
      };
    },
  },
};
