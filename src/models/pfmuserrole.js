import { message } from 'antd';
import { listUserRoles, listRoleUsers, modifyUserRoles, modifyRoleUsers, del } from '../services/pfmuserrole';

export default {
  namespace: 'pfmuserrole',

  state: {
    userrole: [],
  },

  effects: {
    *listUserRoles({ payload, callback }, { call, put }) {
      const response = yield call(listUserRoles, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *listRoleUsers({ payload, callback }, { call, put }) {
      const response = yield call(listRoleUsers, payload);
      yield put({
        type: 'changeLists',
        payload: response,
      });
      if (callback) callback(response);
    },
    *modifyUserRoles({ payload, callback }, { call }) {
      const response = yield call(modifyUserRoles, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *modifyRoleUsers({ payload, callback }, { call }) {
      const response = yield call(modifyRoleUsers, payload);
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
      const { roles, existIds } = action.payload;
      const dataSource = [];
      for (const role of roles) {
        dataSource.push({
          key: role.id,
          title: role.name,
          description: role.remark,
        });
      }
      return {
        userrole: { dataSource, targetKeys: existIds },
      };
    },
    changeLists(state, action) {
      return {
        userrole: action.payload,
      };
    },
  },
};
