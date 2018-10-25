import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Form, Input, Button, Table, Popconfirm,Row, Col, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './WithdrawMng.less';
import WithdrawReviewForm from './WithdrawReviewForm';
import WithdrawCancelForm from './WithdrawCancelForm';

const { Search } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

const { Description } = DescriptionList;
@connect(({ withdraw, loading }) => ({
  withdraw,
  loading: loading.models.withdraw,
}))
@Form.create()
export default class WithdrawMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'withdraw';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
      withdrawState: 1,
    };
  }

  handleTableChange = pagination => {
    this.props.form.validateFields((err, values) => {
      this.handleReload({
        users: values.users,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
    });
  };

  // 刷新用户列表
  handleUserReload(selectedRows) {
    // 加载用户信息
    this.props.dispatch({
      type: 'withdraw/list',
      payload: {
        pageNum: 1,
        pageSize: 5,
        orgId: selectedRows[0].id,
      },
      callback: () => {
        this.setState({ selectedRows });
      },
    });
  }

  // 分页翻页
  handleTableChanges = pagination => {
    const { selectedRows } = this.state;
    if (selectedRows === undefined) {
      return;
    }
    this.props.dispatch({
      type: 'withdraw/list',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        orgId: selectedRows[0].id,
      },
      callback: () => {
        this.setState();
      },
    });
  };

  // 查询
  selectWithdraw = (e) => {
    let paload = {};
    paload.bankAccountName = e;
    paload.pageNum = this.state.options.pageNum;
    paload.pageSize = this.state.options.pageSize;
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: paload,
    });
  }


  // 重置from
  handleFormReset = () => {
    this.props.form.resetFields();
  };

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="银行账户名称">{getFieldDecorator('bankAccountName')(<Input placeholder="银行账户名称" />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="">
              {getFieldDecorator('withdrawState', {
                initialValue: '1'
              })(
                <Select placeholder="提现状态" style={{ width: '100%' }}>
                  <Option value="-1">已作废</Option>
                  <Option value="1">申请中</Option>
                  <Option value="2">处理中</Option>
                  <Option value="3">已提现</Option>
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

  // 处理提现
  deal = e => {
    this.props.dispatch({
      type: `withdraw/deal`,
      payload: { id: e.id },
      callback: () => {
        this.handleReload();
      },
    });
  }

  render() {
    const { withdraw: { withdraw }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const columns = [
      {
        title: '申请人',
        dataIndex: 'applicantName',
      },
      {
        title: '提现类型',
        dataIndex: 'withdrawType',
        render: (text, record) => { return (text === 1 ? "银行卡" : "支付宝") },
      },
      {
        title: '提现金额',
        dataIndex: 'amount',
      },
      {
        title: '实际到帐金额',
        dataIndex: 'realAmount',
      },
      {
        title: '服务费',
        dataIndex: 'seviceCharge',
      },
      {
        title: '提现状态',
        dataIndex: 'withdrawState',
        render: (text, record) => {
          let withdrawState;
          if (text === -1) {
            withdrawState = "已作废";
          } else if (text === 1) {
            withdrawState = "申请中";
          } else if (text === 2) {
            withdrawState = "处理中";
          } else if (text === 3) {
            withdrawState = "已提现";
          }
          return (withdrawState)
        },
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
      },
      {
        title: '操作',
        width: 170,
        render: (text, record) => {
          if (record.withdrawState === 1) {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showAddForm({
                      id: record.id,
                      editFormRecord: record,
                      moduleCode: 'withdraw',
                      editForm: 'withdrawCancelForm',
                      editFormTitle: '拒绝通过',
                    })
                  }
                >
                  拒绝
                </a>
                <Divider type="vertical" />
                <Popconfirm title="是否要处理该提现？" onConfirm={() => this.deal(record)}>
                  <a>处理</a>
                </Popconfirm>
              </Fragment>
            );
          }
          if (record.withdrawState === 2) {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showAddForm({
                      id: record.id,
                      editFormRecord: record,
                      moduleCode: 'withdraw',
                      editForm: 'withdrawCancelForm',
                      editFormTitle: '拒绝通过',
                    })
                  }
                >
                  拒绝
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() =>
                    this.showAddForm({
                      id: record.id,
                      editFormRecord: record,
                      moduleCode: 'withdraw',
                      editForm: 'withdrawReviewForm',
                      editFormTitle: '提现成功',
                    })
                  }
                >
                  提现成功
                </a>
              </Fragment>
            )
          }
        },
      },
    ];

    let ps;
    if (withdraw === undefined || withdraw.pageSize === undefined) {
      ps = 5;
    } else {
      ps = withdraw.pageSize;
    }
    let tl;
    if (withdraw === undefined || withdraw.total === undefined) {
      tl = 1;
    } else {
      tl = Number(withdraw.total);
    }
    let withdrawData;
    if (withdraw === undefined) {
      withdrawData = [];
    } else {
      withdrawData = withdraw.list;
    }

    // 分页
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableListForm} />
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                dataSource={withdrawData}
                columns={columns}
                onChange={this.handleTableChange}
                expandedRowRender={record => (
                  <DescriptionList className={styles.headerList} size="small" col="2">
                    <Description term="开户银行">{record.openAccountBank}</Description>
                    <Description term="银行账号">{record.bankAccountNo}</Description>
                    <Description term="联系电话">{record.contactTel}</Description>
                    <Description term="银行账户名称">{record.bankAccountName}</Description>
                  </DescriptionList>
                )}
              />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'withdrawReviewForm' && (
          <WithdrawReviewForm
            id={editFormRecord.id}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'withdraw', saveMethodName: 'review' })}
          />
        )}
        {editForm === 'withdrawCancelForm' && (
          <WithdrawCancelForm
            id={editFormRecord.id}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'withdraw', saveMethodName: 'cancel' })}
          />
        )}
      </Fragment>
    );
  }
}
