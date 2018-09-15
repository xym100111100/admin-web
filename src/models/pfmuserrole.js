import { listUserRoles, listRoleUsers, addRoles, delRoles } from '../services/pfmuserrole';

export default {
  namespace: 'pfmuserrole',

  state: {
    userrole: { roles: [], existIds: [] },
  },

  effects: {
    /**
     * 查询用户的角色列表
     */
    *listUserRoles({ payload, callback }, { call, put }) {
      const response = yield call(listUserRoles, payload);
      yield put({
        type: 'changeRoles',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 查询角色的用户列表
     */
    *listRoleUsers({ payload, callback }, { call, put }) {
      const response = yield call(listRoleUsers, payload);
      yield put({
        type: 'changeUsers',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 给用户添加角色
     */
    *addRoles({ payload, callback }, { call, put }) {
      const response = yield call(addRoles, payload);
      yield put({
        type: 'changeRoles',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 移除用户的角色
     */
    *delRoles({ payload, callback }, { call, put }) {
      const response = yield call(delRoles, payload);
      yield put({
        type: 'changeRoles',
        payload: response,
      });
      if (callback) callback(response);
    },
    // *del({ payload, callback }, { call }) {
    //   const response = yield call(del, payload);
    //   if (response.result === 1) {
    //     message.success(response.msg);
    //     if (callback) callback(response);
    //   } else {
    //     message.error(response.msg);
    //   }
    // },
  },

  reducers: {
    changeRoles(state, action) {
      const { roles, existIds } = action.payload;
      return {
        userrole: { roles, existIds },
      };
    },
    changeUsers(state, action) {
      return {
        userrole: action.payload,
      };
    },
  },
};
