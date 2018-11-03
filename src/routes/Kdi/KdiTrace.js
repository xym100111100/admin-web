import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Radio, Row, Col, Timeline, Icon, Card } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ kditrace, user, login, loading }) => ({
  kditrace,
  user,
  login,
  loading: loading.models.kditrace || loading.models.user || loading.models.login,
}))
export default class KdiTrace extends SimpleMng {
  constructor(props) {
    super(props);
    this.moduleCode = 'kditrace';
    this.state.logisticName = '';
    this.state.id ="";
    this.state.trace = '';
    this.state.logisticInfo = '';
  }


  //初始化
  componentDidMount() {
    this.initLogisticInfo(this.props.location.search.substr(this.props.location.search.toString().indexOf("=") + 1))
  }
  // 刷新
  handleReload() {

  }

  /**
 * 初始化物流信息
 */
  initLogisticInfo = (orderId) => {
    this.props.dispatch({
      type: `${this.moduleCode}/logisticList`,
      payload: { orderId: orderId },
      callback: data => {
        this.setState({
          logisticName: data[0].kdiLogistic,
        })
        this.setState({
          id: data[0].kdiLogistic[0].id,
        })
        this.setState({
          trace: data[0].kdiTrace,
        })
        this.setState({
          logisticInfo: [data[0].kdiLogistic[0].shipperName, data[0].kdiLogistic[0].logisticCode],
        })
      }
    })
  }
  /**
   * 显示包裹
   */
  showLogisticName = (data) => {
    if (data !== '' && data.length > 0) {
      const listItems = data.map((items, i) => {
        return (
          <RadioButton style={{ marginTop: 5, borderRadius: 0 }} key={items.id.toString()} value={items.id} >包裹{i + 1}</RadioButton>
        )
      });
      return listItems;

    }
  }
  /**
   * 显示轨迹信息
   */
  showTrace = (data) => {
    if (data !== undefined && data !== '' && data.length > 0) {
      const listItems = data.map((items, i) => {
        if (data.length - 1 === i) {
          return (
            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px', }} />} key={items.id.toString()} color="red"><span style={{ color: 'rgb(24, 144, 255)' }}  >{items.happenTime}</span><Icon type="arrow-right" theme="outlined" style={{ color: 'rgb(24, 144, 255)' }} /><span style={{ color: 'rgb(24, 144, 255)' }}  >{items.traceDesc}</span></Timeline.Item>
          )
        } else {
          if (i % 2 === 0) {
            return (
              <Timeline.Item key={items.id.toString()} color="blue">{items.happenTime}<Icon type="arrow-right" theme="outlined" />{items.traceDesc}</Timeline.Item>
            )
          } else {
            return (
              <Timeline.Item key={items.id.toString()} color="green">{items.happenTime}<Icon type="arrow-right" theme="outlined" />{items.traceDesc}</Timeline.Item>
            )
          }
        }
      });
      return listItems;
    }
  }

  /**
   * 获取物流信息
   */
  getLogisticInfo = (recode) => {
    this.props.dispatch({
      type: `${this.moduleCode}/logisticList`,
      payload: { id: recode.target.value },
      callback: data => {
        this.setState({
          logisticInfo: [data[0].kdiLogistic[0].shipperName, data[0].kdiLogistic[0].logisticCode],
        })
        this.setState({
          trace: data[0].kdiTrace,
        })
      }
    })
  }
  /**
   * 显示物流信息
   */
  showLogisticInfo = (data) => {
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col md={24} sm={24} >
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>快递公司 : </span>{data[0]}
        </Col>
        <Col md={24} sm={24} >
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }} >物流单号 : </span>{data[1]}
        </Col>
      </Row>
    )
  }


  render() {
    const { kditrace: { kditrace }, loading, user } = this.props;

    return (
      <PageHeaderLayout title="物流信息">
        <Card bordered={false}>
          <div>
            {this.state.logisticInfo !== '' && this.showLogisticInfo(this.state.logisticInfo)}
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
              <Col md={5} sm={24} >
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col md={15} sm={24}>
                    <RadioGroup onChange={this.getLogisticInfo} defaultValue={this.state.id}>
                      {this.state.logisticName !== '' && this.showLogisticName(this.state.logisticName)}
                    </RadioGroup>
                  </Col>
                </Row>
              </Col>
              <Col md={15} sm={24}  >
                <Timeline >
                  {this.state.trace !== '' && this.showTrace(this.state.trace)}
                </Timeline>
              </Col>
            </Row>
          </div>
        </Card>

      </PageHeaderLayout >
    );
  }
}
