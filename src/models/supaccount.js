import { message } from 'antd';
import { list, getById, add, modify, del, } from '../services/supaccount';
import { orgTrade} from '../services/afcflow';
import { getOneAccount } from '../services/afcapplywithdrawaccount';
import { getSettleTotal } from '../services/ordorder';
import { detail} from '../services/suporder';

import {orgWithdrawTotal,  apply } from '../services/afcwithdraw';

export default {
  namespace: 'supaccount',

  state: {
    supaccount: [],
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
    *orgTrade({ payload, callback }, { call, put }) {
      const response = yield call(orgTrade, payload);
      if (callback) callback(response);
    },
    *orgWithdrawTotal({ payload, callback }, { call, put }) {
      const response = yield call(orgWithdrawTotal, payload);
      if (callback) callback(response);
    },
    *detail({ payload, callback }, { call, put }) {
      const response = yield call(detail, payload);
      if (callback) callback(response);
    },
    *getSettleTotal({ payload, callback }, { call, put }) {
      const response = yield call(getSettleTotal, payload);
      if (callback) callback(response);
    },
    *getOneAccount({ payload, callback }, { call }) {
      const response = yield call(getOneAccount, payload);
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
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
    *apply({ payload, callback }, { call }) {
      const response = yield call(apply, payload);
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
        supaccount: action.payload,
      };
    },
  },
};
