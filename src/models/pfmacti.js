import { message } from 'antd';
import { list, getById, add, modify, sort, del, auth, enable } from '../services/pfmacti';

export default {
  namespace: 'pfmacti',

  state: {
    pfmacti: [],
  },

  effects: {
    *refresh({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
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
    *sort({ payload, callback }, { call }) {
      const response = yield call(sort, payload);
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
    *auth({ payload, callback }, { call }) {
      const response = yield call(auth, payload);
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
  },

  reducers: {
    changeList(state, action) {
      const { actis } = action.payload;
      actis.sort((item1, item2) => item1.orderNo > item2.orderNo);
      actis.sort((item1, item2) => item1.orderNo > item2.orderNo);
      const tree = [];
      for (const acti of actis) {
        acti.children = [];
        for (const acti of actis) {
          if (acti.actiId === acti.id) {
            acti.type = 'acti';
            acti.children.push(acti);
          }
        }
        acti.type = 'acti';
        tree.push(acti);
      }
      return {
        pfmacti: tree,
      };
    },
  },
};
