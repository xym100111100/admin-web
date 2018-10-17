import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Switch, Popconfirm, Form, Input, Button, Table, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './WithdrawAccountMng.less';

const { Search } = Input;

const { Description } = DescriptionList;
@connect(({ withdrawaccount, loading }) => ({
    withdrawaccount,
  loading: loading.models.withdrawaccount,
}))
@Form.create()
export default class WithdrawAccountMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'withdrawaccount';
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
      type: 'withdrawaccount/list',
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
      type: 'withdrawaccount/list',
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

  render() {
    const { withdrawaccount: { withdrawaccount }, loading } = this.props;

    const columns = [
      {
        title: '用户姓名',
        dataIndex: 'userName',
      },
      {
        title: '提现类型',
        dataIndex: 'withdrawType',
        render: (text, record) => {return(text === 1 ? "银行卡" : "支付宝")},
      },
      {
        title: '开户银行',
        dataIndex: 'openAccountBank',
      },
      {
        title: '银行账号',
        dataIndex: 'bankAccountNo',
      },
      {
        title: '银行账号名称',
        dataIndex: 'bankAccountName',
      },
      {
        title: '联系电话',
        dataIndex: 'contactTel',
      },
    ];

    let ps;
    if (withdrawaccount === undefined || withdrawaccount.pageSize === undefined) {
      ps = 5;
    } else {
      ps = withdrawaccount.pageSize;
    }
    let tl;
    if (withdrawaccount === undefined || withdrawaccount.total === undefined) {
      tl = 1;
    } else {
      tl = Number(withdrawaccount.total);
    }
    let withdrawaccountData;
    if (withdrawaccount === undefined) {
        withdrawaccountData = [];
    } else {
        withdrawaccountData = withdrawaccount.list;
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
                dataSource={withdrawaccountData}
                columns={columns}
                onChange={this.handleTableChange}
              />
            </div>
          </Card>
        </PageHeaderLayout>,
      </Fragment>
    );
  }
}
