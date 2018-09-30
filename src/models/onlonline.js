import { message } from 'antd';
import { list, getById, add, cancelPromotion, tapeOut, append, reOnline } from '../services/onlonline';

export default {
  namespace: 'onlonline',

  state: {
    onlonline: [],
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
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      console.log(response);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *cancelPromotion({ payload, callback }, { call }) {
      const response = yield call(cancelPromotion, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *tapeOut({ payload, callback }, { call }) {
      const response = yield call(tapeOut, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *append({ payload, callback }, { call }) {
      const response = yield call(append, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *reOnline({ payload, callback }, { call }) {
      const response = yield call(reOnline, payload);
      console.log(response);
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
        onlonline: action.payload,
      };
    },
  },
};
