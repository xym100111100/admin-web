import ReportMng from 'components/Rebue/ReportMng';
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, DatePicker, Card, Spin } from 'antd';
// 引入 ECharts 主模块,报错需要使用命令来安装echarts
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件和图例
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
// 引入时间处理插件
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RepLogistic.less';

const { RangePicker } = DatePicker;

@Form.create()
@connect(({ replogistic, user, loading }) => ({
  replogistic,
  user,
  loading: loading.models.replogistic,
}))
export default class RepLogistic extends ReportMng {
  componentWillMount() {
    const { user: { currentUser: { orgId } } } = this.props;

    // 查询报表的model名称
    this.moduleCode = 'replogistic';
    // 调用查询报表的model中的方法名称
    this.reportMethod = 'reportOrderCountInPeriod';

    // 默认获取当前时间和前六天的发单量
    const today = moment();
    const orderTimeEndDate = today.format('YYYY-MM-DD');
    const orderTimeStartDate = today.clone().add(-6, 'd').format('YYYY-MM-DD');

    this.state.options = { orgId, orderTimeStartDate, orderTimeEndDate };
  }

  componentDidMount() {
    this.initECharts();
    super.componentDidMount();
  }

  componentDidUpdate() {
    this.initECharts();
  }

  /**
   * 初始化百度的echarts组件
   */
  initECharts() {
    const { replogistic: { replogistic: { dateArr, dataArr } } } = this.props;

    let myChart = echarts.getInstanceByDom(this.echartsDom);
    if (myChart === undefined) {
      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(this.echartsDom);
    }
    myChart.setOption(this.echartsData(dateArr, dataArr));
  }

  /**
   * 图表数据
   * @param {Array} dateArr
   * @param {Array} dataArr
   */
  echartsData = (dateArr, dataArr) => {
    return {
      tooltip: {},
      legend: {
        data: ['发单量'],
      },
      xAxis: {
        data: dateArr,
      },
      yAxis: {},
      series: [
        {
          name: '发单量',
          type: 'bar',
          data: dataArr,
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                textStyle: {
                  // 数值样式
                  color: 'black',
                  fontSize: 16,
                },
              },
            },
          },
        },
      ],
    };
  };

  /**
   * 设置禁止选择的日期
   */
  disabledDate = current => {
    if (this.selectedFirstDate) {
      const diff = current.diff(this.selectedFirstDate, 'd');
      // 相差不能超过10天
      if (diff > 9 || diff < -9) {
        return true;
      }
    }

    // 不能选择今天之后
    return current.isAfter(moment().endOf('day'));
  };

  handelRangePickerCalendarChange = dates => {
    if (dates.length == 1) {
      this.selectedFirstDate = dates[0];
    } else {
      this.selectedFirstDate = undefined;
    }
  };
  /**
   * 根据改变的日期查询发单量
   */
  handelRangePickerChange = dates => {
    const orderTimeStartDate = dates[0].format('YYYY-MM-DD');
    const orderTimeEndDate = dates[1].format('YYYY-MM-DD');
    this.handleReload({ orderTimeStartDate, orderTimeEndDate });
  };

  /**
   * 渲染搜索表单
   */
  renderSearchForm() {
    return (
      <Form layout="inline" hideRequiredMark>
        <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
          <Col push={6} md={12} sm={24}>
            <RangePicker
              // defaultValue={rangeDates}
              allowClear={false}
              disabledDate={this.disabledDate}
              onCalendarChange={this.handelRangePickerCalendarChange}
              onChange={this.handelRangePickerChange}
            />
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div style={{ background: 'white' }}>
            <Row gutter={{ md: 1, lg: 4, xl: 2 }}>
              <Col md={24} sm={24}>
                <Spin spinning={loading}>
                  <div
                    ref={c => {
                      this.echartsDom = c;
                    }}
                    style={{ width: 700, height: 500, margin: '0 auto' }}
                  />
                </Spin>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
