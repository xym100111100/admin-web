import { message } from 'antd';
import { listUserRoles, listRoleUsers, addRoles, removeRoles, del } from '../services/pfmuserrole';

export default {
  namespace: 'pfmuserrole',

  state: {
    userrole: { dataSource: [], targetKeys: [] },
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
    /**
     * 添加用户到组织中
     */
    *addRoles({ payload, callback }, { call, put }) {
      const response = yield call(addRoles, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 从组织中移除用户
     */
    *removeRoles({ payload, callback }, { call, put }) {
      const response = yield call(removeRoles, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
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
