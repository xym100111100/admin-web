import { message } from 'antd';
import { getById, add, modify, del,listAreaSendOrgs } from '../services/xyzareasendorg';
import { listAll} from '../services/sucorg';

export default {
  namespace: 'xyzareasendorg',

  state: {
    xyzareasendorg: [],
  },

  effects: {
    *listAreaSendOrgs({ payload, callback }, { call, put }) {
      const response = yield call(listAreaSendOrgs, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    
    *listOrgs({ payload, callback }, { call, put }) {
      const response = yield call(listAll, payload);
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
    *del({ payload, callback }, { call }) {
      const response = yield call(del, payload);
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
        xyzareasendorg: action.payload,
      };
    },

  },
};
