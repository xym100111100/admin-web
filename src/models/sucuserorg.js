import { message } from 'antd';

import { list, listAddedUsers, listUnaddedUsers, listAddedAndUnaddedUsers, add, del } from '../services/sucuserorg';

export default {
  namespace: 'sucuserorg',

  state: {
    sucuserorg: [],
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
    /**
     * 列出已添加的用户
     */
    *listAddedUsers({ payload, callback }, { call, put }) {
      const response = yield call(listAddedUsers, payload);
      yield put({
        type: 'sucuser/changeAddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 列出未添加的用户
     */
    *listUnaddedUsers({ payload, callback }, { call, put }) {
      const response = yield call(listUnaddedUsers, payload);
      yield put({
        type: 'sucuser/changeUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 列出已添加与未添加的用户
     */
    *listAddedAndUnaddedUsers({ payload, callback }, { call, put }) {
      const response = yield call(listAddedAndUnaddedUsers, payload);
      yield put({
        type: 'sucuser/changeAddedAndUnaddedList',
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
        sucuserorg: action.payload,
      };
    },
  },
};
