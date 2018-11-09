import React, { Fragment, PureComponent } from 'react';
import { Radio, Row, Col, Timeline, Icon } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// 添加与编辑的表单
@connect(({ OrdOrder, loading }) => ({
  OrdOrder,
  loading: loading.models.OrdOrder
}))
@EditForm
export default class OrdTraceForm extends PureComponent {
  state = {
    logisticName: '',
    logisticId: '2',
    trace: '',
    logisticInfo: ''
  };

  //初始化
  componentDidMount() {
    console.log(this.props.record.id);
    this.initLogisticInfo(this.props.record.id);
  }

  /**
 * 初始化物流信息
 */
  initLogisticInfo = (orderId) => {
    this.props.dispatch({
      type: `ordorder/logisticList`,
      payload: { orderId: orderId },
      callback: data => {
        if (data !== undefined && data.length !== 0) {
          this.setState({
            logisticName: data[0].kdiLogistic,
            logisticId: data[0].kdiLogistic[0].id,
            trace: data[0].kdiTrace,
            logisticInfo: [data[0].kdiLogistic[0].shipperName, data[0].kdiLogistic[0].logisticCode],

          })
        }

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
      type: `ordorder/logisticList`,
      payload: { id: recode.target.value },
      callback: data => {
        this.setState({
          logisticInfo: [data[0].kdiLogistic[0].shipperName, data[0].kdiLogistic[0].logisticCode],
          trace: data[0].kdiTrace,
          logisticId: data[0].kdiLogistic[0].id,
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
    return (
      <Fragment>
        <div>
          {this.state.logisticInfo !== '' && this.showLogisticInfo(this.state.logisticInfo)}
          <Row style={{marginTop:10}} gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col  md={5} sm={24} >
              <RadioGroup onChange={this.getLogisticInfo} value={this.state.logisticId}>
                {this.state.logisticName !== '' && this.showLogisticName(this.state.logisticName)}
              </RadioGroup>
            </Col>
            <Col md={19} sm={24} >
              <Timeline >
                {this.state.trace !== '' && this.showTrace(this.state.trace)}
              </Timeline>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}
