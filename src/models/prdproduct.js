import { message } from 'antd';
import { list, getById, add, enable, modify } from '../services/prdproduct';

export default {
  namespace: 'prdproduct',

  state: {
    prdproduct: [],
  },

  effects: {
    /**
     * 查询产品list
     */
    *list({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },

    /**
     * 查询单个产品信息
     */
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (callback) callback(response);
    },

    /**
     * 添加产品信息
     */
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },

    /**
     * 修改产品信息
     */
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
     * 禁用或启用产品
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
        prdproduct: action.payload,
      };
    },
  },
};
