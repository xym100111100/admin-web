import { message } from 'antd';

import { list, getById, getByName, add, modify, del } from '../services/orgaccount';
// import { listOrgAccount } from '../services/sucorg';
import { listOrgAccount } from '../services/damai';

export default {
  namespace: 'orgaccount',

  state: {
    orgaccount: [],
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
    *listOrgAccount({ payload, callback }, { call, put }) {
     
      const response = yield call(listOrgAccount, payload);
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
    *getByName({ payload, callback }, { call, put }) {
      const response = yield call(getByName, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
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
    *del({ payload, callback }, { call }) {
      const response = yield call(del, payload);
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
        orgaccount: action.payload,
      };
    },
  },
};
