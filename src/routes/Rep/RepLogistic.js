import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, DatePicker, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RepLogistic.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
// 引入 ECharts 主模块,报错需要使用命令来安装echarts
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件和图例
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

@Form.create()
@connect(({ replogistic, loading }) => ({ replogistic, loading: loading.models.replogistic }))
export default class RepLogistic extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'replogistic';
    this.state.dateArr = ['08-30', '08-31', '09-01', '09-02', '09-03', '09-04', '09-05'];
    this.state.dataArr = [1, 2, 3, 4, 5, 6, 7];
    //这个状态的意义只是为了使页面数据和实际数据一致
    this.state.aa = '';
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption(this.echartsData(this.state.dateArr, this.state.dataArr));
  }

  componentWillMount() {
    //默认获取当前时间和前六天的发单量
    let date = new Date().getTime();
    let date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 6;
    let orderTimeEnd = this.format(date);
    let orderTimeStart = this.format(date2);
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { orderTimeEnd: orderTimeEnd, orderTimeStart: orderTimeStart },
      callback: data => {
        this.initData(data);
      },
    });
  }

  /**
   * 格式化时间
   */
  format(date) {
    //date是整数，否则要parseInt转换
    let time = new Date(date);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  }

  /**
   * 时间补0
   * @param {} m
   */
  add0(m) {
    return m < 10 ? '0' + m : m;
  }

  /**
   * 整理查询回来的数据
   * @param {*} data
   */
  initData(data) {
    let dateArr = [];
    let dataArr = [];
    for (let i = 0; i < data.length; i++) {
      dateArr[i] = data[i].updateTime;
      dataArr[i] = data[i].total;
    }
    this.setState(
      {
        dateArr: dateArr,
        dataArr: dataArr,
      },
      () => this.componentDidMount()
    );
  }

  /**
   * 图表数据
   * @param {*} dateArr
   */
  echartsData(dateArr, dataArr) {
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
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: 'black',
                  fontSize: 16,
                },
              },
            },
          },
        },
      ],
    };
  }

  /**
   * 因为点击之后就要去查询，而form会得到上次的数据，
   * 所有这里为了数据同步将执行setState后再执行查询
   */
  headonChange = () => {
    this.setState(
      {
        aa: 'a',
      },
      () => this.onChanges()
    );
  };

  /**
   * 根据改变的日期查询发单量
   */
  onChanges = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (
        fieldsValue.orderTimeStart !== undefined &&
        fieldsValue.orderTimeStart !== '' &&
        fieldsValue.orderTimeStart.length >= 1
      ) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTimeStart[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTimeStart[0].format('YYYY-MM-DD HH:mm:ss');
      }
      console.log(fieldsValue);
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
        callback: data => {
          this.initData(data);
        },
      });
    });
  };

  /**
   * 日期选择的自定义规则
   */
  provinceInfo = (rule, value, callback) => {
    if (value[0] && (value[1]._d.getTime() - value[0]._d.getTime()) / 1000 / 60 / 60 / 24 > 10) {
      callback('请选择间隔小于十天的日期');
    } else {
      callback();
    }
  };

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" hideRequiredMark={true}>
        <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
          <Col push={6} md={12} sm={24}>
            <FormItem label="选择查看日期">
              {getFieldDecorator('orderTimeStart', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                  {
                    validator: this.provinceInfo,
                  },
                ],
              })(<RangePicker onChange={this.headonChange} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <PageHeaderLayout title="物流报表">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div style={{ background: 'white' }}>
            <Row gutter={{ md: 1, lg: 4, xl: 2 }}>
              <Col md={24} sm={24}>
                <div id="main" style={{ width: 700, height: 500, margin: '0 auto' }} />
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
