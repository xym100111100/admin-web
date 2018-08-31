import { query as queryUsers } from '../services/user';
import { queryCurrent } from '../services/pfmlogin';
import TreeUtils from '../utils/TreeUtils';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    urns: [],
    menus: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      const { menus, urns, ...currentUser } = action.payload;
      return {
        ...state,
        currentUser,
        urns,
        menus: TreeUtils.convertFlatToTree(menus),
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
