import { message } from 'antd';
import {updateOrg,detailList, buyrelation,list,getTrace, getById,detail, add, modify, del,cancel,canceldelivery ,modifyOrderRealMoney,shipmentconfirmation, modifyOrderShippingAddress } from '../services/ordorder';
import { printpage ,logisticList} from '../services/kdilogistic';
import { listAll } from '../services/sucorg';
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
    *detailList({ payload, callback }, { call, put }) {
      const response = yield call(detailList, payload);
      if (callback) callback(response);
    },

    *logisticList({ payload, callback }, { call, put }) {
      const response = yield call(logisticList, payload);
      if (callback) callback(response);
    },

    *listAll({ payload, callback }, { call, put }) {
      const response = yield call(listAll, payload);
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
    *updateOrg({ payload, callback }, { call }) {
      const response = yield call(updateOrg, payload);
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
    *getTrace({ payload, callback }, { call }) {//供应商确认发货并打印快递单
      const response = yield call(getTrace, payload);
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
