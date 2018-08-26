import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { DatePicker, Row, Col, Card, Divider, Table, Button, Radio, Input, Popconfirm, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RnaRealname.less';
import RnaRealnameForm from './RnaRealnameForm';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@Form.create()
@connect(({ rnarealname, loading }) => ({ rnarealname, loading: loading.models.rnarealname }))
export default class RnaRealname extends SimpleMng {
  state = { pageSize: 5 };
  constructor() {
    super();
    this.moduleCode = 'rnarealname';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
  }

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
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  inspect(fields, where) {
    if (where === 3) {
      let Reason = prompt('请填写拒绝原因', '身份信息不符合');
      if (Reason === null) {
        return;
      }
      fields.rejectReason = Reason;
      fields.applyState = 3;
    } else if (where === 2) {
      fields.rejectReason = '';
      fields.applyState = 2;
    }
    this.props.dispatch({
      type: `${this.moduleCode}/modify`,
      payload: { ...fields },
      callback: () => {
        this.handleReload();
      },
    });
  }

  listState(state) {
    const payload = {
      pageNum: 1,
      pageSize: this.state.pageSize,
      applyState: state,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: payload,
    });
  }

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
          <Col md={8} sm={24}>
            <FormItem style={{ float: 'left' }}>
              {getFieldDecorator('applyState', {
                initialValue: '1',
              })(
                <RadioGroup>
                  <RadioButton onClick={() => this.listState('')} value="">
                    全部
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(1)} value="1">
                    待审核
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(2)} value="2">
                    已通过
                  </RadioButton>
                  <RadioButton onClick={() => this.listState(3)} value="3">
                    已拒绝
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
            <Divider type="vertical" style={{ height: 22, float: 'right', marginTop: '2%', marginRight: '9%' }} />
          </Col>
          <Col md={7} sm={24} style={{ marginRight: 6 }}>
            <FormItem>{getFieldDecorator('startApplyTime')(<RangePicker />)}</FormItem>
          </Col>
          <Col md={3} sm={24} style={{ marginRight: 6 }}>
            <FormItem>{getFieldDecorator('realName')(<Input placeholder="姓名" />)}</FormItem>
          </Col>
          <Col md={4} sm={24} style={{ marginRight: 6 }}>
            <FormItem>
              {getFieldDecorator('idCard', {
                rules: [{ pattern: /^[0-9]*$/, message: '请输入数字' }],
              })(<Input placeholder="身份证号" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
            <FormItem>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { rnarealname: { rnarealname }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: rnarealname.pageSize,
      total: Number(rnarealname.total),
      pageSizeOptions: ['5', '10'],
    };

    const columns = [
      {
        title: '姓名',
        dataIndex: 'realName',
      },
      {
        title: '身份证号',
        dataIndex: 'idCard',
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
      },
      {
        title: '申请状态',
        dataIndex: 'applyState',
        render: (text, record) => {
          if (record.applyState === 1) return '待审核';
          if (record.applyState === 2) return '已通过';
          if (record.applyState === 3) return '已拒绝';
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a
              onClick={() =>
                this.showEditForm({ id: record.id, editForm: 'RnaRealnameForm', editFormTitle: '用户身份证信息' })
              }
            >
              详细
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否通过申请？" onConfirm={() => this.inspect(record, 2)}>
              <a>通过</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否拒绝申请？" onConfirm={() => this.inspect(record, 3)}>
              <a>拒绝</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="实名认证审核">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleTableChange}
              dataSource={rnarealname.list}
              columns={columns}
            />
          </div>
        </Card>
        {editForm === 'RnaRealnameForm' && (
          <RnaRealnameForm
            width={1000}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave({ fields })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
