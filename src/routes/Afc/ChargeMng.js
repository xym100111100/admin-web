import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Popconfirm, Col, Card, Form, Input, Select, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AfcCharge.less';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({afccharge, loading }) => ({
  afccharge,
  loading: loading.models.afccharge,
}))
@Form.create()
export default class ChargeMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'afccharge';
  }
  //初始化
  componentDidMount() {
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
    });
  }
  // 刷新
  handleReload() {
    let {user} =this.props
    let orgId=user.currentUser.orgId
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { orgId: orgId },
    });
  }

  //点击submit查询
  list = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.receiverName;
      if (info !== undefined) {
        let reg = /[0-9]{13,30}/g;
        let reg2 = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.logisticCode = info;
          fieldsValue.receiverName = undefined;
        } else if (info.match(reg2) !== null) {
          fieldsValue.receiverMobile = info;
          fieldsValue.receiverName = undefined;
        }
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      fieldsValue.orgId = this.state.payloads.orgId;
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

  //改变页数查询
  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    const { form } = this.props;
    pager.current = pagination.current;
    this.setState({
      options: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.receiverName;
      if (info !== undefined) {
        let reg = /[0-9]{13,30}/g;
        let reg2 = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.logisticCode = info;
          fieldsValue.receiverName = undefined;
        } else if (info.match(reg2) !== null) {
          fieldsValue.receiverMobile = info;
          fieldsValue.receiverName = undefined;
        }
      }
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      fieldsValue.orgId = this.state.payloads.orgId;
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

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.list} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('receiverName')(<Input placeholder="微信昵称/手机" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('tradeTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem label="">
              {getFieldDecorator('tradeType')(
                <Select placeholder="交易类型" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">充值</Option>
                  <Option value="2">提现</Option>
                  <Option value="3">结算返佣金</Option>
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

  render() {
    const { afccharge,loading } = this.props;
    let afcchargeData;
    if (afccharge === undefined) {
      afcchargeData = [];
    } else {
      afcchargeData = afccharge.list;
    }
    const columns = [
      {
        title: '账号名称',
        dataIndex: 'accountName',
        key: 'accountName',
        width: 150,
      },
      {
        title: '交易类型',
        dataIndex: 'tradeType',
        key: 'tradeType',
        width: 100,
      },
      {
        title: '交易金额',
        dataIndex: 'tradeAmount',
        key: 'tradeAmount',
        width: 100,
      },
      {
        title: '交易时间',
        dataIndex: 'tradeTime',
        key: 'tradeTime',
        width: 100,
      },
      {
        title: '操作人',
        dataIndex: 'opName',
        key: 'opName',
        width: 100,
      },
    ]

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 1,
      pageSizeOptions: ['5', '10'],
    };

    return (
      <PageHeaderLayout title="账号交易流水">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleTableChange}
              dataSource={afcchargeData}
              columns={columns}
            />
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
