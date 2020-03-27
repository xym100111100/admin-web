import { message } from 'antd';
import { list, getById, add, modify, del,listAddedAndUnaddedOrgs ,addOrgs,delOrgs,listUnaddedOrgs,listAddedOrgs} from '../services/xyzarea';

export default {
  namespace: 'xyzarea',

  state: {
    xyzarea: [],
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
    *listUnaddedOrgs({ payload, callback }, { call, put }) {
      const response = yield call(listUnaddedOrgs, payload);
      if (callback) callback(response);
    },
    *listAddedOrgs({ payload, callback }, { call, put }) {
      const response = yield call(listAddedOrgs, payload);
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
    *addOrgs({ payload, callback }, { call }) {
      const response = yield call(addOrgs, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *delOrgs({ payload, callback }, { call }) {
      const response = yield call(delOrgs, payload);
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
        /**
     * 查询已添加与未添加的用户
     */
    *listAddedAndUnaddedOrgs({ payload, callback }, { call, put }) {
      const response = yield call(listAddedAndUnaddedOrgs, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        xyzarea: action.payload,
      };
    },

  },
};
