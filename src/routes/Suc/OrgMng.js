import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Divider, Switch, Popconfirm, Form, Input, Button, Table, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrgMng.less';
import OrgForm from './OrgForm';
import SlrShopForm from '../Slr/SlrShopForm'
import UserTransferForm from './UserTransferForm';

const { Search } = Input;

@connect(({ sucorg, slrshop, loading, sucuserorg }) => ({
  sucorg,
  slrshop,
  sucuserorg,
  loading: loading.models.sucorg,
}))
@Form.create()
export default class OrgMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'sucorg';
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
      type: 'sucuserorg/list',
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
      type: 'sucuserorg/list',
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

  // 删除用户组织
  handleDelUser(record) {
    const { selectedRows } = this.state;
    this.props.dispatch({
      type: `sucuserorg/del`,
      payload: {
        id: record.id,
      },
      callback: () => {
        this.handleUserReload(selectedRows);
      },
    });
  }

  // 启用/禁用组织
  handleEnable(record) {
    this.props.dispatch({
      type: `sucorg/enable`,
      payload: { id: record.id, isEnabled: !record.isEnabled },
      callback: () => {
        this.handleReload();
      },
    });
  }

  render() {
    const { sucorg: { sucorg }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const columns = [
      {
        title: '组织名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '联系方式',
        dataIndex: 'contact',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        width: 110,
        render: (text, record) => {
          return (
            <Fragment>
              <Switch
                checkedChildren="启用"
                unCheckedChildren="停用"
                checked={record.isEnabled}
                loading={loading}
                onChange={() => this.handleEnable(record)}
              />
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        width: 170,
        render: (text, record) => {
          return (
            <Fragment>
              <a
                onClick={() =>
                  this.showEditForm({
                    editFormRecord: record,
                    id: record.id,
                    moduleCode: 'sucuserorg',
                    getByIdMethodName: 'listAddedAndUnaddedUsers',
                    editForm: 'orgUserForm',
                    editFormTitle: '设置组织的用户',
                  })
                }
              >
                用户
              </a>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  this.showEditForm({
                    id: record.id,
                    moduleCode: 'sucorg',
                    editForm: 'orgForm',
                    editFormTitle: '编辑组织信息',
                  })
                }
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.showAddForm({ editFormRecord: record, editForm: 'SlrShopForm', editFormTitle: '添加店铺' })}>
                添加店铺
              </a>
            </Fragment>
          );
        },
      },
    ];

    let ps;
    if (sucorg === undefined || sucorg.pageSize === undefined) {
      ps = 5;
    } else {
      ps = sucorg.pageSize;
    }
    let tl;
    if (sucorg === undefined || sucorg.total === undefined) {
      tl = 1;
    } else {
      tl = Number(sucorg.total);
    }
    let sucorgData;
    if (sucorg === undefined) {
      sucorgData = [];
    } else {
      sucorgData = sucorg.list;
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
                dataSource={sucorgData}
                columns={columns}
                onChange={this.handleTableChange}
              />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'orgForm' && (
          <OrgForm
            id={editFormRecord.id}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'sucorg' })}
          />
        )}
        {editForm === 'orgUserForm' && (
          <UserTransferForm
            id={editFormRecord.id}
            modelName="sucuserorg" //
            visible
            title={editFormTitle}
            width={815}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}

        {editForm === 'SlrShopForm' && (
          <SlrShopForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'slrshop' })}
          />
        )}
      </Fragment>
    );
  }
}
