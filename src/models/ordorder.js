import { message } from 'antd';
import { buyrelation,list, getById,detail, add, modify, del,cancel,canceldelivery ,modifyOrderRealMoney,shipmentconfirmation, modifyOrderShippingAddress } from '../services/ordorder';
import { printpage } from '../services/kdilogistic';
export default {
  namespace: 'ordorder',

  state: {
    ordorder: [],
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

    *detail({ payload, callback }, { call, put }) {
      const response = yield call(detail, payload);
      if (callback) callback(response);
    },

    *buyrelation({ payload, callback }, { call, put }) {
      const response = yield call(buyrelation, payload);
      if (callback) callback(response);
    },

    *textMeshod({ payload, callback }, { call, put }) {
      console.log("models");
      const response = yield call(textMeshod, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
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
    *cancel({ payload, callback }, { call }) {//取消订单
      const response = yield call(cancel, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *canceldelivery({ payload, callback }, { call }) {//取消发货
      const response = yield call(canceldelivery, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *modifyOrderRealMoney({ payload, callback }, { call }) {//修改实际金额
      const response = yield call(modifyOrderRealMoney, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *shipmentconfirmation({ payload, callback }, { call }) {//确认发货并打印快递单
      const response = yield call(shipmentconfirmation, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *printpage({ payload, callback }, { call }) { //重新打印快递单
      const response = yield call(printpage, payload);
      if(response.length !==0 && response[0].printPage!==undefined){
        if (callback) callback(response);
      }else{
        message.error('打印页面不存在');
      }
    },
    *modifyOrderShippingAddress({ payload, callback }, { call }) {//修改实际金额
      const response = yield call(modifyOrderShippingAddress, payload);
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
        ordorder: action.payload,
      };
    },
  },
};
