import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Row, Col, Table, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import SearchForm from 'components/Rebue/SearchForm';
import styles from './OrgUserForm.less';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ sucuser, sucuserorg }) => ({
  sucuser: sucuser,
  sucuserorg,
}))
@SearchForm
export default class OrgUserForm extends PureComponent {
  state = {
    options: {},
  };

  // 重置from
  handleFormReset = () => {
    this.props.form.resetFields();
  };

  // 分页翻页
  handleTableChange = pagination => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: 'sucuser/list',
        payload: {
          users: values.users,
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
        callback: () => {
          this.forceUpdate();
        },
      });
    });
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      this.handleReload({
        users: values.users,
        pageNum: 1,
        pageSize: 5,
      });
    });
  };

  // 刷新
  handleReload(params) {
    if (params) {
      Object.assign(this.state.options, params);
    }
    const payload = this.state.options;

    // 刷新
    this.props.dispatch({
      type: `sucuser/list`,
      payload,
    });
  }

  // 用户搜索
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

  handleAdd(userRecord) {
    const { record } = this.props;
    this.props.dispatch({
      type: `sucuserorg/add`,
      payload: { id: userRecord.id, orgId: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }

  render() {
    const { sucuser: { sucuser }, record } = this.props;
    const roles = record;
    // 分页
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: Number(sucuser.total),
    };
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
              <Popconfirm
                title={'是否要将此用户添加到' + roles.name + '这个组织?'}
                onConfirm={() => this.handleAdd(record)}
              >
                <a>添加</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <Table
            rowKey="id"
            pagination={paginationProps}
            onChange={this.handleTableChange}
            dataSource={sucuser.list}
            columns={userColumns}
          />
        </div>
      </div>
    );
  }
}
