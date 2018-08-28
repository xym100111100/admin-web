import { message } from 'antd';
import {
  list,
  getById,
  add,
  modify,
  del,
  setDefaultSender,
  alllist,
  getDefaultSender,
  addSender,
  listSenderByOrgId,
} from '../services/kdisender';

export default {
  namespace: 'kdisender',

  state: {
    kdisender: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      for (let index = 0; index < response.length; index++) {
        response[index].senderaddr =
          response[index].senderProvince +
          response[index].senderCity +
          response[index].senderExpArea +
          response[index].senderAddress;
      }
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },

    *getDefaultSender({ payload, callback }, { call, put }) {
      const response = yield call(getDefaultSender, payload);
      if (response != undefined) {
        response.senderaddr = [response.senderProvince, response.senderCity, response.senderExpArea];
      }
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },

    *listSenderByOrgId({ payload, callback }, { call, put }) {
      const response = yield call(listSenderByOrgId, payload);
      if (callback) callback(response);
    },

    *alllist({ payload, callback }, { call, put }) {
      const response = yield call(alllist, payload);
      if (callback) callback(response);
    },
    *selectSender({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeList',
        payload: payload,
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      response.record.senderaddr = [
        response.record.senderProvince,
        response.record.senderCity,
        response.record.senderExpArea,
      ];
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *add({ payload, callback }, { call }) {
      payload.senderProvince = payload.senderaddr[0];
      payload.senderCity = payload.senderaddr[1];
      payload.senderExpArea = payload.senderaddr[2];
      const response = yield call(add, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *modify({ payload, callback }, { call }) {
      payload.senderProvince = payload.senderaddr[0];
      payload.senderCity = payload.senderaddr[1];
      payload.senderExpArea = payload.senderaddr[2];
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

    *setDefaultSender({ payload, callback }, { call }) {
      const response = yield call(setDefaultSender, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },

    *addSender({ payload, callback }, { call }) {
      const response = yield call(addSender, payload);
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
        kdisender: action.payload,
      };
    },
  },
};
