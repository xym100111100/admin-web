import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Divider, message, Col, Icon, Card, Form, Dropdown, Input, Select, Button, Menu, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrdOrder.less';
import moment from 'moment';
import OrdOrderForm from './OrdOrderForm';
const { RangePicker } = DatePicker;

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ ordorder, user, kdicompany, kdisender, loading }) => ({
  ordorder, user, kdicompany, kdisender,
  loading: loading.models.ordorder || loading.models.user || loading.models.kdicompany || loading.models.kdisender
}))
@Form.create()
export default class OrdOrder extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'ordorder';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
      orderState: 2,
    };
    this.state.orderCode = undefined;
    this.state.record = undefined;
  }

  //初始化
  componentDidMount() {
    this.state.payloads = {
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
      orderState: this.state.options.orderState,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });

  }


  //取消订单
  cancel = (record) => {
    if (record.orderState !== 1) {
      message.success('非已下单状态不能取消订单');
      return;
    }
    let Reason = prompt('请填写取消订单原因', '用户退款');
    if (Reason === null) {
      return;
    }
    record.cancelReason = Reason;
    const { user } = this.props;
    record.cancelingOrderOpId = user.currentUser.userId;
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
    if (record.orderState !== 2) {
      message.success('非已支付状态不能取消发货');
      return;
    }
    let Reason = prompt('请填写取消发货原因', '用户退款');
    if (Reason === null) {
      return;
    }
    record.cancelReason = Reason;
    const { user } = this.props;
    record.cancelingOrderOpId = user.currentUser.userId;
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
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.orderTime !== undefined && fieldsValue.orderTime !== '' && fieldsValue.orderTime.length >= 1) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTime = undefined;
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      this.setState({
        options: {
          pageNum: fieldsValue.pageNum,
          pageSize: fieldsValue.pageSize,
          orderState: fieldsValue.orderState
        },
      });
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

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        options: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          orderState: fieldsValue.orderState
        },
      });
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

  showInput = (record) => {
    if (record.orderState !== 1) {
      message.success('非已下单状态不能修改实际金额');
      return;
    }
    this.setState({
      orderCode: record.orderCode,
    })
  }
  //隐藏input且根据情况去修改实际金额
  hidInput = (e) => {
    this.setState({
      orderCode: undefined,
    })
    if (this.state.record === undefined) return;
    if (this.state.record.realMoney === e.target.value) return;

    this.state.record.realMoney = e.target.value;
    const { user } = this.props;
    this.state.record.modifyRealveryMoneyOpId = user.currentUser.userId;
    this.props.dispatch({
      type: `${this.moduleCode}/modifyOrderRealMoney`,
      payload: this.state.record,
      callback: () => {
        this.setState({
          record: undefined,
        })
        this.handleReload(this.state.options);
      },
    });
  }

  getOrderCode = (record) => {
    this.setState({
      record: record
    })
  }

  printPage = (data) => {
    let printWindow;
    const printPage = data.printPage;
    printWindow = window.open('', '_blank');
    printWindow.document.body.innerHTML = printPage;
    printWindow.print();
    printWindow.close();
  }

  printPageAgain = (orderCode) => {
     let printWindow;
    this.props.dispatch({
      type: `${this.moduleCode}/printpage`,
      payload: { orderId: orderCode },
      callback: data => {
        if(data.length===0 || data[0].printPage===undefined){
          message.success('获取失败');
          return;
        }
        const printPage = data[0].printPage;
        printWindow = window.open('', '_blank');
        printWindow.document.body.innerHTML = printPage;
        printWindow.print();
        printWindow.close();
      }
    });

  }


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
              {getFieldDecorator('userName')(<Input placeholder="用户名/单号编号" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orderTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
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
          <a onClick={() => this.showInput(record)}>
            修改实际金额
            </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.printPageAgain(record.orderCode)}>
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

    const { ordorder: { ordorder }, loading, kdisender } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
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
        render: (text, record) => {
          if (record.orderCode === this.state.orderCode) return (<Input onPressEnter={this.hidInput.bind(this)} onInput={() => this.getOrderCode(record)} style={{ width: 60 }} onBlur={this.hidInput.bind(this)} defaultValue={record.realMoney} autoFocus />);
          if (record.orderCode !== this.state.orderCode) return record.realMoney;
        },
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
        render: (text, record) => {
          if (record.orderState === 2) {
            return (
              <Fragment  >
                <a onClick={() => this.showAddForm({
                  editFormRecord: record,
                  editForm: 'printPage',
                  editFormTitle: '选择发货信息',
                })} >
                  发货
                  </a>
                <Divider type="vertical" />
                {this.MoreBtn(record)}
              </Fragment>
            )
          } else {
            return (
              <Fragment  >
                <a style={{ color: '#C0C0C0' }}>发货</a>
                <Divider type="vertical" />
                {this.MoreBtn(record)}
              </Fragment>
            )
          }
        }
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
        {editForm === 'printPage' && (
          <OrdOrderForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => {
              let shipperInfo;
              if (fields.shipperInfo !== undefined) {
                shipperInfo = fields.shipperInfo.split('/');
                fields.shipperId = shipperInfo[0];
                fields.shipperName = shipperInfo[1];
                fields.shipperCode = shipperInfo[2];
              }
              let senderInfo;
              if (fields.senderInfo !== undefined) {
                senderInfo = fields.senderInfo.split('/');
                fields.senderName = senderInfo[0];
                fields.senderMobile = senderInfo[1];
                fields.senderProvince = senderInfo[2];
                fields.senderCity = senderInfo[3];
                fields.senderExpArea = senderInfo[4];
                fields.senderPostCode = senderInfo[5];
                fields.senderAddress = senderInfo[6];
              }
              const { user } = this.props;
              fields.orgId = user.currentUser.orgId;
              fields.senderInfo = undefined;
              let saveMethodName = editForm === 'printPage' ? 'shipmentconfirmation' : 'printpage';
              this.handleSubmit({
                fields,
                moduleCode: 'ordorder',
                saveMethodName: saveMethodName,
                callback: this.printPage
              });
            }}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
