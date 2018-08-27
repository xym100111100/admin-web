import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Divider, Switch, Popconfirm, Form, Input, Button, Table, List, Tooltip } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrgMng.less';
import OrgForm from './OrgForm';
import OrgUserForm from './OrgUserForm';

const FormItem = Form.Item;
@connect(({ sucorg, loading, sucuserorg }) => ({
  sucorg,
  sucuserorg,
  loading: loading.models.sucuserorg,
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

  // 重置from
  handleFormReset = () => {
    this.props.form.resetFields();
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
        this.setState({ selectedRows: selectedRows });
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
    console.log(record);
    this.props.dispatch({
      type: `sucorg/enable`,
      payload: { id: record.id, isEnabled: !record.isEnabled },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 搜索
  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('users')(<Input placeholder="登录账号/昵称/微信昵称/QQ昵称/手机号码/QQ邮箱" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { sucorg: { sucorg }, sucuserorg: { sucuserorg }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const columns = [
      {
        title: '组织名称',
        dataIndex: 'name',
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.remark}>
              {record.name}
            </Tooltip>
          );
        },
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        render: (text, record) => {
          return (
            <Fragment>
              <Switch checked={record.isEnabled} loading={loading} onChange={() => this.handleEnable(record)} />
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <Fragment>
                <Divider type="vertical" />
                <List.Item
                  actions={[
                    <a
                      onClick={() =>
                        this.showAddForm({
                          editForm: 'orgUserForm',
                          editFormTitle: '添加用户',
                          editFormRecord: record,
                        })
                      }
                    >
                      添加用户
                    </a>,
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
                    </a>,
                    <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                      <a>删除</a>
                    </Popconfirm>,
                  ]}
                />
                <Divider type="vertical" />
              </Fragment>
            </Fragment>
          );
        },
      },
    ];

    const userColumns = [
      {
        title: '登录名称',
        dataIndex: 'loginName',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: 'QQ昵称',
        dataIndex: 'qqNickname',
      },
      {
        title: '微信昵称',
        dataIndex: 'wxNickname',
      },
      {
        title: '真实姓名',
        dataIndex: 'realname',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDelUser(record)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];

    // 分页
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: Number(sucorg.total),
    };

    // 分页
    const paginationPropsByuser = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: Number(sucuserorg.total),
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.handleUserReload(selectedRows);
      },
      type: 'radio',
    };

    return (
      <PageHeaderLayout title="组织信息管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
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
            </div>
            <Row gutter={16}>
              {
                <Col span={8}>
                  <Card title="组织">
                    <Table
                      showHeader={false}
                      rowKey="id"
                      pagination={paginationProps}
                      loading={loading}
                      dataSource={sucorg.list}
                      columns={columns}
                      rowSelection={rowSelection}
                      onChange={this.handleTableChange}
                    />
                  </Card>
                </Col>
              }
              <Col span={16}>
                <Card title="用户">
                  {
                    <Table
                      rowKey="id"
                      pagination={paginationPropsByuser}
                      onChange={this.handleTableChanges}
                      dataSource={sucuserorg.list}
                      columns={userColumns}
                    />
                  }
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
        {editForm === 'orgForm' && (
          <OrgForm
            visible
            id={editFormRecord.id}
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave({ fields, moduleCode: 'sucorg' })}
          />
        )}
        {editForm === 'orgUserForm' && (
          <OrgUserForm
            visible
            loading={loading}
            title={editFormTitle}
            width={1200}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave({ fields, moduleCode: 'sucuser' })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
