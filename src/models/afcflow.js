import { message } from 'antd';
import { personList, orgList} from '../services/afcflow';

export default {
  namespace: 'afcflow',
  state: {
    afcflow: [],
  },

  effects: {
    *personList({ payload, callback }, { call, put }) {
      const response = yield call(personList, payload);
      console.info(response);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },

    *orgList({ payload, callback }, { call, put }) {
      const response = yield call(orgList, payload);
      console.info(response);
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
        afcflow: action.payload,
      };
    },
  },
};