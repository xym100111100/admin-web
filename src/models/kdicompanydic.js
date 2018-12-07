import { list } from '../services/kdicompanydic';

export default {
  namespace: 'companydic',

  state: {
    companydic: [],
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
        companydic: action.payload,
      };
    },
  },
};
