// 引入时间处理插件

import { listRevenueOfDay, listRevenueOfWeek, listRevenueOfYear, listRevenueOfMonth } from '../services/reprevenue';

export default {
  namespace: 'reprevenue',

  state: {
    reprevenue: [],
  },

  effects: {

    *listRevenueOfDay({ payload, callback }, { call, put }) {
      const response = yield call(listRevenueOfDay, payload);
      if (callback) callback(response);
    },

    *listRevenueOfWeek({ payload, callback }, { call, put }) {
      const response = yield call(listRevenueOfWeek, payload);
      if (callback) callback(response);
    },


    *listRevenueOfYear({ payload, callback }, { call, put }) {
      const response = yield call(listRevenueOfYear, payload);
      if (callback) callback(response);
    },

    *listRevenueOfMonth({ payload, callback }, { call, put }) {
      const response = yield call(listRevenueOfMonth, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        reprevenue: action.payload,
      };
    },
  },
};
