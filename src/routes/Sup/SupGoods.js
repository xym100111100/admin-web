import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Row,message, Radio, Col, Input, DatePicker, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupGoods.less';
import OnlOnlineSpecForm from '../Onl/OnlOnlineSpecForm';
//引入复制插件，报错需要yarn install
import copy from 'copy-to-clipboard';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
@connect(({ supgoods,onlonline, user, loading }) => ({ supgoods,onlonline, user, loading: loading.models.supgoods || loading.models.onlonline|| loading.models.user }))
@Form.create()
export default class supGoods extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'supgoods';
    this.state.subjectType = '';
    this.state.onlineState = '1';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
      subjectType: undefined,
      onlineState: 1,
    };
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      subjectType: '',
      onlineState: '1',
    })
    let record = this.state.options;
   record.supplierId = this.props.user.currentUser.orgId;
    //  record.supplierId = '530999450936672256';
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: record,
    });
  };

  //初始化
  componentDidMount() {
    let record = this.state.options;
    record.supplierId = this.props.user.currentUser.orgId;
    // record.supplierId = '530999450936672256';
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: record,
    });

  }

  //点击submit查询
  list = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.onlineTime !== undefined && fieldsValue.onlineTime !== '' && fieldsValue.onlineTime.length >= 1) {
        fieldsValue.onlineTimeEnd = fieldsValue.onlineTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.onlineTimeStart = fieldsValue.onlineTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.onlineTime = undefined;
      }

      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
    //  fieldsValue.supplierId = '530999450936672256';
      fieldsValue.supplierId = this.props.user.currentUser.orgId;

      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  //改变页数查询
  handleTableChange = pagination => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.onlineTime !== undefined && fieldsValue.onlineTime !== '' && fieldsValue.onlineTime.length >= 1) {
        fieldsValue.onlineTimeEnd = fieldsValue.onlineTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.onlineTimeStart = fieldsValue.onlineTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.onlineTime = undefined;
      }

      fieldsValue.pageNum = pagination.current,
      fieldsValue.pageSize = pagination.pageSize,
      fieldsValue.supplierId = '530999450936672256';
      

      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });

  }

  /**
   * 这里只是为了页面和传输的数据一致，先设置状态在执行方法
   */
  getForSubjectType = () => {
    this.setState(
      {
        temp: 'temp',
      },
      () => this.list()
    );
  }

  /**
   * 这里只是为了页面和传输的数据一致，先设置状态在执行方法
   */
  getForOnlineState = () => {
    this.setState(
      {
        temp: 'temp',
      },
      () => this.list()
    );
  }

  /**
   * 复制商品链接
   */
  copyUrl=(id,onlineTitle)=>{
    let url="https://www.duamai.com/wbolybusiness/wechat/goods/goodsDetail.htm?onlineId=";
    url+=id;
    url+="&promoterId="+this.props.user.currentUser.userId;
    copy(url);
    message.success('复制<'+onlineTitle+'>链接成功,快去发送给微信好友推广您的商品吧!');
  }

  /**
   * 搜索组件
   */
  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem   >
              {getFieldDecorator('subjectType', {
                initialValue: this.state.subjectType,
              })(
                <RadioGroup style={{ width: 280 }} >
                  <RadioButton onClick={() => this.getForSubjectType()} value=''>
                    全部
                   </RadioButton>
                  <RadioButton onClick={() => this.getForSubjectType()} value='0'>
                    普通商品
                   </RadioButton>
                  <RadioButton onClick={() => this.getForSubjectType()} value='1'>
                    全返商品
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="">
              {getFieldDecorator('onlineTitle')(<Input placeholder="商品名称" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('onlineTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  placeholder={['上线开始日期', '上线结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}   >
            <span>
              <Button onClick={this.list} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem   >
              {getFieldDecorator('onlineState', {
                initialValue: this.state.onlineState,
              })(
                <RadioGroup style={{ width: 280 }} >
                  <RadioButton onClick={() => this.getForOnlineState()} value=''>
                    全部
                   </RadioButton>
                  <RadioButton onClick={() => this.getForOnlineState()} value='1'>
                    已上线
                   </RadioButton>
                  <RadioButton onClick={() => this.getForOnlineState()} value='0'>
                    已下线
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { supgoods: { supgoods }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    let ps;
    if (supgoods === undefined || supgoods.pageSize === undefined) {
      ps = 5;
    } else {
      ps = supgoods.pageSize;
    }
    let tl;
    if (supgoods === undefined || supgoods.total === undefined) {
      tl = 1;
    } else {
      tl = Number(supgoods.total);
    }
    let suporderData;
    if (supgoods === undefined) {
      suporderData = [];
    } else {
      suporderData = supgoods.list;
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
        title: '商品名称',
        dataIndex: 'onlineTitle',
      },
      {
        title: '类型',
        dataIndex: 'subjectType',
        render: (text, record) => {
          if (record.subjectType == 0) return '普通商品';
          if (record.subjectType == 1) return '全返商品';
        }

      },
      {
        title: '上线状态',
        dataIndex: 'onlineState',
        render: (text, record) => {
          if (record.onlineState == 0) return '已下线';
          if (record.onlineState == 1) return '已上线';
        }
      },
      {
        title: '上线时间',
        dataIndex: 'onlineTime',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a
              onClick={() =>
                this.showAddForm({
                  id: record.id,
                  editForm: 'onlOnlineSpecForm',
                  editFormRecord: record,
                  editFormTitle: '规格信息',
                })
              }
            >
              查询规格信息
            </a>
            <br/>
            <a
              onClick={() =>this.copyUrl(record.id,record.onlineTitle)}
            >
              复制商品链接
            </a>
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                {this.renderSearchForm()}
              </div>
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                dataSource={suporderData}
                columns={columns}
                onChange={this.handleTableChange}
              />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'onlOnlineSpecForm' && (
          <OnlOnlineSpecForm
            visible
            title={editFormTitle}
            width={1000}
            height={490}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
      </Fragment>
    );
  }
}
