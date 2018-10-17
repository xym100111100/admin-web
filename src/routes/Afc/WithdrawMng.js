import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Switch, Popconfirm, Form, Input, Button, Table, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './WithdrawMng.less';
import WithdrawReviewForm from './WithdrawReviewForm';
import WithdrawCancelForm from './WithdrawCancelForm';

const { Search } = Input;

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

  // 审核通过
  reviewThrough(record) {
    this.props.dispatch({
      type: `withdraw/review`,
      payload: { id: record.id },
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
        title: '提现状态状态',
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
                      editFormTitle: '审核通过',
                    })
                  }
                >
                  审核
                </a>
              </Fragment>
            );
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
              <div className={styles.tableListOperator}>
                <div style={{ flexGrow: 1 }}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.showAddForm({ editForm: 'orgForm', editFormTitle: '添加新组织' })}
                  >
                    添加
                  </Button>
                  <Divider type="vertical" />
                  <Button icon="reload" onClick={() => this.handleReload()}>
                    刷新
                  </Button>
                  <Divider type="vertical" />
                </div>
                <Divider type="vertical" />
                <Search style={{ width: 220 }} placeholder="组织名称/描述" onSearch={this.handleSearch} />
              </div>
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
