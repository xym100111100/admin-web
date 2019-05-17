import { message } from 'antd';
import { list, getCategoryTree } from '../services/prdproductcategory';

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

    /**
     * 获取产品分类树
     */
    *getCategoryTree({ payload, callback }, { call }) {
      const response = yield call(getCategoryTree, payload);
      if (callback) callback(response);
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
