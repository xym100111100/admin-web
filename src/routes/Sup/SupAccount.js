import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, DatePicker, Form, Table, Select, Button, Col, Input, Row } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupAccount.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
@connect(({ supaccount, ordorder, user, afcapplywithdrawaccount, loading }) => ({
  supaccount, ordorder, user, afcapplywithdrawaccount,
  loading: loading.models.supaccount || loading.models.ordorder || loading.models.user || loading.models.afcapplywithdrawaccount
}))
@Form.create()
export default class SupAccount extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'supaccount';
    this.state.balance = 0;
    this.state.supplierName = '';
    this.state.notSettle = 0;
    this.state.alreadySettle = 0;
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
      payload: { deliverOrgId:deliverOrgId },
      callback: data => {
        this.setState({
          notSettle: data.notSettle,
          alreadySettle: data.alreadySettle,
        })
      }
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
              {getFieldDecorator('receiverName')(<Input placeholder="收件人姓名/订单编号" />)}
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
    const columns = [
      {
        title: '代号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditForm({ id: record.id, editForm: 'sysForm', editFormTitle: '编辑系统信息' })}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <p>
              <span style={{ color: 'rgba(0, 0, 0, 0.85)',  marginRight: 8 }}>
                {this.state.supplierName}
              </span>
              您的余额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.balance}元</span>
              您订单待结算金额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.notSettle}元</span>
              您订单已结算金额为:
              <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '20px', marginRight: 8 }}>{this.state.alreadySettle}元</span>
            </p>
            <div className={styles.tableList}>
              <Table
                rowKey="id"
                loading={loading}
                onChange={this.handleTableChange}
                columns={columns}
              />
            </div>
          </Card>
        </PageHeaderLayout>,

      </Fragment>
    );
  }
}
