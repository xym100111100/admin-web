import { getShopAccountList, listUnaddedAccounts, listAddedAccounts, addAccounts, delAccounts } from '../services/shpshopaccount';

export default {
    namespace: 'shpshopaccount',

    state: {
        shpshopaccount: [],
    },

    effects: {
        *getShopAccountList({ payload, callback }, { call, put }) {
            const response = yield call(getShopAccountList, payload);
            yield put({
                type: 'changeAddedAndUnaddedList',
                payload: response,
            });
            if (callback) callback(response);
        },
        *listUnaddedAccounts({ payload, callback }, { call, put }) {
            const response = yield call(listUnaddedAccounts, payload);
            yield put({
                type: 'changeUnaddedAccountList',
                payload: response,
            });
            if (callback) callback(response);
        },
        *listAddedAccounts({ payload, callback }, { call, put }) {
            const response = yield call(listAddedAccounts, payload);
            yield put({
                type: 'changeAddedAccountList',
                payload: response,
            });
            if (callback) callback(response);
        },
        /**
         * 从店铺中添加用户
         */
        *addAccounts({ payload, callback }, { call, put }) {
            const response = yield call(addAccounts, payload);
            yield put({
                type: 'changeAddedAndUnaddedList',
                payload: response,
            });
            if (callback) callback(response);
        },
        /**
         * 从店铺中移除用户
         */
        *delAccounts({ payload, callback }, { call, put }) {
            const response = yield call(delAccounts, payload);
            yield put({
                type: 'changeAddedAndUnaddedList',
                payload: response,
            });
            if (callback) callback(response);
        },
    },

    reducers: {
        /**
         * 已添加与未添加的用户列表
         */
        changeAddedAndUnaddedList(state, action) {
            const { addedUsers, unaddedUsers } = action.payload;
            return {
                addedUsers,
                unaddedUsers,
            };
        },

        /**
         * 未添加的用户列表
         */
        changeUnaddedAccountList(state, action) {
            const { unaddedUsers } = action.payload;
            return {
                ...state,
                unaddedUsers,
            };
        },

        /**
         * 已添加的用户列表
         */
        changeAddedAccountList(state, action) {
            const { addedUsers } = action.payload;
            return {
                ...state,
                addedUsers,
            };
        },
    },
};