import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, DatePicker, Tooltip, Icon, Form, Table, Button, Col, Input, Row } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupAccount.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
import {
  ChartCard,
  MiniBar,
  Field,
} from 'components/Charts';

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
      orgId: 0,
    };
    this.state.expand = {
      expand: '',
    }
    this.moduleCode = 'supaccount';
    this.state.balance = 0;
    this.state.supplierName = '';
    this.state.notSettle = 0;
    this.state.alreadySettle = 0;
    this.state.payloads = {};
    this.state.returnState = null;
    this.state.tradeList = [];
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: `${this.moduleCode}/orgTrade`,
      payload: this.state.payloads,
      callback: data => {
        this.setState({
          tradeList:data
        })
      }
    });
  };

  //初始化
  componentDidMount() {
    const orgId = this.props.user.currentUser.orgId;
    //获取单个账户
    this.props.dispatch({
      type: `${this.moduleCode}/getOneAccount`,
      payload: { id: orgId },
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
      payload: { supplierId: orgId },
      callback: data => {
        this.setState({
          notSettle: data.notSettle,
          alreadySettle: data.alreadySettle,
        })
      }
    });
    //初始化交易表
    this.setState({
      orgId: this.props.user.currentUser.orgId,
    })
    this.state.payloads = {
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
      accountId: orgId,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/orgTrade`,
      payload: this.state.payloads,
      callback: data => {
        this.setState({
          tradeList:data
        })
      }
    });

  }


  //点击submit查询
  list = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.tradeTime !== undefined && fieldsValue.tradeTime !== '' && fieldsValue.tradeTime.length >= 1) {
        fieldsValue.tradeTimeEnd = fieldsValue.tradeTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTimeStart = fieldsValue.tradeTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTime = undefined;
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      fieldsValue.accountId = this.props.user.currentUser.orgId;
      this.setState({
        options: {
          pageNum: fieldsValue.pageNum,
          pageSize: fieldsValue.pageSize,
        },
      });
      this.props.dispatch({
        type: `${this.moduleCode}/orgTrade`,
        payload: fieldsValue,
        callback: data => {
          this.setState({
            tradeList:data
          })
        }
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
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
          <Col md={10} sm={24}  >
            <FormItem label="">
              {getFieldDecorator('tradeTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  placeholder={['交易开始日期', '交易结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}  >
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

      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.tradeTime !== undefined && fieldsValue.tradeTime !== '' && fieldsValue.tradeTime.length >= 1) {
        fieldsValue.tradeTimeEnd = fieldsValue.tradeTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTimeStart = fieldsValue.tradeTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTime = undefined;
      }
      fieldsValue.accountId = this.props.user.currentUser.orgId;
      this.props.dispatch({
        type: `${this.moduleCode}/orgTrade`,
        payload: fieldsValue,
        callback: data => {
          this.setState({
            tradeList:data
          })
        }
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
  /**
   * 格式化金额
   */
  formatNum = (data) => {
    if(data !==undefined){
      let i = data.toString().indexOf(".");
      if (i !== -1) {
        return "¥"+data.toString().substring(0, i + 3);
      }
      return data;
    }
  }


  render() {
    const { supaccount: { supaccount }, loading } = this.props;
    console.log(this.state.tradeList);

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.state.tradeList.pageSize,
      total: this.state.tradeList.total,
      pageSizeOptions: ['5', '10'],
    };

    const columns = [
      {
        title: '交易标题',
        dataIndex: 'tradeTitle',
      },
      {
        title: '交易类型',
        dataIndex: 'tradeType',
        render: (text, record) => {
          if (record.tradeType === 50) return '结算'
        },

      },
      {
        title: '交易总额',
        dataIndex: 'tradeAmount',
      },      {
        title: '交易时间',
        dataIndex: 'tradeTime',
      }, 
     
    ];

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 8,
      style: { marginBottom: 24 },
    };

    const balanceRemark = <span>余额说明</span>;
    const notSettleRemark = <span>待结算说明</span>;
    const settleRemark = <span>已结算说明</span>;

    return (
      <Fragment>
        <PageHeaderLayout>
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="余额"
                action={
                  <Tooltip title={balanceRemark}>
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={() => this.formatNum(this.state.balance)}
                contentHeight={46}
              >
                <MiniBar />
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="未结算"
                action={
                  <Tooltip title={notSettleRemark}>
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={() => this.formatNum(this.state.notSettle)}
                contentHeight={46}
              >
                <MiniBar />
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="已结算"
                action={
                  <Tooltip title={settleRemark}>
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={() => this.formatNum(this.state.alreadySettle)}
                contentHeight={46}
              >
                <MiniBar />
              </ChartCard>
            </Col>
          </Row>
          <Card bordered={false} style={{ marginTop: 8, }} >
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableList}>
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                onChange={this.handleTableChange}
                columns={columns}
                dataSource={this.state.tradeList.list}
              />
            </div>
          </Card>
        </PageHeaderLayout>,

      </Fragment>
    );
  }
}
