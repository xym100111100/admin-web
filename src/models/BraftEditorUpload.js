import { message } from 'antd';
import { upload } from '../services/BraftEditorUpload';

export default {
  namespace: 'BraftEditorUpload',

  state: {
    BraftEditorUpload: [],
  },

  effects: {
    *upload({ payload }, { call }) {
      yield call(upload, payload);
    },
  },
};
