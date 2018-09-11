import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Divider, Col, Icon, Card, Form, Dropdown, Popconfirm, Input, Select, Button, Menu, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrdOrder.less';
import moment from 'moment';
import OrdOrderForm from './OrdOrderForm';


const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ ordorder, loading }) => ({
  ordorder,
  loading: loading.models.ordorder
}))
@Form.create()
export default class OrdOrder extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'ordorder';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
      orderState:2,
    };

  }

  //初始化
  componentDidMount() {
    // let {user} =this.props
    // let orgId=user.currentUser.orgId
    //这里连调的时候先写死orgId来给下面需要的地方用
    this.state.payloads = {
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
      orderState:this.state.options.orderState,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });

  }

  //取消订单
  cancel = (record) => {
    this.props.dispatch({
      type: `${this.moduleCode}/cancel`,
      payload: record,
      callback: () => {
        this.handleReload(this.state.options);
      },
    });
  }

  //取消发货
  canceldelivery = (record) => {
    this.props.dispatch({
      type: `${this.moduleCode}/canceldelivery`,
      payload: record,
      callback: () => {
        this.handleReload(this.state.options);
      },
    });
  }


  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });
  };

  //点击submit查询
  list = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.userName;
      if (info !== undefined) {
        if (/^[0-9]+$/.test(info)) {
          fieldsValue.orderCode = info;
          fieldsValue.userName = undefined;
        } else {
          fieldsValue.orderCode = undefined;
          fieldsValue.userName = info;
        }
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.orderTime !== undefined && fieldsValue.orderTime !== '' && fieldsValue.orderTime.length >= 1) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTime = undefined;
      }
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  //改变页数查询
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
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.receiverName;
      if (info !== undefined) {
        if (/^[0-9]+$/.test(info)) {
          fieldsValue.orderCode = info;
          fieldsValue.userName = undefined;
        } else {
          fieldsValue.orderCode = undefined;
          fieldsValue.userName = info;
        }
      }
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.orderTime !== undefined && fieldsValue.orderTime !== '' && fieldsValue.orderTime.length >= 1) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTime = undefined;
      }
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  //禁止选择当前日期后的
  disabledDate = current => {
    return current && current > moment().endOf('day');
  };


  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { editFormRecord } = this.state;
    const orgId = 253274870;
    editFormRecord.orgId = orgId;
    return (
      <Form onSubmit={this.list} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('userName')(<Input placeholder="用户姓名/单号编号" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orderTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: '100%' }}
                  placeholder={['下单开始日期', '下单结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orderState', {
                initialValue: '2'
              })(
                <Select placeholder="订单状态" style={{ width: '100%' }}>
                  <Option value="1">已下单</Option>
                  <Option value="2">已支付</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">已签收</Option>
                  <Option value="5">已结算</Option>
                  <Option value="-1">做废</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  MoreBtn = (record) => {
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.cancel(record)}>
            取消订单
            </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.canceldelivery(record)}>
            取消发货
            </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.showEditForm({ id: record.id, editForm: 'sysForm', editFormTitle: '编辑系统信息' })}>
            修改实际金额
            </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.showEditForm({ id: record.id, editForm: 'sysForm', editFormTitle: '编辑系统信息' })}>
            重新打印快递单
            </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    )
  }

  render() {
    const { ordorder: { ordorder }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;



    let orgId = 253274870;
    let ps;
    if (ordorder === undefined || ordorder.pageSize === undefined) {
      ps = 5;
    } else {
      ps = ordorder.pageSize;
    }
    let tl;
    if (ordorder === undefined || ordorder.total === undefined) {
      tl = 1;
    } else {
      tl = Number(ordorder.total);
    }
    let kdilogisticData;
    if (ordorder === undefined) {
      kdilogisticData = [];
    } else {
      kdilogisticData = ordorder.list;
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        key: 'orderCode',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        width: 150,
      },
      {
        title: '商品',
        dataIndex: 'orderTitle',
        key: 'orderTitle',
        width: 150,
      },
      {
        title: '下单金额',
        dataIndex: 'orderMoney',
        key: 'orderMoney',
      },
      {
        title: '实际金额',
        dataIndex: 'realMoney',
        key: 'realMoney',
      },
      {
        title: '状态',
        dataIndex: 'orderState',
        key: 'orderState',
        render: (text, record) => {
          if (record.orderState === -1) return '做废';
          if (record.orderState === 1) return '已下单';
          if (record.orderState === 2) return '已支付';
          if (record.orderState === 3) return '已发货';
          if (record.orderState === 4) return '已签收';
          if (record.orderState === 5) return '已结算';
        },
      },

      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        width: 100,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment  >
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
              <a>发货</a>
            </Popconfirm>
            <Divider type="vertical" />
            {this.MoreBtn(record)}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="快递订单管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="orderCode"
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleTableChange}
              dataSource={kdilogisticData}
              expandedRowRender={record => (
                <p >
                  <span><b>收件人姓名:</b>{record.receiverName !== undefined && (record.receiverName)}</span>
                  <span style={{ paddingLeft: '15px' }}><b>收件人手机:</b>{record.receiverMobile !== undefined && (record.receiverMobile)}</span>
                  <span style={{ paddingLeft: '15px' }}><b>收件人地址:</b>{record.receiverProvince !== undefined && (
                    record.receiverProvince + record.receiverCity + record.receiverExpArea)}</span>
                </p>
              )}
              columns={columns}
            />
          </div>
        </Card>
        {editForm === 'kdiEntry' && (
          <OrdOrderForm
            width={900}
            visible
            isShowResetButton
            orgId={orgId}
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onNext={fields => this.handleSave({ fields })}
            onSubmit={fields => this.handleSubmit({ fields })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
