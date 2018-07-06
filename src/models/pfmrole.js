import { message } from 'antd';
import { list, getById, add, modify, sort, del, enable } from '../services/pfmrole';

export default {
  namespace: 'pfmrole',

  state: {
    pfmrole: [],
  },

  effects: {
    *refresh({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'changeList',
        payload: Array.isArray(response) ? response : [],
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
    *sort({ payload, callback }, { call }) {
      const response = yield call(sort, payload);
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
    *enable({ payload, callback }, { call }) {
      const response = yield call(enable, payload);
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
      const data = action.payload;
      data.sort((item1, item2) => item1.code > item2.code);
      const tree = [];
      for (const item of data) {
        const { code } = item;
        const level = code.length / 2;
        if (level === 1) {
          tree.push(item);
        } else {
          const code1 = code.substring(0, 2) - 0;
          if (level === 2) {
            if (!tree[code1].children) tree[code1].children = [];
            tree[code1].children.push(item);
          } else {
            const code2 = code.substring(2, 4) - 0;
            if (level === 3) {
              if (!tree[code1].children[code2].children) tree[code1].children[code2].children = [];
              tree[code1].children[code2].children.push(item);
            } else {
              const code3 = code.substring(4, 6) - 0;
              if (level === 4) {
                if (!tree[code1].children[code2].children[code3].children)
                  tree[code1].children[code2].children[code3].children = [];
                tree[code1].children[code2].children[code3].children.push(item);
              } else {
                message.error('菜单最多只支持4级');
              }
            }
          }
        }
      }
      return {
        pfmrole: tree,
      };
    },
  },
};
