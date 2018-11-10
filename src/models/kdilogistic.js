import { message } from 'antd';
import { list,  getById, modify, del, getReceiver } from '../services/kdilogistic';
import { add } from '../services/kdientry';

export default {
  namespace: 'kdilogistic',

  state: {
    kdilogistic: [],
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
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (response.result === 1) {
        response.record.receiverProvince=[response.record.receiverProvince,response.record.receiverCity,response.record.receiverExpArea];
        response.record.senderProvince=[response.record.senderProvince,response.record.senderCity,response.record.senderExpArea];
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *add({ payload, callback }, { call }) {
      //设置录入类型，1：手动 2：自动
      payload.entryType=1;
      //处理数据
      //这里其实传上来的shipperName中已经包含了shipperId和shipperCode，且用/隔开，所有这里要处理数据。
      let shipperInfo;
      if (payload.shipperInfo !== undefined) {
        shipperInfo = payload.shipperInfo.split('/');
        payload.shipperId = shipperInfo[0];
        payload.shipperName = shipperInfo[1];
        payload.shipperCode = shipperInfo[2];
      }
      //这里其实传上来的senderProvince中已经包含了senderCity和senderExpArea，是个数组，所有这里要处理数据。
      let senderProvinceInfo = payload.senderProvince;
      if (senderProvinceInfo !== undefined) {
        payload.senderProvince = senderProvinceInfo[0];
        payload.senderCity = senderProvinceInfo[1];
        payload.senderExpArea = senderProvinceInfo[2];
      }
      //这里其实传上来的receiverProvince中已经包含了receiverCity和receiverExpArea，是个数组，所有这里要处理数据。
      let receiverProvinceInfo = payload.receiverProvince;
      if (receiverProvinceInfo !== undefined) {
        payload.receiverProvince = receiverProvinceInfo[0];
        payload.receiverCity = receiverProvinceInfo[1];
        payload.receiverExpArea = receiverProvinceInfo[2];
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
      //设置录入类型，1：手动 2：自动
      payload.entryType=1;
       //处理数据
      //这里其实传上来的shipperName中已经包含了shipperId和shipperCode，且用/隔开，所有这里要处理数据。
      let shipperInfo;
      if (payload.shipperInfo !== undefined) {
        shipperInfo = payload.shipperInfo.split('/');
        payload.shipperId = shipperInfo[0];
        payload.shipperName = shipperInfo[1];
        payload.shipperCode = shipperInfo[2];
      }
      //这里其实传上来的senderProvince中已经包含了senderCity和senderExpArea，是个数组，所有这里要处理数据。
      let senderProvinceInfo = payload.senderProvince;
      if (senderProvinceInfo !== undefined) {
        payload.senderProvince = senderProvinceInfo[0];
        payload.senderCity = senderProvinceInfo[1];
        payload.senderExpArea = senderProvinceInfo[2];
      }
      //这里其实传上来的receiverProvince中已经包含了receiverCity和receiverExpArea，是个数组，所有这里要处理数据。
      let receiverProvinceInfo = payload.receiverProvince;
      if (receiverProvinceInfo !== undefined) {
        payload.receiverProvince = receiverProvinceInfo[0];
        payload.receiverCity = receiverProvinceInfo[1];
        payload.receiverExpArea = receiverProvinceInfo[2];
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
    *getReceiver({ payload, callback }, { call }) {
      const response = yield call(getReceiver, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeList(state, action) {
      return {
        kdilogistic: action.payload,
      };
    },
  },
};
