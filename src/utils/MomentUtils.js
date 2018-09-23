// 引入时间处理插件
import moment from 'moment';

export default class MomentUtils {
  /**
   * 获取一段时间的日期数组
   * @param {moment} startTime 开始时间
   * @param {moment} endTime 结束时间
   */
  static getDaysInPeriod(startTime, endTime) {
    if (startTime.isAfter(endTime)) throw new Error('结束时间不能小于开始时间');
    const result = [];
    let day = this.getDayOfTime(startTime);
    const endDay = this.getDayOfTime(endTime);
    while (!day.isAfter(endDay)) {
      result.push(day);
      day = day.add(1, 'd').clone(); // 加一天
    }
    return result;
  }

  /**
   * 获取时间的日期（即把时间的时分秒部分去掉）
   * @param {moment} time
   */
  static getDayOfTime(time) {
    return moment(time.format('YYYY-MM-DD'));
  }
}
