import { message } from 'antd';
import { list, getById, add, modify, del, setDefaultCompany } from '../services/kdicompany';
import { shopList } from '../services/slrshop';

export default {
  namespace: 'kdicompany',

  state: {
    kdicompany: [],
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
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      switch (response.record.payType) {
        case 1:
          response.record.payType = '现付';
          break;
        case 2:
          response.record.payType = '到付';
          break;
        case 3:
          response.record.payType = '月结';
          break;
        case 4:
          response.record.payType = '第三方付';
          break;
      }
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *add({ payload, callback }, { call }) {
      if(payload.orgId===undefined){
        message.error("您未加入任何组织不能添加快递公司，请联系管理员为您添加。");
        return ;
      }
      const response = yield call(add, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *modify({ payload, callback }, { call }) {
      switch (payload.payType) {
        case '现付':
          payload.payType = 1;
          break;
        case '到付':
          payload.payType = 2;
          break;
        case '月结':
          payload.payType = 3;
          break;
        case '第三方付':
          payload.payType = 4;
          break;
      }
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
    *setDefaultCompany({ payload, callback }, { call }) {
      const response = yield call(setDefaultCompany, payload);
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
        kdicompany: action.payload,
      };
    },
  },
};
