import { message } from 'antd';
import { list, getById, eorder, modify, del } from '../services/afccharge';

export default {
  namespace: 'afccharge',

  state: {
    afccharge: [],
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
    
    

  },

  reducers: {
    changeList(state, action) {
      return {
        afccharge: action.payload,
      };
    },
  },
};
