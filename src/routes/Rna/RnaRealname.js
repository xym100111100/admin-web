import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { DatePicker, Pagination, Card, Divider, Table, Button, Radio, Input, Modal, Popconfirm, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RnaRealname.less';
import RnaRealnameForm from './RnaRealnameForm';

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
      pagination: pager,
    });
    this.setState({
      pageSize: pagination.pageSize,
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

  render() {
    const { rnarealname: { rnarealname }, loading } = this.props;
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const { RangePicker } = DatePicker;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: rnarealname.pageSize,
      total: Number(rnarealname.total),
      pageSizeOptions: ['5', '10'],
    };

    const extraContent = (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ paddingBottom: 20 }}>
        <div className={styles.extraContent}>
          <FormItem label="" style={{ marginRight: 120 }}>
            {getFieldDecorator('applyState')(
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
          <Divider type="vertical" style={{ height: 30 }} orientation="left" />
          <FormItem style={{ width: 180 }}>
            {getFieldDecorator('startApplyTime')(<RangePicker style={{ width: 250, marginLeft: -80 }} />)}
          </FormItem>
          <FormItem max="5" label="" style={{ width: 100 }}>
            {getFieldDecorator('realName')(<Input placeholder="姓名" />)}
          </FormItem>
          <FormItem label="" style={{ width: 200 }}>
            {getFieldDecorator('idCard', {
              rules: [{ pattern: /^[0-9]*$/, message: '请输入数字' }],
            })(<Input placeholder="请输入用户身份证" />)}
          </FormItem>
          <Button type="primary" htmlType="submit" style={{ marginTop: 4 }}>
            查询
          </Button>
        </div>
      </Form>
    );

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
        <Card
          className={styles.listCard}
          bordered={false}
          style={{ marginBottom: 30 }}
          bodyStyle={{ padding: '0 32px 0px 32px' }}
          extra={extraContent}
        >
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
