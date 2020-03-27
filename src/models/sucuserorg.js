import { message } from 'antd';

import {
  listAddedUsers,
  listUnaddedUsers,
  listAddedAndUnaddedUsers,
  addUsers,
  delUsers,
  add,
  del,
} from '../services/sucuserorg';

export default {
  namespace: 'sucuserorg',

  state: {
    sucuserorg: [],
  },

  effects: {
    // *list({ payload, callback }, { call, put }) {
    //   const response = yield call(list, payload);
    //   yield put({
    //     type: 'changeList',
    //     payload: response,
    //   });
    //   if (callback) callback(response);
    // },
    /**
     * 查询已添加的用户
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
     * 查询未添加的用户
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
     * 查询已添加与未添加的用户
     */
    *listAddedAndUnaddedUsers({ payload, callback }, { call, put }) {
      const response = yield call(listAddedAndUnaddedUsers, payload);
      yield put({
        type: 'sucuser/changeAddedAndUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 添加用户到组织中
     */
    *addUsers({ payload, callback }, { call, put }) {
      const response = yield call(addUsers, payload);
      yield put({
        type: 'sucuser/changeAddedAndUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 从组织中移除用户
     */
    *delUsers({ payload, callback }, { call, put }) {
      const response = yield call(delUsers, payload);
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
