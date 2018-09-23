// 引入时间处理插件
import moment from 'moment';
import MomentUtils from '../utils/MomentUtils';
import ArrayUtils from '../utils/ArrayUtils';
import { reportOrderCountInPeriod } from '../services/kdilogistic';

export default {
  namespace: 'replogistic',

  state: {
    replogistic: {
      dateArr: ['00-00', '00-00', '00-00', '00-00', '00-00', '00-00', '00-00'],
      dataArr: [0, 0, 0, 0, 0, 0, 0],
    },
  },

  effects: {
    /**
     * 统计本组织一段时间内的下单量
     */
    *reportOrderCountInPeriod({ payload, callback }, { call, put }) {
      const { orderTimeStartDate, orderTimeEndDate } = payload;
      const response = yield call(reportOrderCountInPeriod, payload);

      // 初始化数组
      const dateArr = [];
      const dataArr = [];
      const days = MomentUtils.getDaysInPeriod(moment(orderTimeStartDate), moment(orderTimeEndDate));
      for (const day of days) {
        dateArr.push(day.format('MM-DD'));
        dataArr.push(0);
      }

      // 将响应回来的数据转化成报表需要的数据
      for (const item of response) {
        console.log(item.updateTime.substr(5));
        
        const index = ArrayUtils.find(dateArr, item.updateTime.substr(5));
        dataArr[index] = item.total;
      }

      yield put({
        type: 'changOrderCountInPeriodReport',
        payload: { dateArr, dataArr },
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    changOrderCountInPeriodReport(state, action) {
      return {
        replogistic: action.payload,
      };
    },
  },
};
