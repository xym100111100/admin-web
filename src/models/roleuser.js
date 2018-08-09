import { message } from 'antd';
import { list, add } from '../services/userrole';

export default {
  namespace: 'userrole',

  state: {
    userrole: [],
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
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
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
      const dataSource = [];
      const targetKeys = [];
      const userrole = action.payload;
      if (userrole && userrole.roleList && userrole.userRoleList) {
        for (let i = 0; i < userrole.roleList.length; i++) {
          let selected = false;
          for (let j = 0; j < userrole.userRoleList.length; j++) {
            if (userrole.userRoleList[j].roleId === userrole.roleList[i].id) {
              selected = true;
            }
          }
          const data = {
            key: userrole.roleList[i].id,
            sysId: userrole.roleList[i].sysId,
            description: userrole.roleList[i].name,
          };
          if (selected) {
            targetKeys.push(data.key);
          }
          dataSource.push(data);
        }
      }

      return {
        userrole: { dataSource, targetKeys },
      };
    },
  },
};
