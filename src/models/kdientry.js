import { message } from 'antd';
import { add } from '../services/kdientry';

export default {
  namespace: 'kdientry',

  state: {
    kdientry: [],
  },

  effects: {
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
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
        kdientry: action.payload,
      };
    },
  },
};
