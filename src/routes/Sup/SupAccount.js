import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card,Radio,Divider, DatePicker, Form, Table, Select, Button,Popover , Col, Input, Row } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupAccount.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
@connect(({ supaccount, ordorder, user, afcapplywithdrawaccount, loading }) => ({
  supaccount, ordorder, user, afcapplywithdrawaccount,
  loading: loading.models.supaccount || loading.models.ordorder || loading.models.user || loading.models.afcapplywithdrawaccount
}))
@Form.create()
export default class SupAccount extends SimpleMng {
  constructor() {
    super();
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
      orderState: '',
      orgId:0,
    };
    this.state.expand = {
      expand: '',
    }
    this.moduleCode = 'supaccount';
    this.state.balance = 0;
    this.state.supplierName = '';
    this.state.notSettle = 0;
    this.state.alreadySettle = 0;
    this.state.payloads={};
    this.state.returnState=null;
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });
  };

  //初始化
  componentDidMount() {
    const deliverOrgId = this.props.user.currentUser.orgId;
    //获取单个账户
    this.props.dispatch({
      type: `${this.moduleCode}/getOneAccount`,
      payload: { id: deliverOrgId },
      callback: data => {
        if (data.balance !== null && data.balance != undefined) {
          this.setState({
            balance: data.balance,
            supplierName: this.props.user.currentUser.nickname,
          })
        }
      }
    });
    //获取供应商订单已经结算和待结算的成本价
    this.props.dispatch({
      type: `${this.moduleCode}/getSettleTotal`,
      payload: { deliverOrgId: deliverOrgId },
      callback: data => {
        this.setState({
          notSettle: data.notSettle,
          alreadySettle: data.alreadySettle,
        })
      }
    });
    //初始化订单列表
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
   * 点击状态时候访问
   * @param {} state 
   */
  listState(state) {
    let payload = {
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
      orgId:this.props.user.currentUser.orgId,
    };
    //如果是点击了查询退货的就特殊处理
    if(state===1){
      payload.returnState=state;
      this.setState({
        returnState:1,
      })
    }else{
      payload.orderState=state;
      this.setState({
        returnState:null,
      })
    }
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: payload,
    });
  }

    //点击submit查询
    list = () => {
      const { form } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        //特殊处理查询退款中的
        if(fieldsValue.orderState ==="1"){
          fieldsValue.returnState =1;
          fieldsValue.orderState=null;
        }
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
          },
        });
        this.props.dispatch({
          type: `${this.moduleCode}/list`,
          payload: fieldsValue,
        });
      });
    };

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { editFormRecord } = this.state;
    const { user } = this.props;
    editFormRecord.orgId = user.currentUser.orgId;
    return (
      <Form onSubmit={this.list} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('receiverName')(<Input placeholder="订单编号/收件人/商品" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orderTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  placeholder={['下单开始日期', '下单结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
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
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem   >
              {getFieldDecorator('orderState', {
                initialValue: '',
              })(
                <RadioGroup  >
                  <RadioButton onClick={() => this.listState('')} value="">
                    全部
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(4)} value="4">
                    待结算
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(5)} value="5">
                    已结算
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(-1)} value="-1">
                    交易关闭
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(1)} value="1">
                    退款中
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

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
        },
      });
      //特殊处理查询退款中的
      if(fieldsValue.orderState ==="1"){
        fieldsValue.returnState =1;
        fieldsValue.orderState=null;
      }

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


  render() {
    const { supaccount: { supaccount }, loading } = this.props;
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
    let ps;
    if (supaccount === undefined || supaccount.pageSize === undefined) {
      ps = 5;
    } else {
      ps = supaccount.pageSize;
    }
    let tl;
    if (supaccount === undefined || supaccount.total === undefined) {
      tl = 1;
    } else {
      tl = Number(supaccount.total);
    }
    let supaccountData;
    if (supaccount === undefined) {
      supaccountData = [];
    } else {
      supaccountData = supaccount.list;
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
        title: '状态',
        dataIndex: 'orderState',
        key: 'orderState',
        width: 100,
        render: (text, record) => {
          if(this.state.returnState !==null){
            return'退款中';
          }else{
            if (record.orderState === -1) return '交易关闭';
            if (record.orderState === 1) return '已下单';
            if (record.orderState === 2) return '已支付';
            if (record.orderState === 3) return '已发货';
            if (record.orderState === 4) return '待结算';
            if (record.orderState === 5) return '已结算';
          }

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
      },
    ];


    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div style={{ marginBottom: 20 }} >
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', marginRight: 8 }}>
                {this.state.supplierName}
              </span>
              您的账户余额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.balance}元</span>
              您账户订单待结算金额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.notSettle}元</span>
              您账户订单已结算金额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.alreadySettle}元</span>
            </div>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableList}>
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                onChange={this.handleTableChange}
                columns={columns}
                dataSource={supaccountData}
              />
            </div>
          </Card>
        </PageHeaderLayout>,

      </Fragment>
    );
  }
}
