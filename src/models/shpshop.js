import { message } from 'antd';
import { list, getById, add, modify, enable, getShopAccountList, listUnaddedAccounts, listAddedAccounts, addAccounts, delAccounts } from '../services/shpshop';

export default {
  namespace: 'shpshop',

  state: {
    shpshop: [],
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
    *getShopAccountList({ payload, callback }, { call, put }) {
      const response = yield call(getShopAccountList, payload);
      yield put({
        type: 'changeAddedAndUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *listUnaddedAccounts({ payload, callback }, { call, put }) {
      const response = yield call(listUnaddedAccounts, payload);
      yield put({
        type: 'changeUnaddedAccountList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *listAddedAccounts({ payload, callback }, { call, put }) {
      const response = yield call(listAddedAccounts, payload);
      yield put({
        type: 'changeAddedAccountList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 从店铺中添加用户
     */
    *addAccounts({ payload, callback }, { call, put }) {
      const response = yield call(addAccounts, payload);
      yield put({
        type: 'changeAddedAndUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 从店铺中移除用户
     */
    *delAccounts({ payload, callback }, { call, put }) {
      const response = yield call(delAccounts, payload);
      yield put({
        type: 'changeAddedAndUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        shpshop: action.payload,
      };
    },

    /**
     * 已添加与未添加的用户列表
     */
    changeAddedAndUnaddedList(state, action) {
      const { addedUsers, unaddedUsers } = action.payload;
      return {
        addedUsers,
        unaddedUsers,
      };
    },

    /**
     * 未添加的用户列表
     */
    changeUnaddedAccountList(state, action) {
      const { unaddedUsers } = action.payload;
      return {
        ...state,
        unaddedUsers,
      };
    },

    /**
     * 已添加的用户列表
     */
    changeAddedAccountList(state, action) {
      const { addedUsers } = action.payload;
      return {
        ...state,
        addedUsers,
      };
    },
  },
};
