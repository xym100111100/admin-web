import { message } from 'antd';
import { list, getById, eorder, modify, del } from '../services/afcflow';

export default {
  namespace: 'afcpersoncharge',

  state: {
    afccharge: [],
  },

  effects: {   
    *chargeForPerson({ payload, callback }, { call }) {
      const response = yield call(chargeForPerson, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },

    *chargeForPlatform({ payload, callback }, { call }) {
        const response = yield call(chargeForPlatform, payload);
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
        afcflow: action.payload,
      };
    },
  },
};
