import { message } from 'antd';
import CryptoJS from 'crypto-js';

import { list, getById, add, modify, del,listByDomainAndKeys } from '../services/sucuserdomain';

export default {
  namespace: 'sucuserdomain',

  state: {
    sucuserdomain: [],
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
    *listByDomainAndKeys({ payload, callback }, { call, put }) {
      const response = yield call(listByDomainAndKeys, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const payloads = [];
      payloads.push({
        loginName: payload.loginName,
        loginPswd: CryptoJS.MD5(payload.loginPswd).toString(),
        email: payload.email,
        idcard: payload.idcard,
        mobile: payload.mobile,
        nickname: payload.nickname,
        realname: payload.realname,
        sysId: 'damai-admin',
        isOrgAdd: payload.isOrgAdd,
        domainId: payload.domainId,
      });
      const response = yield call(add, payloads[0]);
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
        sucuserdomain: action.payload,
      };
    },
  },
};
