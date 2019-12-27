import { message } from 'antd';
import { list, getById, add, cancelPromotion, getOne, tapeOut, append, reOnline, getTreeByShopId,selectCategoryByShopId } from '../services/onlonline';
import { shopList } from '../services/slrshop';
export default {
  namespace: 'onlonline',

  state: {
    onlonline: [],
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

    *shopList({ payload, callback }, { call, put }) {
      const response = yield call(shopList, payload);

      if (callback) callback(response);
    },

    *getOne({ payload, callback }, { call, put }) {
      const response = yield call(getOne, payload);
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      console.log(response);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *cancelPromotion({ payload, callback }, { call }) {
      const response = yield call(cancelPromotion, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *tapeOut({ payload, callback }, { call }) {
      const response = yield call(tapeOut, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *append({ payload, callback }, { call }) {
      const response = yield call(append, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *reOnline({ payload, callback }, { call }) {
      const response = yield call(reOnline, payload);
      console.log(response);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *getTreeByShopId({ payload, callback }, { call }) {
      const response = yield call(getTreeByShopId, payload);
      if (callback) callback(response);
    },
    *selectCategoryByShopId({ payload, callback }, { call }) {
      const response = yield call(selectCategoryByShopId, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        onlonline: action.payload,
      };
    },
  },
};
