import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Timeline, Divider, Popover, message, Col, Icon, Card, Form, Dropdown, Input, Select, Button, Menu, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupOrder.less';
import moment from 'moment';
import SupSendForm from './SupSendForm';
import SupTraceForm from './SupTraceForm';
const { RangePicker } = DatePicker;

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ suporder, user,  loading }) => ({
  suporder, user,
  loading: loading.models.suporder  || loading.models.user 
}))
@Form.create()
export default class SupOrder extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'suporder';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
      orderState: 2,
      orgId:0,
    };
    this.state.orderCode = undefined;
    this.state.record = undefined;
    this.state.expand = {
      expand: '',
    }
    this.state.trace = '';
    this.state.LogisticInfo = '';
    this.state.step = '1';
    this.state.first = true;
    this.state.payloads={};
  }

  //初始化
  componentDidMount() {
    this.setState({
      orgId:this.props.user.currentUser.orgId,
    })
    this.state.payloads = {
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
      orderState: this.state.options.orderState,
      orgId:this.props.user.currentUser.orgId,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });

  }

  /**
 * 发货窗口上一步
 */
  lastStep() {
    this.setState({ step: '1' })
  }

  /**
   * 发货窗口下一步
   */
  nextStep() {
    this.setState({ step: '2' })
  }



  //取消订单
  cancel = (record) => {
    if (record.orderState !== 1) {
      message.success('非已下单状态不能取消订单');
      return;
    }
    let Reason = prompt('请填写取消订单原因', '用户退款');
    if (Reason === null) {
      return;
    }
    record.cancelReason = Reason;
    const { user } = this.props;
    record.cancelingOrderOpId = user.currentUser.userId;
    this.props.dispatch({
      type: `${this.moduleCode}/cancel`,
      payload: record,
      callback: () => {
        this.handleReload(this.state.options);
      },
    });
  }

  //取消发货
  canceldelivery = (record) => {
    if (record.orderState !== 2) {
      message.success('非已支付状态不能取消发货');
      return;
    }
    let reason = prompt('请填写取消发货原因', '用户退款');
    if (reason === null) {
      return;
    }
    this.props.dispatch({
      type: `${this.moduleCode}/canceldelivery`,
      payload: {
        id: record.id,
        canceldeliReason: reason,
      },
      callback: () => {
        this.handleReload(this.state.options);
      },
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });
  };

  //点击submit查询
  list = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.orderTime !== undefined && fieldsValue.orderTime !== '' && fieldsValue.orderTime.length >= 1) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTime = undefined;
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      fieldsValue.orgId = this.props.user.currentUser.orgId;
      this.setState({
        options: {
          pageNum: fieldsValue.pageNum,
          pageSize: fieldsValue.pageSize,
          orderState: fieldsValue.orderState,
          orgId:this.props.user.currentUser.orgId,
        },
      });
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  //改变页数查询
  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    const { form } = this.props;
    pager.current = pagination.current;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        options: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          orderState: fieldsValue.orderState,
          orgId:this.props.user.currentUser.orgId,
        },
      });
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.orderTime !== undefined && fieldsValue.orderTime !== '' && fieldsValue.orderTime.length >= 1) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTime = undefined;
      }
      fieldsValue.orgId = this.props.user.currentUser.orgId;
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  //禁止选择当前日期后的
  disabledDate = current => {
    return current && current > moment().endOf('day');
  };

  showInput = (record) => {
    if (record.orderState !== 1) {
      message.success('非已下单状态不能修改实际金额');
      return;
    }
    this.setState({
      orderCode: record.orderCode,
    })
  }
  //隐藏input且根据情况去修改实际金额
  hidInput = (e) => {
    this.setState({
      orderCode: undefined,
    })
    if (this.state.record === undefined) return;
    if (this.state.record.realMoney === e.target.value) return;

    this.state.record.realMoney = e.target.value;
    const { user } = this.props;
    this.state.record.modifyRealveryMoneyOpId = user.currentUser.userId;
    this.props.dispatch({
      type: `${this.moduleCode}/modifyOrderRealMoney`,
      payload: this.state.record,
      callback: () => {
        this.setState({
          record: undefined,
        })
        this.handleReload(this.state.options);
      },
    });
  }

  getOrderCode = (record) => {
    this.setState({
      record: record
    })
  }

  printPage = (data) => {
    let printWindow;
    const printPage = data.printPage;
    printWindow = window.open('', '_blank');
    printWindow.document.body.innerHTML = printPage;
    printWindow.print();
    printWindow.close();
  }


  showExpand = (data) => {
    const listItems = data.map(items => {
      let color;
      if (items.returnState === 1 || items.returnState === 2 || items.returnState === 3 || items.returnState === '退货中' || items.returnState === '已退货' || items.returnState === '部分已退') {
        color = {
          'color': 'rgba(255, 0, 0, 0.85)',
          'paddingRight': 8,
        }
      } else {
        color = {
          'color': 'rgba(24, 144, 255, 0.85)',
          'paddingRight': 8,
        }
      }
      if (items.returnState === 0) items.returnState = '未退货';
      if (items.returnState === 1) items.returnState = '退货中';
      if (items.returnState === 2) items.returnState = '已退货';
      if (items.returnState === 3) items.returnState = '部分已退';
      if (items.subjectType === 0) items.subjectType = '普通';
      if (items.subjectType === 1) items.subjectType = '全返';


      return (
        <div key={items.id.toString()} >
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col md={12} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>商品 :</span>{items.onlineTitle !== undefined && (items.onlineTitle)}
            </Col>
            <Col md={12} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>规格 :</span>{items.specName !== undefined && (items.specName)}
            </Col>
            <Col md={3} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>数量 :</span>{items.buyCount !== undefined && (items.buyCount)}
            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>价格 :</span>{items.costPrice !== undefined && (items.costPrice)}
            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>总价 :</span>{items.costPrice !== undefined && (items.costPrice * items.buyCount)}
            </Col>
            <Col md={5} sm={24}>
              <span >退货状态 :</span><span style={color}>{items.returnState !== undefined && (items.returnState)}</span>
            </Col>

          </Row>

          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >

            <Divider />
          </Row>
        </div>
      )
    });
    return listItems;
  }


  showReceiverInfo = (record) => {
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
        <Col md={24} sm={24}>
          <h4>收件人信息</h4>
        </Col>
        <Col md={12} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>收件人名字:</span>{record.receiverName !== undefined && (record.receiverName)}
        </Col>
        <Col md={12} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>收件人手机:</span>{record.receiverMobile !== undefined && (record.receiverMobile)}
        </Col>
        <Col md={24} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>收件人地址:</span>{record.receiverProvince !== undefined && (
            record.receiverProvince + record.receiverCity + record.receiverExpArea + record.receiverAddress)}
        </Col>
        {this.showPayTime(record)}
        {this.showSendTime(record)}
        {this.showReceivedTime(record)}
        {this.showCloseTime(record)}
        {this.showCancelTime(record)}
        <Col md={24} sm={24}>
          <Divider />
        </Col>
      </Row>
    )

  }

  /**
 * 根据是否有支付时间来支付时间
 */
  showPayTime = (record) => {
    if (record.payTime === undefined) {
      return
    } else {
      return (
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>支付时间:</span>{record.payTime !== undefined && (record.payTime)}
        </Col>
      )
    }
  }

  /**
* 根据是否有发货时间来显示发货时间
*/
  showSendTime = (record) => {
    if (record.sendTime === undefined) {
      return
    } else {
      return (
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>发货时间:</span>{record.sendTime !== undefined && (record.sendTime)}
        </Col>
      )
    }
  }
  /**
 * 根据是否有签收时间来签收时间
 */
  showReceivedTime = (record) => {
    if (record.receivedTime === undefined) {
      return
    } else {
      return (
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>签收时间:</span>{record.receivedTime !== undefined && (record.receivedTime)}
        </Col>
      )
    }
  }
  /**
 * 根据是否有结算时间来结算时间
 */
  showCloseTime = (record) => {
    if (record.closeTime === undefined) {
      return
    } else {
      return (
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>结算时间:</span>{record.closeTime !== undefined && (record.closeTime)}
        </Col>
      )
    }
  }

  /**
 * 根据是否有作废时间来作废时间
 */
  showCancelTime = (record) => {
    if (record.cancelTime === undefined) {
      return
    } else {
      return (
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>作废时间:</span>{record.cancelTime !== undefined && (record.cancelTime)}
        </Col>
      )
    }
  }





  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { editFormRecord } = this.state;
    const { user } = this.props;
    editFormRecord.orgId = user.currentUser.orgId;
    return (
      <Form onSubmit={this.list} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('receiverName')(<Input placeholder="收件人/订单编号/商品/id" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orderTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  placeholder={['下单开始日期', '下单结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orderState', {
                initialValue: '2'
              })(
                <Select placeholder="订单状态" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="2">已支付</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">已签收</Option>
                  <Option value="5">已结算</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 重新订阅轨迹，没有用到
   */
  getTraceAgain = (record) => {
    if (record.orderState === 3) {
      return (
        <Menu.Item>
          <a onClick={() => this.getTrace(record)} >重新订阅轨迹</a>
        </Menu.Item>
      )
    }
  }

  /**
   * 显示发货窗口并把发货步骤窗口改为1，1为选择快递公司发件人界面，2为选择要发货的详情界面。
   */
  showSendForm = (record, first) => {
    if (first !== undefined) {
      this.setState({
        first: first,
        step: '1',
      })
    } else {
      this.setState({
        first: true,
        step: '1',
      })
    }
    this.showAddForm({
      editFormRecord: record,
      editForm: 'supSend',
      editFormTitle: '发货',
    })
  }




  /**
   * 发货
   */
  willDeliver = (record) => {

    const fields = record.fields;
    const { user } = this.props;
    fields.orgId = user.currentUser.orgId;
    fields.sendOpId = user.currentUser.userId;
    //是首次发货还是添加物流单号
    if (this.state.first) {
      fields.first = true;
    } else {
      fields.first = false;
    }
    //整理快递公司信息
    let shipperInfo;
    if (fields.shipperInfo !== undefined && fields.shipperInfo =='' ) {
      shipperInfo = fields.shipperInfo.split('/');
      fields.shipperId = shipperInfo[0];
      fields.shipperName = shipperInfo[1];
      fields.shipperCode = shipperInfo[2];
      fields.shipperInfo = undefined
    }else {
      message.error('快递公司未配置，请到快递业务中的快递配置中配置');
      return;
    }
    //整理发件信息
    let senderInfo;
    if (fields.senderInfo !== undefined && fields.senderInfo !=='' ) {
      senderInfo = fields.senderInfo.split('/');
      fields.senderName = senderInfo[0];
      fields.senderMobile = senderInfo[1];
      fields.senderProvince = senderInfo[2];
      fields.senderCity = senderInfo[3];
      fields.senderExpArea = senderInfo[4];
      fields.senderPostCode = senderInfo[5];
      fields.senderAddress = senderInfo[6];
      fields.senderInfo = undefined;
    }else {
      message.error('发件人未配置，请到快递业务中的快递配置中配置');
      return;
    }
    //整理被选择的订单详情Id
    let selectDetailId = [];
    if (fields.selectDetailId !== undefined ) {
      //可能添加的时候后面多添加了斜杆，需要去掉再split
      if (fields.selectDetailId.substr(fields.selectDetailId.length - 1, 1) === '/') {
        fields.selectDetailId = fields.selectDetailId.substring(0, fields.selectDetailId.length - 1);
      }
      selectDetailId = fields.selectDetailId.split('/');
      if (selectDetailId[0] === "") {
        message.error('未选择任何详情，不能提交');
        return;
      }
      fields.selectDetailId = selectDetailId;
    }

    //整理当前订单所有未发货订单详情id
    let allDetaileId = [];
    if (fields.allDetaileId !== undefined) {
      //可能添加的时候后面多添加了斜杆，需要去掉再split
      if (fields.allDetaileId.substr(fields.allDetaileId.length - 1, 1) === '/') {
        fields.allDetaileId = fields.allDetaileId.substring(0, fields.allDetaileId.length - 1);
      }
      allDetaileId = fields.allDetaileId.split('/');
      fields.allDetaileId = allDetaileId;
    }
    
    let printWindow;
    this.props.dispatch({
      type: `${this.moduleCode}/shipmentconfirmation`,
      payload: fields,
      callback: data => {
        this.setState({
          step: '3',
        })
        this.handleReload();
        if (fields.logisticCode === undefined) {
          const printPage = data.printPage;
          printWindow = window.open('', '_blank');
          printWindow.document.body.innerHTML = printPage;
          printWindow.print();
          printWindow.close();
        }
      }
    })
  }

  /**
 * 订阅物流信息
 */
  getTrace = (record) => {

    this.props.dispatch({
      type: `${this.moduleCode}/detail`,
      payload: { orderId: record.id },
      callback: data => {
        if (data !== undefined && data.length !== 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].returnState !== 0) {
              message.error('有订单详情处于退货状态，不能订阅');
              return;
            }
          }
          this.showAddForm({
            editFormRecord: record,
            editForm: 'getTrace',
            editFormTitle: '选择订阅信息',
          })
        }
      }
    })
  }



  showOrderInfo = (record) => {
    this.props.dispatch({
      type: `${this.moduleCode}/detail`,
      payload: { orderId: record.id },
      callback: data => {
        if (data !== undefined && data.length !== 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].downlineRelationSource1 === 0) data[i].downlineRelationSource1 = '未知来源';
            if (data[i].downlineRelationSource1 === 1) data[i].downlineRelationSource1 = '自己匹配自己';
            if (data[i].downlineRelationSource1 === 2) data[i].downlineRelationSource1 = '购买关系';
            if (data[i].downlineRelationSource1 === 3) data[i].downlineRelationSource1 = '邀请关系';
            if (data[i].downlineRelationSource1 === 4) data[i].downlineRelationSource1 = '差一人且邀请一人';
            if (data[i].downlineRelationSource1 === 5) data[i].downlineRelationSource1 = '差两人';
            if (data[i].downlineRelationSource1 === 6) data[i].downlineRelationSource1 = '差一人';
            if (data[i].downlineIsSignIn1 === true) data[i].downlineIsSignIn1 = '已签收';
            if (data[i].downlineIsSignIn1 === false) data[i].downlineIsSignIn1 = '未签收';
            if (data[i].downlineRelationSource2 === 0) data[i].downlineRelationSource2 = '未知来源';
            if (data[i].downlineRelationSource2 === 1) data[i].downlineRelationSource2 = '自己匹配自己';
            if (data[i].downlineRelationSource2 === 2) data[i].downlineRelationSource2 = '购买关系';
            if (data[i].downlineRelationSource2 === 3) data[i].downlineRelationSource2 = '邀请关系';
            if (data[i].downlineRelationSource2 === 4) data[i].downlineRelationSource2 = '差一人且邀请一人';
            if (data[i].downlineRelationSource2 === 5) data[i].downlineRelationSource2 = '差两人';
            if (data[i].downlineRelationSource2 === 6) data[i].downlineRelationSource2 = '差一人';
            if (data[i].downlineIsSignIn2 === true) data[i].downlineIsSignIn2 = '已签收';
            if (data[i].downlineIsSignIn2 === false) data[i].downlineIsSignIn2 = '未签收';
            if (data[i].uplineRelationSource === 0) data[i].uplineRelationSource = '未知来源';
            if (data[i].uplineRelationSource === 1) data[i].uplineRelationSource = '自己匹配自己';
            if (data[i].uplineRelationSource === 2) data[i].uplineRelationSource = '购买关系';
            if (data[i].uplineRelationSource === 3) data[i].uplineRelationSource = '邀请关系';
            if (data[i].uplineRelationSource === 4) data[i].uplineRelationSource = '差一人且邀请一人';
            if (data[i].uplineRelationSource === 5) data[i].uplineRelationSource = '差两人';
            if (data[i].uplineRelationSource === 6) data[i].uplineRelationSource = '差一人';
            if (data[i].uplineIsSignIn === true) data[i].uplineIsSignIn = '已签收';
            if (data[i].uplineIsSignIn === false) data[i].uplineIsSignIn = '未签收';
          }
          data.orderInfo = record;
          this.setState({
            expand: {
              expand: data,
            }
          })
        }
      }
    });
  }

  /**
   * 获取物流信息
   */
  getLogisticInfo = (record) => {
    this.props.dispatch({
      type: `${this.moduleCode}/logisticList`,
      payload: { orderId: record.id },
      callback: data => {
        if (data[0] !== undefined && data[0].kdiTrace !== undefined) {
          this.setState({
            trace: data[0].kdiTrace,
          })
        } else {
          this.setState({
            trace: '',
          })
        }
        if (data[0] !== undefined) {
          this.setState({
            LogisticInfo: data[0],
          })
        } else {
          this.setState({
            LogisticInfo: '',
          })
        }

      }
    })
  }
  /**
   * 获取轨迹信息
   */
  onGetTrace = (fields) => {
    const { user } = this.props;
    fields.orgId = user.currentUser.orgId;
    fields.sendOpId = user.currentUser.userId;
    //是首次发货还是添加物流单号
    if (this.state.first) {
      fields.first = true;
    } else {
      fields.first = false;
    }
    //整理快递公司信息
    let shipperInfo;
    if (fields.shipperInfo !== undefined) {
      shipperInfo = fields.shipperInfo.split('/');
      fields.shipperId = shipperInfo[0];
      fields.shipperName = shipperInfo[1];
      fields.shipperCode = shipperInfo[2];
      fields.shipperInfo = undefined
    }
    //整理发件信息
    let senderInfo;
    if (fields.senderInfo !== undefined) {
      senderInfo = fields.senderInfo.split('/');
      fields.senderName = senderInfo[0];
      fields.senderMobile = senderInfo[1];
      fields.senderProvince = senderInfo[2];
      fields.senderCity = senderInfo[3];
      fields.senderExpArea = senderInfo[4];
      fields.senderPostCode = senderInfo[5];
      fields.senderAddress = senderInfo[6];
      fields.senderInfo = undefined;
    }
    this.props.dispatch({
      type: `${this.moduleCode}/getTrace`,
      payload: fields,
      callback: () => {
        this.setState({ editForm: undefined })
        this.handleReload();
      }
    })
  }

  /**
   *计算剩余时间 
   */
  stringTODate =(str,day) =>{
    str=str.replace(/-/g,"/");
    let oldDate=new Date(str);
    let oldTimestamp = new Date(oldDate).getTime();
    let newTimestamp = oldTimestamp+(day*1000*60*60*24)
    let nowTimestamp=new Date().getTime();
    let  rest = Math.ceil((newTimestamp-nowTimestamp)/1000/60/60/24)
    return rest;
  }

  showTrace = (data) => {
    const listItems = data.map(items => {
      return (
        <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} key={items.id.toString()} color="green">{items.happenTime}<Icon type="arrow-right" theme="outlined" />{items.traceDesc}</Timeline.Item>
      )
    });
    return listItems;
  }


  showLogisticInfo = (data) => {
    if (data.shipperName !== undefined) {
      return (
        <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ width: 300 }}  >
          <Col md={12} sm={24}>
            <span>快递公司  </span>
          </Col>
          <Col md={12} sm={24}>
            {data.shipperName}
          </Col>
          <Col md={12} sm={24}>
            <span>快递单号  </span>
          </Col>
          <Col md={12} sm={24}>
            {data.logisticCode}
          </Col>
          <Col md={24} sm={24}>
            <Divider style={{ width: 300 }} />
          </Col>

        </Row>
      )
    } else {
      return (
        <div>content</div>
      )
    }

  }

  render() {

    const content = (
      <div>
        {this.state.expand.expand !== '' && this.showReceiverInfo(this.state.expand.expand.orderInfo)}
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
          <Col md={24} sm={24}>
            <h4>订单详情</h4>
          </Col>
        </Row>
        {this.state.expand.expand !== '' && this.showExpand(this.state.expand.expand)}
      </div>
    );



    const { suporder: { suporder }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    let ps;
    if (suporder === undefined || suporder.pageSize === undefined) {
      ps = 5;
    } else {
      ps = suporder.pageSize;
    }
    let tl;
    if (suporder === undefined || suporder.total === undefined) {
      tl = 1;
    } else {
      tl = Number(suporder.total);
    }
    let suporderData;
    if (suporder === undefined) {
      suporderData = [];
    } else {
      suporderData = suporder.list;
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: 150,
        render: (text, record) => {
          return (
            <Popover autoAdjustOverflow={true} trigger='click' placement='right' onVisibleChange={(visible) => !visible || this.showOrderInfo(record)} content={content} title="查看订单信息" >
              <a>  {record.orderCode}</a>
            </Popover>
          );
        },
      },
      {
        title: '收件人',
        dataIndex: 'receiverName',
        key: 'receiverName',
        width: 150,
      },
      {
        title: '商品',
        dataIndex: 'orderTitle',
        key: 'orderTitle',
        render: (text, record) => {
          if (record.orderTitle.length > 50) {
            return (
              record.orderTitle.substr(0, 50) + '等商品。。'
            )
          } else {
            return (
              record.orderTitle
            )
          }

        },

      },
      {
        title: '总价',
        dataIndex: 'costPriveTotal',
        key: 'costPriveTotal',
        width: 150,

      },
      {
        title: '状态',
        dataIndex: 'orderState',
        key: 'orderState',
        width: 100,
        render: (text, record) => {
          if (record.orderState === 2) return '已支付';
          if (record.orderState === 3) return '已发货';
          if (record.orderState === 4) return '已签收';
          if (record.orderState === 5) return '已结算';
        },
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        width: 150,
        render: (text, record) => {
          if (record.orderState === 3&&record.sendTime!== undefined) {
            return (
              <div>
                {record.orderTime!== undefined&&record.orderTime}
                <br/>
                <span>预计结算到余额还有{this.stringTODate(record.sendTime,24)}天</span>
              </div>
            )
          } else if (record.orderState === 4&&record.receivedTime!== undefined) {
            return (
              <div>
                {record.orderTime!== undefined&&record.orderTime}
                <br/>
                <span>预计距结算到余额还有{this.stringTODate(record.receivedTime,14)}天</span>
              </div>
            )
          } else if (record.orderState === 5&&record.closeTime!== undefined&&(this.stringTODate(record.closeTime,7)>0)) {
            return (
              <div>
                {record.orderTime!== undefined&&record.orderTime}
                <br/>
                <span>预计距结算到余额还有{this.stringTODate(record.closeTime,7)}天</span>
              </div>
            )
          } else if (record.orderState === 5&&record.closeTime!== undefined&&(this.stringTODate(record.closeTime,7)<0)) {
            return (
              <div>
                {record.orderTime!== undefined&&record.orderTime}
                <br/>
                <span>已结算到余额</span>
              </div>
            )
          } else {
            return (
              <div>
                {record.orderTime!== undefined&&record.orderTime}
              </div>
            )
          }
        }
      },
      {
        title: '操作',
        width: 120,
        render: (text, record) => {
          if (record.orderState === 1) {
            return (
              <Fragment  >
                <a onClick={() => this.cancel(record)}>
                  取消订单
                 </a>
                <br />
                <a onClick={() => this.showInput(record)}>
                  修改实际金额
                 </a>
                <br />
                <a onClick={() =>
                  this.showAddForm({
                    id: record.id,
                    moduleCode: 'sucorg',
                    editFormRecord: record,
                    editForm: 'modifyOrderShippingAddress',
                    editFormTitle: '修改收货地址',
                  })
                }
                >
                  修改收货地址
               </a>
              </Fragment>
            )
          } else if (record.orderState === 2) {
            return (
              <Fragment  >
                <a onClick={() => this.showSendForm(record)} >发货 </a>
              </Fragment>
            )
          } else if(record.orderState === 3){
            return(
              <Fragment>
                  <a onClick={() => this.showEditForm({ editFormRecord: record, editForm: 'ordTrace', editFormTitle: '物流信息' })} >
                    物流信息
                  </a>
                  <br />
                  <a onClick={() => this.showSendForm(record, false)} >添加新快递单</a>
              </Fragment>
            )
          }else {
            return (
              <Fragment  >
                  <a onClick={() => this.showEditForm({ editFormRecord: record, editForm: 'ordTrace', editFormTitle: '物流信息' })} >
                    物流信息
                  </a>
              </Fragment>
            )
          }
        }
      },
    ];

    return (
      <PageHeaderLayout title="订单管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleTableChange}
              dataSource={suporderData}
              columns={columns}
            />
          </div>
        </Card>
        {editForm === 'supSend' && (
          <SupSendForm
            width={800}
            step={this.state.step}
            first={this.state.first}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onNextStep={this.state.step === '1' ? (fields) => this.nextStep(fields) : false}
            onLastStep={this.state.step === '2' ? (fields) => this.lastStep(fields) : false}
            onSubmit={this.state.step === '2' ? (fields) => this.willDeliver({ fields }) : false}
          />
        )}
       {editForm === 'ordTrace' && (
          <SupTraceForm
            width={720}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}