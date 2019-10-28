import { message } from 'antd';
import { list, add, modify, getCategoryTree, enable } from '../services/prdproductcategory';

export default {
  namespace: 'prdproductcategory',

  state: {
    prdproductcategory: [],
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

    /**
     * 获取产品分类树
     */
    *getCategoryTree({ payload, callback }, { call }) {
      const response = yield call(getCategoryTree, payload);
      if (callback) callback(response);
    },
    /**
     * 启用/禁用搜索分类
     */
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
      return {
        prdproductcategory: action.payload,
      };
    },
  },
};
