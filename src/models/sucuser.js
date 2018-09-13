import { message } from 'antd';
import CryptoJS from 'crypto-js';

import {
  list,
  getById,
  getByOrgId,
  add,
  modify,
  enable,
  removeLoginPassWord,
  removePayPassWord,
  unbindWeChat,
  unbindQQ,
} from '../services/sucuser';

export default {
  namespace: 'sucuser',

  state: {
    sucuser: [],
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
    *getByOrgId({ payload, callback }, { call, put }) {
      const response = yield call(getByOrgId, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      let payloads = [];
      payloads.push({
        loginName: payload.loginName,
        loginPswd: CryptoJS.MD5(payload.loginPswd).toString(),
        email: payload.email,
        idcard: payload.idcard,
        mobile: payload.mobile,
        nickname: payload.nickname,
        realname: payload.realname,
        appId: 12,
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
    *enable({ payload, callback }, { call }) {
      const response = yield call(enable, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *removeLoginPassWord({ payload, callback }, { call }) {
      const response = yield call(removeLoginPassWord, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *removePayPassWord({ payload, callback }, { call }) {
      const response = yield call(removePayPassWord, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *unbindWeChat({ payload, callback }, { call }) {
      const response = yield call(unbindWeChat, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *unbindQQ({ payload, callback }, { call }) {
      const response = yield call(unbindQQ, payload);
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
        sucuser: action.payload,
      };
    },
    /**
     * 已添加的用户列表
     */
    changeAddedList(state, action) {
      const { addedSucUsers } = action.payload;
      return {
        addedSucUsers,
      };
    },
    /**
     * 未添加的用户列表
     */
    changeUnaddedList(state, action) {
      const { unaddedSucUsers } = action.payload;
      return {
        unaddedSucUsers,
      };
    },
    /**
     * 已添加与未添加的用户列表
     */
    changeAddedAndUnaddedList(state, action) {
      const { addedSucUsers, unaddedSucUsers } = action.payload;
      return {
        addedSucUsers,
        unaddedSucUsers,
      };
    },
  },
};
