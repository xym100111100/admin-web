import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, message, Col, Card, Divider, Popconfirm, Form, Input, Button, Table, Switch, Menu, Dropdown, Icon } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UserForm from './UserForm';
import styles from './UserMng.less';
import UserRoleForm from './UserRoleForm';
import UserRegForm from './UserRegForm';
import UserOrgForm from './UserOrgForm';
import EditPwForm from './EditPwForm';
import UserChargeForm from './UserChargeForm';
import UserPointForm from './UserPointForm'
import IntegralPointsForm from './IntegralPointsForm'

const { Search } = Input;

const FormItem = Form.Item;
const { Description } = DescriptionList;
@connect(({ sucuser, pntList, pfmuserrole, sucorg, loading }) => ({
  sucuser,
  pntList,
  sucorg,
  pfmuserrole,
  loading: loading.models.sucuser || loading.models.pntList
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
        keys: values.keys,
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
    let Reason = null;
    if (record.isLock === false) {
      Reason = prompt('请填写锁定原因');
    } else {
      Reason = prompt('请填写解锁原因');
    }
    if (Reason === null) {
      return;
    }
    if (Reason === "" && record.isLock === false) {
      message.error("锁定原因不能为空");
      return;
    } else if (Reason === "" && record.isLock === true) {
      message.error("解锁原因不能为空");
      return;
    }
    this.props.dispatch({
      type: 'sucuser/enable',
      payload: { id: record.id, isLock: !record.isLock },
      callback: () => {
        this.handleReload();
      },
    });
  }

  /**
   * 设置为测试号
   */
  setIsTester = (record) => {
    this.props.dispatch({
      type: 'sucuser/modify',
      payload: { id: record.id, isTester: !record.isTester },
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

  selectUser = (e) => {
    let paload = {};
    paload.keys = e;
    paload.pageNum = this.state.options.pageNum;
    paload.pageSize = this.state.options.pageSize;
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: paload,
    });
  }

  // 搜索  原先的input查询参数为keys
  renderSearchForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={16} sm={24} >
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.showEditForm({ editFormRecord: { isOrgAdd: false }, editForm: 'userRegForm', editFormTitle: '添加新用户' })}
            >
              添加
                </Button>
            <Divider type="vertical" />
            <Button icon="reload" onClick={() => this.handleReload()}>
              刷新
            </Button>
          </Col>
          <Col md={8} sm={24} >
            <Search placeholder="登录账号/昵称/微信昵称/QQ昵称/手机号码" onSearch={this.selectUser} />
          </Col>
        </Row>
      </Form>
    );
  }


  /**
   * 设置用户登录密码
   */
  setLoginPw = (record, wxOpenid) => {
    if (wxOpenid !== undefined) {
      message.error("用户绑定了微信,请该用户在微信自行修改");
      return;
    }
    this.showEditForm({
      moduleCode: 'sucuser',
      editForm: 'EditPwForm',
      editFormTitle: '输入用户登录密码',
      editFormRecord: record,
    })
  }
  /**
   * 用户账号充值
   */
  personCharge = (record, wxOpenid) => {
    console.info(record);
    console.info(wxOpenid);
    this.showEditForm({
      moduleCode: 'sucuser',
      editForm: 'UserChargeForm',
      editFormTitle: '账号充值',
      editFormRecord: record,
    })
  }

  /**
   * 用户积分充值
   */
  integralPoints = (record, id) => {
    this.showEditForm({
      moduleCode: 'sucuser',
      editForm: 'integralPointsForm',
      editFormTitle: '积分充值',
      editFormRecord: record,
    })
  }

  /**
   * 用户积分明细
   */
  inquiryPoints = (record) => {
    //console.info(record.id);
    this.showEditForm({
      moduleCode: 'sucuser',
      editForm: 'userPointForm',
      editFormTitle: '积分明细',
      editFormRecord: record,
    })
  }

  /**
   * 积分充值
   */
  IntegralPoint = (record) => {
    const fields = record.fields;
    fields.accountId = fields.id;
    fields.oldPoint = fields.point;
    fields.oldModifiedTimestamp = fields.modifiedTimestamp;

    //console.info(fields);
    this.props.dispatch({
      type: 'pntList/recharge',
      payload: record.fields,
      callback: () => {
        this.setState({ editForm: undefined })
        this.handleReload();
      }
    })
  }

  render() {
    const { sucuser: { sucuser }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const columns = [
      {
        title: '登录账号',
        dataIndex: 'loginName',
        render: (text, record) => {
          return (
            <div>
              <span>账号：{record.loginName}</span>
              <br />
              <span>id:{record.id}</span>
              <p>  <span style={{ marginRight: 10 }} >总积分:{record.point}</span><a onClick={() => this.inquiryPoints(record)} >积分明细</a></p>
            </div>
          )
        }
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
        title: '是否测试号',
        dataIndex: 'isTester',
        render: (text, record) => {
          return (
            <Fragment>
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={record.isTester}
                loading={loading}
                onChange={() => this.setIsTester(record)}
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
                    editForm: 'userRoleForm',
                    editFormTitle: '设置用户的角色',
                    editFormRecord: record, // 不设置ID不请求，直接设置状态的editFormRecord（供设置组件属性时使用）
                  })
                }
              >
                角色
              </a>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  this.showAddForm({
                    editForm: 'userOrgForm',
                    editFormTitle: '设置用户的组织',
                    editFormRecord: record, // 不设置ID不请求，直接设置状态的editFormRecord（供设置组件属性时使用）
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
                    editFormTitle: '编辑用户信息',
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

    let ps;
    if (sucuser === undefined || sucuser.pageSize === undefined) {
      ps = 5;
    } else {
      ps = sucuser.pageSize;
    }
    let tl;
    if (sucuser === undefined || sucuser.total === undefined) {
      tl = 1;
    } else {
      tl = Number(sucuser.total);
    }
    let sucuserData;
    if (sucuser === undefined) {
      sucuserData = [];
    } else {
      sucuserData = sucuser.list;
    }

    // 分页
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };

    const MoreBtn = props => {
      const { record } = props;
      const menu = (
        <Menu>
          <Menu.Item>
            <a onClick={() => this.personCharge(record, record.wxOpenid)} >账号充值</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.integralPoints(record, record.id)} >积分充值</a>
          </Menu.Item>
          <Menu.Item>
            <Popconfirm title="是否重置此账号的登录密码？" onConfirm={() => this.removeLoginPassWord(record)}>
              <a>重置登录密码</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.setLoginPw(record, record.wxOpenid)} >设置登录密码</a>
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
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                dataSource={sucuserData}
                columns={columns}
                onChange={this.handleTableChange}
                expandedRowRender={record => (
                  <DescriptionList className={styles.headerList} size="small" col="2">
                    <Description term="id">{record.id}</Description>
                    <Description term="总积分">{record.point}</Description>
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
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'sucuser', saveMethodName: 'add' })}
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
          />
        )}
        {editForm === 'userPointForm' && (
          <UserPointForm
            id={editFormRecord.id}
            visible
            width={1200}
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
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
        {editForm === "EditPwForm" && (
          <EditPwForm
            record={editFormRecord}
            visible
            title={editFormTitle}
            width={600}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields =>
              this.handleSubmit({
                fields,
                saveMethodName: 'setLoginPw',
                moduleCode: 'sucuser',
              })
            }
          />
        )}
        {editForm === "UserChargeForm" && (
          <UserChargeForm
            record={editFormRecord}
            visible
            title={editFormTitle}
            width={600}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields =>
              this.handleSubmit({
                fields,
                saveMethodName: 'charge',
                moduleCode: 'sucuser',
              })
            }
          />
        )}
        {editForm === "integralPointsForm" && (
          <IntegralPointsForm
            record={editFormRecord}
            visible
            title={editFormTitle}
            width={600}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields =>
              this.IntegralPoint({ fields })
            }
          />
        )}
      </Fragment>
    );
  }
}
