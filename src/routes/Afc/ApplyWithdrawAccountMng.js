import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Popconfirm, Form, Input, Button, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './ApplyWithdrawAccountMng.less';
import ApplyWithdrawAccountForm from './ApplyWithdrawAccountForm';

const { Search } = Input;

const { Description } = DescriptionList;
@connect(({ afcapplywithdrawaccount, loading }) => ({
  afcapplywithdrawaccount,
  loading: loading.models.afcapplywithdrawaccount,
}))
@Form.create()
export default class ApplyWithdrawAccountMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'afcapplywithdrawaccount';
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
      type: 'afcapplywithdrawaccount/list',
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
      type: 'afcapplywithdrawaccount/list',
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
      type: `afcapplywithdrawaccount/review`,
      payload: { id: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 查询
  selectApplyWithdrawAccount = (e) => {
    let paload = {};
    paload.bankAccountName = e;
    paload.pageNum = this.state.options.pageNum;
    paload.pageSize = this.state.options.pageSize;
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: paload,
    });
  }

  render() {
    const { afcapplywithdrawaccount: { afcapplywithdrawaccount }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const columns = [
      {
        title: '申请人',
        dataIndex: 'applicantName',
      },
      {
        title: '绑定账户ID',
        dataIndex: 'accountId',
      },
      {
        title: '提现类型',
        dataIndex: 'withdrawType',
        render: (text, record) => {return(text === 1 ? "银行卡" : "支付宝")},
      },
      {
        title: '申请状态',
        dataIndex: 'flowState',
        render: (text, record) => {
            let flowState;
            if (text === -1) {
                flowState = "已拒绝";
            } else if (text === 1) {
                flowState = "待审核";
            } else if (text == 2) {
                flowState = "已审核";
            }
            return(flowState)
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
          if (record.flowState === 1) {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showAddForm({
                      id: record.id,
                      editFormRecord: record,
                      moduleCode: 'afcapplywithdrawaccount',
                      editForm: 'applyWithdrawAccountForm',
                      editFormTitle: '拒绝通过',
                    })
                  }
                >
                  拒绝
                </a>
                <Divider type="vertical" />
                <Popconfirm title="是否要通过此申请审核？" onConfirm={() => this.reviewThrough(record)}>
                  <a>审核</a>
                </Popconfirm>
              </Fragment>
            );
          }
        },
      },
    ];

    let ps;
    if (afcapplywithdrawaccount === undefined || afcapplywithdrawaccount.pageSize === undefined) {
      ps = 5;
    } else {
      ps = afcapplywithdrawaccount.pageSize;
    }
    let tl;
    if (afcapplywithdrawaccount === undefined || afcapplywithdrawaccount.total === undefined) {
      tl = 1;
    } else {
      tl = Number(afcapplywithdrawaccount.total);
    }
    let afcapplywithdrawaccountData;
    if (afcapplywithdrawaccount === undefined) {
        afcapplywithdrawaccountData = [];
    } else {
        afcapplywithdrawaccountData = afcapplywithdrawaccount.list;
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
                  <Button icon="reload" onClick={() => this.handleReload()}>
                    刷新
                  </Button>
                </div>
                <Search style={{ width: 220 }} placeholder="银行账户名称" onSearch={this.selectApplyWithdrawAccount} />
              </div>
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                dataSource={afcapplywithdrawaccountData}
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
        {editForm === 'applyWithdrawAccountForm' && (
          <ApplyWithdrawAccountForm
            id={editFormRecord.id}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'afcapplywithdrawaccount', saveMethodName: 'reject'})}
          />
        )}
      </Fragment>
    );
  }
}
