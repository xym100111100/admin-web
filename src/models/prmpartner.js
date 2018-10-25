import { message } from 'antd';
import { list, getById, add } from '../services/prmpartner';

export default {
  namespace: 'prmpartner',

  state: {
    prmpartner: [],
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
  },

  reducers: {
    changeList(state, action) {
      return {
        prmpartner: action.payload,
      };
    },
  },
};
