import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Divider, Popconfirm, Form, Input, Button, Table, Switch, Menu, Dropdown, Icon } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UserForm from './UserForm';
import styles from './UserMng.less';
import UserRoleForm from './UserRoleForm';
import UserRegForm from './UserRegForm';
import UserOrgForm from './UserOrgForm';

const FormItem = Form.Item;
const { Description } = DescriptionList;
@connect(({ sucuser, pfmuserrole, sucorg, loading }) => ({
  sucuser,
  sucorg,
  pfmuserrole,
  loading: loading.models.sucuser,
}))
@Form.create()
export default class UserMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'sucuser';
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

  // 锁定/解锁用户
  handleEnable(record) {
    this.props.dispatch({
      type: 'sucuser/enable',
      payload: { id: record.id, isLock: !record.isLock },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 解除登录密码
  removeLoginPassWord(record) {
    this.props.dispatch({
      type: 'sucuser/removeLoginPassWord',
      payload: { id: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 解除支付密码
  removePayPassWord(record) {
    this.props.dispatch({
      type: 'sucuser/removePayPassWord',
      payload: { id: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 解除微信绑定
  unbindWeChat(record) {
    this.props.dispatch({
      type: 'sucuser/unbindWeChat',
      payload: { id: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 解除QQ绑定
  unbindQQ(record) {
    this.props.dispatch({
      type: 'sucuser/unbindQQ',
      payload: { id: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 解除组织绑定
  unbindOrg(record) {
    this.props.dispatch({
      type: 'sucuserorg/del',
      payload: { id: record.id },
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
    const { sucuser: { sucuser }, pfmuserrole: { userrole }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const columns = [
      {
        title: '登录账号',
        dataIndex: 'loginName',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: '微信昵称',
        dataIndex: 'wxNickname',
      },
      {
        title: 'QQ昵称',
        dataIndex: 'qqNickname',
      },
      {
        title: '是否锁定',
        dataIndex: 'isLock',
        render: (text, record) => {
          return (
            <Fragment>
              <Switch
                checkedChildren="锁定"
                unCheckedChildren="未锁"
                checked={record.isLock}
                loading={loading}
                onChange={() => this.handleEnable(record)}
              />
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a
                onClick={() =>
                  this.showEditForm({
                    getByIdMethodName: undefined, // 初始化的时候调用getById
                    editForm: 'userRoleForm',
                    editFormTitle: '设置用户的角色',
                    editFormRecord: record, // 不请求，直接设置状态的editFormRecord（供设置组件属性时使用）
                  })
                }
              >
                角色
              </a>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  this.showEditForm({
                    getByIdMethodName: undefined, // 初始化的时候调用getById
                    editForm: 'userOrgForm',
                    editFormTitle: '设置用户的组织',
                    editFormRecord: record, // 不请求，直接设置状态的editFormRecord（供设置组件属性时使用）
                  })
                }
              >
                组织
              </a>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  this.showEditForm({
                    moduleCode: 'sucuser',
                    editForm: 'userForm',
                    editFormTitle: '编辑角色信息',
                    editFormRecord: record,
                  })
                }
              >
                编辑
              </a>
              <Divider type="vertical" />
              <MoreBtn record={record} />
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
      total: Number(sucuser.total),
    };

    const MoreBtn = props => {
      const { record } = props;
      const menu = (
        <Menu>
          <Menu.Item>
            <Popconfirm title="是否解除此账号的登录密码？" onConfirm={() => this.removeLoginPassWord(record)}>
              <a>解除登录密码</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item>
            <Popconfirm title="是否解除此账号的支付密码？" onConfirm={() => this.removePayPassWord(record)}>
              <a>解除支付密码</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item>
            <Popconfirm title="是否解除此账号的微信绑定？" onConfirm={() => this.unbindWeChat(record)}>
              <a>解绑微信</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item>
            <Popconfirm title="是否解除此账号的QQ绑定？" onConfirm={() => this.unbindQQ(record)}>
              <a>解绑QQ</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item>
            <Popconfirm title="是否解除此账号的绑定组织？" onConfirm={() => this.unbindOrg(record)}>
              <a>解绑组织</a>
            </Popconfirm>
          </Menu.Item>
        </Menu>
      );

      return (
        <Dropdown overlay={menu}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.showAddForm({ editForm: 'userRegForm', editFormTitle: '添加新用户' })}
                >
                  添加
                </Button>
                <Divider type="vertical" />
                <Button icon="reload" onClick={() => this.handleReload()}>
                  刷新
                </Button>
              </div>
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                dataSource={sucuser.list}
                columns={columns}
                onChange={this.handleTableChange}
                expandedRowRender={record => (
                  <DescriptionList className={styles.headerList} size="small" col="2">
                    <Description term="真实名字">{record.realname}</Description>
                    <Description term="是否已验证实名">
                      <Fragment>
                        <Switch
                          checkedChildren="已验证"
                          unCheckedChildren="未验证"
                          checked={record.isVerifiedRealname}
                          loading={loading}
                        />
                      </Fragment>
                    </Description>
                    <Description term="身份证号">{record.idcard}</Description>
                    <Description term="是否已验证身份证号">
                      <Fragment>
                        <Switch
                          checkedChildren="已验证"
                          unCheckedChildren="未验证"
                          checked={record.isVerifiedIdcard}
                          loading={loading}
                        />
                      </Fragment>
                    </Description>
                    <Description term="电子邮箱">{record.email}</Description>
                    <Description term="是否已验证电子邮箱">
                      <Fragment>
                        <Switch
                          checkedChildren="已验证"
                          unCheckedChildren="未验证"
                          checked={record.isVerifiedEmail}
                          loading={loading}
                        />
                      </Fragment>
                    </Description>
                    <Description term="手机号码">{record.mobile}</Description>
                    <Description term="是否已验证手机号码">
                      <Fragment>
                        <Switch
                          checkedChildren="已验证"
                          unCheckedChildren="未验证"
                          checked={record.isVerifiedMobile}
                          loading={loading}
                        />
                      </Fragment>
                    </Description>
                  </DescriptionList>
                )}
              />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'userForm' && (
          <UserForm
            id={editFormRecord.id}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'sucuser' })}
          />
        )}
        {editForm === 'userRegForm' && (
          <UserRegForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'sucuser' })}
          />
        )}
        {editForm === 'userRoleForm' && (
          <UserRoleForm
            userId={editFormRecord.id}
            visible
            width={715}
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={() =>
              this.handleSubmit({
                fields: {
                  userId: editFormRecord.id,
                  sysId: userrole.dataSource[0].sysId,
                  roleIds: userrole.targetKeys,
                },
                moduleCode: 'pfmuserrole',
                saveMethodName: 'modifyUserRoles',
              })
            }
          />
        )}
        {editForm === 'userOrgForm' && (
          <UserOrgForm
            record={editFormRecord}
            visible
            title={editFormTitle}
            width={600}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields =>
              this.handleSubmit({
                fields: {
                  id: editFormRecord.id,
                  orgId: fields.id,
                },
                moduleCode: 'sucuserorg',
              })
            }
          />
        )}
      </Fragment>
    );
  }
}
