import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card,Radio, DatePicker, Form, Table, Select, Button, Col, Input, Row } from 'antd';
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
    this.moduleCode = 'supaccount';
    this.state.balance = 0;
    this.state.supplierName = '';
    this.state.notSettle = 0;
    this.state.alreadySettle = 0;
    this.state.payloads={};
  }

  //初始化
  componentDidMount() {
    const id = this.props.user.currentUser.userId;
    const deliverOrgId = this.props.user.currentUser.orgId;
    //获取单个账户
    this.props.dispatch({
      type: `${this.moduleCode}/getOneAccount`,
      payload: { id: id },
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
                initialValue: ''
              })(
                <Select placeholder="订单状态" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="2">已支付</Option>
                  <Option value="3">已发货</Option>
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
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem   >
              {getFieldDecorator('applyState', {
                initialValue: '',
              })(
                <RadioGroup  >
                  <RadioButton onClick={() => this.listState('')} value="">
                    全部
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(1)} value="1">
                    待结算
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(2)} value="2">
                    已结算
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(3)} value="3">
                    交易关闭
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(3)} value="4">
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




  render() {
    const { supaccount: { supaccount }, loading } = this.props;

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
        render: (text, record) => {
          if (record.orderState === -1) return '做废';
          if (record.orderState === 1) return '已下单';
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
              您的余额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.balance}元</span>
              您订单待结算金额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.notSettle}元</span>
              您订单已结算金额为:
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
