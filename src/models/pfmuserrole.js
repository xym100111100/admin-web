import {
  listUserRoles,
  listRoleUsers,
  listAddedUsers,
  listUnaddedUsers,
  listAddedAndUnaddedUsers,
  addRoles,
  delRoles,
  addUsers,
  delUsers,
} from '../services/pfmuserrole';

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
     * 查询已添加的用户
     */
    *listAddedUsers({ payload, callback }, { call, put }) {
      const response = yield call(listAddedUsers, payload);
      yield put({
        type: 'sucuser/changeAddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 查询未添加的用户
     */
    *listUnaddedUsers({ payload, callback }, { call, put }) {
      const response = yield call(listUnaddedUsers, payload);
      yield put({
        type: 'sucuser/changeUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 查询已添加与未添加的用户
     */
    *listAddedAndUnaddedUsers({ payload, callback }, { call, put }) {
      const response = yield call(listAddedAndUnaddedUsers, payload);
      yield put({
        type: 'sucuser/changeAddedAndUnaddedList',
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
    /**
     * 添加用户到角色中
     */
    *addUsers({ payload, callback }, { call, put }) {
      const response = yield call(addUsers, payload);
      yield put({
        type: 'sucuser/changeAddedAndUnaddedList',
        payload: response,
      });
      if (callback) callback(response);
    },
    /**
     * 从角色中移除用户
     */
    *delUsers({ payload, callback }, { call, put }) {
      const response = yield call(delUsers, payload);
      yield put({
        type: 'sucuser/changeAddedAndUnaddedList',
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
