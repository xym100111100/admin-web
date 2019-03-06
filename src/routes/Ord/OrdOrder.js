import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Divider, Popover, message, Col, Card, Form, Input, Select, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrdOrder.less';
import moment from 'moment';
import OrdTraceForm from './OrdTraceForm';
import OrdSendForm from './OrdSendForm';
import OrdDeliverOrgForm from './OrdDeliverOrgForm';
import OrdBatchSendForm from './OrdBatchSendForm';
import ModifyOrderShippingAddress from './ModifyOrderShippingAddress';
const { RangePicker } = DatePicker;

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ ordorder, user, kdicompany, sucorg, kdisender, loading, suporder }) => ({
  ordorder, user, kdicompany, kdisender, sucorg, suporder,
  loading: loading.models.ordorder || loading.models.sucorg || loading.models.user || loading.models.kdicompany || loading.models.kdisender || loading.models.suporder
}))
@Form.create()
export default class OrdOrder extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'ordorder';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
      orderState: 2,
    };
    this.state.orderCode = undefined;
    this.state.record = undefined;
    this.state.expand = {
      expand: '',
    }
    this.state.trace = '';
    this.state.LogisticInfo = '';
    this.state.first = true;
    this.state.selectedRowKeys = [];
    this.state.hasSelected = false;
  }

  //初始化
  componentDidMount() {
    this.state.payloads = {
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
      orderState: this.state.options.orderState,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });

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
      this.setState({
        options: {
          pageNum: fieldsValue.pageNum,
          pageSize: fieldsValue.pageSize,
          orderState: fieldsValue.orderState
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
          orderState: fieldsValue.orderState
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

  onSelectChange = (selectedRowKeys, selectedRow) => {
    selectedRowKeys.receiver = selectedRow;
    const hasSelected = selectedRowKeys.length > 0;//是否有勾选订单
    this.setState({ selectedRowKeys, hasSelected });
  }

  /**
   * 批量打印
   */
  batchPrint = (fields) => {
    const { user } = this.props;
    fields.orgId = user.currentUser.orgId;
    fields.sendOpId = user.currentUser.userId;
    fields.receiver = this.state.selectedRowKeys.receiver;
    //判断是否选择了发件人
    if (fields.selectSend.length === 0) {
      message.error('未选择发件人，不能提交');
      return;
    }
    //判断是否选择了快递公司
    if (fields.selectCompany.length === 0) {
      message.error('未选择快递公司，不能提交');
      return;
    }
    //整理快递公司信息
    let selectCompany = fields.selectCompany
    fields.shipperId = selectCompany.id;
    fields.shipperName = selectCompany.companyName;
    fields.shipperCode = selectCompany.companyCode;
    //整理发货人信息
    let selectSend = fields.selectSend
    fields.senderName = selectSend.senderName;
    fields.senderMobile = selectSend.senderMobile;
    fields.senderProvince = selectSend.senderProvince;
    fields.senderCity = selectSend.senderCity;
    fields.senderExpArea = selectSend.senderExpArea;
    fields.senderPostCode = selectSend.senderPostCode;
    fields.senderAddress = selectSend.senderAddress;
    let printWindow;
    this.props.dispatch({
      type: `suporder/bulkShipment`,
      payload: fields,
      callback: data => {
        this.handleReload();
        this.setState({ editForm: undefined });
        if (fields.logisticCode === undefined) {
          const printPage = data.printPage;
          printWindow = window.open('', '_blank');
          printWindow.document.body.innerHTML = printPage;
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 1);
        }
      }
    })
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
            <Col md={24} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>供应商 :</span>{items.supplierName !== undefined && (items.supplierName)}
            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>单价 :</span>{items.buyPrice !== undefined && (items.buyPrice)}
            </Col>
            <Col md={3} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>数量 :</span>{items.buyCount !== undefined && (items.buyCount)}
            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>总价 :</span>{items.buyPrice !== undefined && (items.buyPrice * items.buyCount)}
            </Col>
            <Col md={5} sm={24}>
              <span >退货状态 :</span><span style={color}>{items.returnState !== undefined && (items.returnState)}</span>
            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>类型 :</span>{items.subjectType !== undefined && (items.subjectType)}
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col md={6} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>上家 :</span>{items.uplineUserName !== undefined && (items.uplineUserName + '(' + items.uplineRelationSource + ')')}
            </Col>
            <Col md={6} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>订单编号 :</span>{items.uplineOrderCode !== undefined && (items.uplineOrderCode)}            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>是否签收 :</span>{items.uplineIsSignIn !== undefined && (items.uplineIsSignIn)}
            </Col>
            <Col md={8} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>签收时间 :</span>{items.uplineReceivedTime !== undefined && (items.uplineReceivedTime)}
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col md={6} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>下家1 :</span>{items.downlineUserName1 !== undefined && (items.downlineUserName1 + '(' + items.downlineRelationSource1 + ')')}
            </Col>
            <Col md={6} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>订单编号 :</span>{items.downlineOrderCode1 !== undefined && (items.downlineOrderCode1)}
            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>是否签收 :</span>{items.downlineIsSignIn1 !== undefined && (items.downlineIsSignIn1)}
            </Col>
            <Col md={8} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>签收时间 :</span>{items.downlineReceivedTime1 !== undefined && (items.downlineReceivedTime1)}
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col md={6} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>下家2 :</span>{items.downlineUserName2 !== undefined && (items.downlineUserName2 + '(' + items.downlineRelationSource2 + ')')}
            </Col>
            <Col md={6} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>订单编号 :</span>{items.downlineOrderCode2 !== undefined && (items.downlineOrderCode2)}
            </Col>
            <Col md={4} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>是否签收 :</span>{items.downlineIsSignIn2 !== undefined && (items.downlineIsSignIn2)}
            </Col>
            <Col md={8} sm={24}>
              <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>签收时间 :</span>{items.downlineReceivedTime2 !== undefined && (items.downlineReceivedTime2)}
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
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>上线组织:</span>{record.onlineOrgName !== undefined && (record.onlineOrgName)}
        </Col>
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>发货组织:</span>{record.deliverOrgName !== undefined && (record.deliverOrgName)}
        </Col>
        {this.showPayTime(record)}
        {this.showSendTime(record)}
        {this.showReceivedTime(record)}
        {this.showCloseTime(record)}
        {this.showCancelTime(record)}
        {this.showorderMessages(record)}
        <Col md={24} sm={24}>
          <Divider />
        </Col>
      </Row>
    )

  }

  /**
   * 根据有没有订单留言显示订单留言
   */
  showorderMessages = (record) => {
    if (record.orderMessages === undefined) {
      return
    } else {
      return (
        <Col md={8} sm={24}>
          <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }}>订单留言:</span>{record.orderMessages !== undefined && (record.orderMessages)}
        </Col>
      )
    }

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

  showEditOrg = (record) => {
    let date = new Date(record.receivedTime);
    let day = (new Date().getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
    if (Math.floor(day) < 7) {
      return (
        <a onClick={() => this.showEditOrgFrom(record)} >
          修改供应商
        </a>
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
                  <Option value="1">已下单</Option>
                  <Option value="2">待发货</Option>
                  <Option value="3">待收货</Option>
                  <Option value="4">已签收</Option>
                  <Option value="5">已结算</Option>
                  <Option value="-1">做废</Option>
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
        <Row>
          <Button type="primary" icon="printer" disabled={!this.state.hasSelected} onClick={this.showBatchSendForm}>
            批量打印
          </Button>
        </Row>
      </Form>
    );
  }

  /**
   * 设置供应商
   */
  setSupplierOrg = (fields) => {
    //自发
    if (fields.deliver === 1) {
      fields.deliverOrgId = fields.onlineOrgId;
    } else if (fields.deliver === 2) {
      //供应商发
      fields.deliverOrgId = fields.supplierId;
    }
    fields.supplierId = fields.supplierId;
    fields.id = fields.orderId;
    this.props.dispatch({
      type: `${this.moduleCode}/updateOrg`,
      payload: fields,
      callback: () => {
        this.setState({ editForm: undefined })
        this.handleReload();
      }
    })
  }


  /**
   * 显示发货窗口
   */
  showSendForm = (record, first) => {
    this.setState({
      first: first
    })
    
    this.showAddForm({
      editFormRecord: record,
      editForm: 'ordDeliver',
      editFormTitle: '发货',
    })
  }

  /**
   * 为了在子窗口隐藏弹窗口并刷新页面
   */
  hiddenForm = () => {
    this.setState({ editForm: undefined })
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });
  }

  //显示批量打印选择快递和发件人的窗口
  showBatchSendForm = () => {
    this.showAddForm({
      editForm: 'ordBatchSend',
      editFormTitle: '选择发货快递和发件人'
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
   * 显示修改供应商窗口，先查询是否只有一个订单详情
   */
  showEditOrgFrom = (record) => {
    this.props.dispatch({
      type: `${this.moduleCode}/detailList`,
      payload: { orderId: record.id },
      callback: data => {
        //先循环判断是否所有详情都是一个供应商
        let is = true;
        for (let i = 0; i < data.length; i++) {
          if (data[i].supplierId !== data[0].supplierId) {
            message.error('该订单有多个供应商，不能修改');
            is = false;
          }
        }
        if (is) {
          data[0].onlineOrgId = record.onlineOrgId;
          this.showEditForm({ editFormRecord: data[0], editForm: 'ordSupplierOrg', editFormTitle: '修改供应商' })
        }
      }
    })
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



    const { ordorder: { ordorder }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys, onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.orderState !== 2 && record.orderState !== 3,
        name: record.orderState.toString(),
      })
    }
    let ps;
    if (ordorder === undefined || ordorder.pageSize === undefined) {
      ps = 5;
    } else {
      ps = ordorder.pageSize;
    }
    let tl;
    if (ordorder === undefined || ordorder.total === undefined) {
      tl = 1;
    } else {
      tl = Number(ordorder.total);
    }
    let kdilogisticData;
    if (ordorder === undefined) {
      kdilogisticData = [];
    } else {
      kdilogisticData = ordorder.list;
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
              <a> {record.orderCode}</a>
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
        title: '发货组织',
        dataIndex: 'deliverOrgName',
        key: 'deliverOrgName',
        width: 100,
      },
      {
        title: '下单金额',
        dataIndex: 'orderMoney',
        key: 'orderMoney',
        width: 100,
      },
      {
        title: '实际金额',
        dataIndex: 'realMoney',
        key: 'realMoney',
        width: 100,
        render: (text, record) => {
          if (record.orderCode === this.state.orderCode) return (<Input onPressEnter={this.hidInput.bind(this)} onInput={() => this.getOrderCode(record)} style={{ width: 60 }} onBlur={this.hidInput.bind(this)} defaultValue={record.realMoney} autoFocus />);
          if (record.orderCode !== this.state.orderCode) return record.realMoney;
        },
      },
      {
        title: '状态',
        dataIndex: 'orderState',
        key: 'orderState',
        width: 100,
        render: (text, record) => {
          if (record.orderState === -1) return '做废';
          if (record.orderState === 1) return '已下单';
          if (record.orderState === 2) return '待发货';
          if (record.orderState === 3) return '待收货';
          if (record.orderState === 4) return '已签收';
          if (record.orderState === 5) return '已结算';
        },
      },

      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        width: 100,
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
                <a onClick={() => this.showSendForm(record, true)} >发货 </a>
                <br />
                <a onClick={() => this.canceldelivery(record)}>取消发货</a>
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
                <a onClick={() => this.showEditOrgFrom(record)} >
                  修改供应商
                  </a>
              </Fragment>
            )
          } else if (record.orderState === 3) {
            return (
              <Fragment>
                <a onClick={() => this.showEditForm({ editFormRecord: record, editForm: 'ordTrace', editFormTitle: '物流信息' })} >
                  物流信息
                  </a>
                <br />
                <a onClick={() => this.showSendForm(record, false)} >添加新快递单</a>
                <a onClick={() => this.showEditOrgFrom(record)} >
                  修改供应商
                  </a>
              </Fragment>
            )
          } else if (record.orderState === 4) {
            return (
              <Fragment>
                <a onClick={() => this.showEditForm({ editFormRecord: record, editForm: 'ordTrace', editFormTitle: '物流信息' })} >
                  物流信息
                  </a>
                <br />
                {this.showEditOrg(record)}
              </Fragment>
            )
          } else {
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
      <PageHeaderLayout title="快递订单管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleTableChange}
              dataSource={kdilogisticData}
              columns={columns}
              rowSelection={rowSelection}
            />
          </div>
        </Card>
        {editForm === 'modifyOrderShippingAddress' && (
          <ModifyOrderShippingAddress
            id={editFormRecord.id}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'ordorder', saveMethodName: 'modifyOrderShippingAddress' })}
          />
        )}
        {editForm === 'ordTrace' && (
          <OrdTraceForm
            width={720}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
        {editForm === 'ordSupplierOrg' && (
          <OrdDeliverOrgForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={(fields) => this.setSupplierOrg(fields)}
          />
        )}
        {editForm === 'ordDeliver' && (
          <OrdSendForm
            width={800}
            first={this.state.first}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            hiddenForm={() => { this.hiddenForm() }}
          />
        )}
        {editForm === 'ordBatchSend' && (
          <OrdBatchSendForm
            width={800}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={(fields) => this.batchPrint(fields)}
          />
        )}
      </PageHeaderLayout>
    );
  }
}