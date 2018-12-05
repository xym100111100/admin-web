import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, StandardFormRow, Col, Card, Form, Input, Select, Button, Table, DatePicker,Checkbox ,Tabs} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TagSelect from 'components/TagSelect';
//import StandardFormRow from 'components/StandardFormRow';
import styles from './afcflow.less';
//import styles from './Applications.less';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({afcflow, loading }) => ({
  afcflow,
  loading: loading.models.afcflow,
}))
@Form.create()
export default class FlowMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'afcflow';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
    this.state.switchTab = 'orgList';
  }

  //初始化
  componentDidMount() {
    this.state.payloads = {
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/personList`,
      payload: this.state.payloads,
    });
  }
  
  //重置
  personFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: `${this.moduleCode}/personList`,
      payload: this.state.payloads,
    });
  };

   //重置
   orgFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: `${this.moduleCode}/orgList`,
      payload: this.state.payloads,
    });
  };

  switchTab = () =>{
    const { switchTab } = this.state;
    console.info(switchTab);
    if(switchTab=='orgList'){
      this.orgFormReset();
      this.setState({switchTab:'personList'});
    }else if(switchTab=='personList'){
      this.personFormReset();
      this.setState({switchTab:'orgList'});
    }
   
  }

  //点击submit查询
  personList = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.userInfo;
      if (info !== undefined) {
        let reg = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.userMobile = info;
          fieldsValue.receiverName = undefined;
        }else{
          fieldsValue.accountName = info;
        }
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.tradeTime !== undefined && fieldsValue.tradeTime !== '' && fieldsValue.tradeTime.length >= 1) {
        fieldsValue.tradeTimeEnd = fieldsValue.tradeTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTimeStart = fieldsValue.tradeTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTime = undefined;
      }
      this.props.dispatch({
        type: `${this.moduleCode}/personList`,
        payload: fieldsValue,
      });
    });
  };

  orgList = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.userInfo;
      if (info !== undefined) {
        let reg = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.userMobile = info;
          fieldsValue.receiverName = undefined;
        }else{
          fieldsValue.accountName = info;
        }
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.tradeTime !== undefined && fieldsValue.tradeTime !== '' && fieldsValue.tradeTime.length >= 1) {
        console.info(fieldsValue.tradeTime[1]);
        fieldsValue.tradeTimeEnd = fieldsValue.tradeTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTimeStart = fieldsValue.tradeTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTime = undefined;
      }
      console.info(fieldsValue);
      this.props.dispatch({
        type: `${this.moduleCode}/orgList`,
        payload: fieldsValue,
      });
    });
  };

  //改变页数查询
  personTableChange = pagination => {
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
      let info = fieldsValue.userInfo;
      if (info !== undefined) {
        let reg = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.userMobile = info;
          fieldsValue.receiverName = undefined;
        }else{
          fieldsValue.accountName = info;
        }
      }
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.tradeTime !== undefined && fieldsValue.tradeTime !== '' && fieldsValue.tradeTime.length >= 1) {
        
        fieldsValue.tradeTimeEnd = fieldsValue.tradeTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTimeStart = fieldsValue.tradeTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTime = undefined;
      }
      this.props.dispatch({
        type: `${this.moduleCode}/personList`,
        payload: fieldsValue,
      });
    });
  };

  //改变页数查询
  orgTableChange = pagination => {
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
      let info = fieldsValue.userInfo;
      if (info !== undefined) {
        let reg = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.userMobile = info;
          fieldsValue.receiverName = undefined;
        }else{
          fieldsValue.accountName = info;
        }
      }
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.tradeTime !== undefined && fieldsValue.tradeTime !== '' && fieldsValue.tradeTime.length >= 1) {
        
        fieldsValue.tradeTimeEnd = fieldsValue.tradeTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTimeStart = fieldsValue.tradeTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.tradeTime = undefined;
      }
      this.props.dispatch({
        type: `${this.moduleCode}/orgList`,
        payload: fieldsValue,
      });
    });
  };

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    // setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
    setTimeout(() => {
      form.validateFields(err => {
        if (!err) {
          // eslint-disable-next-line
          dispatch({
            type: 'list/fetch',
            payload: {
              count: 8,
            },
          });
        }
      });
    }, 0);
  };

  onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }

  personSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.personList} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('userInfo')(<Input placeholder="微信昵称" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('tradeTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.personFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        <Row>
          <FormItem>
              {getFieldDecorator('tradeType')(
                <TagSelect onChange={this.handleFormSubmit} expandable>
                  <TagSelect.Option value="10">余额充值</TagSelect.Option>
                  <TagSelect.Option value="11">返现金充值</TagSelect.Option>
                  <TagSelect.Option value="31">提现</TagSelect.Option>
                  <TagSelect.Option value="30">申请提现</TagSelect.Option>
                  <TagSelect.Option value="20">支付</TagSelect.Option>
                  <TagSelect.Option value="56">结算返佣金</TagSelect.Option>
                  <TagSelect.Option value="51">结算返现金</TagSelect.Option>
                  <TagSelect.Option value="60">买家退款</TagSelect.Option>
                  <TagSelect.Option value="32">作废提现</TagSelect.Option>
                  <TagSelect.Option value="33">提现服务费</TagSelect.Option>
                </TagSelect>
              )}
          </FormItem>
       </Row>
      </Form>
    );
  }

  orgSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.orgList} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('userInfo')(<Input placeholder="组织名称" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('tradeTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                />
              )}
            </FormItem>
          </Col>
          
          <Col md={6} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.orgFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        <Row>
          <FormItem>
              {getFieldDecorator('tradeType')(
                <TagSelect onChange={this.handleFormSubmit} expandable>
                  <TagSelect.Option value="31">提现</TagSelect.Option>
                  <TagSelect.Option value="30">申请提现</TagSelect.Option>
                  <TagSelect.Option value="40">充值保证金</TagSelect.Option>
                  <TagSelect.Option value="41">进货保证金</TagSelect.Option>
                  <TagSelect.Option value="42">出货保证金</TagSelect.Option>
                  <TagSelect.Option value="50">供应商结算</TagSelect.Option>
                  <TagSelect.Option value="52">释放保证金</TagSelect.Option>
                  <TagSelect.Option value="53">卖家结算</TagSelect.Option>
                  <TagSelect.Option value="55">结算平台服务费</TagSelect.Option>
                  <TagSelect.Option value="65">退款补偿金</TagSelect.Option>
                </TagSelect>
              )}
          </FormItem>
       </Row>
      </Form>
    );
  }

  render() {
    const { afcflow:{afcflow},loading } = this.props;
    let afcflowData;
    if (afcflow === undefined) {
      afcflowData = [];
    } else {
      afcflowData = afcflow.list;
    }

    let ps;
    if (afcflow === undefined || afcflow.pageSize === undefined) {
      ps = 5;
    } else {
      ps = afcflow.pageSize;
    }
    let tl;
    if (afcflow === undefined || afcflow.total === undefined) {
      tl = 1;
    } else {
      tl = Number(afcflow.total);
    }
    
    const personTradeColumns = [
      {
        title: '账号名称',
        dataIndex: 'accountName',
        key: 'accountName',
        width: 150,
      },
      {
        title: '交易类型',
        dataIndex: 'tradeType',
        key: 'tradeType',
        width: 100,
        render: (text, record) => {
          console.info(record);
          if (record.tradeType == '10') return '余额充值';
          if (record.tradeType == '11') return '返现金充值';
          if (record.tradeType == '20') return '支付';
          if (record.tradeType == '30') return '申请提现';
          if (record.tradeType == '31') return '提现';
          if (record.tradeType == '32') return '作废提现';
          if (record.tradeType == '33') return '提现服务费';
          if (record.tradeType == '51') return '结算返现金';
          if (record.tradeType == '56') return '结算返佣金';
          if (record.tradeType == '60') return '退货返还金额';
        },
      },
      {
        title: '交易金额',
        dataIndex: 'tradeAmount',
        key: 'tradeAmount',
        width: 100,
      },
      {
        title: '交易时间',
        dataIndex: 'tradeTime',
        key: 'tradeTime',
        width: 100,
      },
      {
        title: '操作人',
        dataIndex: 'opName',
        key: 'opName',
        width: 100,
      },
    ]

    const orgTradeColumns = [
      {
        title: '账号名称',
        dataIndex: 'accountName',
        key: 'accountName',
        width: 150,
      },
      {
        title: '交易类型',
        dataIndex: 'tradeType',
        key: 'tradeType',
        width: 100,
        render: (text, record) => {
          console.info(record);
          if (record.tradeType == '31') return '提现';
          if (record.tradeType == '30') return '申请提现';
          if (record.tradeType == '40') return '充值保证金';
          if (record.tradeType == '41') return '进货保证金';
          if (record.tradeType == '42') return '出货保证金';
          if (record.tradeType == '50') return '供应商结算';
          if (record.tradeType == '52') return '释放保证金';
          if (record.tradeType == '53') return '卖家结算';
          if (record.tradeType == '55') return '结算平台服务费';
          if (record.tradeType == '65') return '退款补偿金';
        },
      },
      {
        title: '交易金额',
        dataIndex: 'tradeAmount',
        key: 'tradeAmount',
        width: 100,
      },
      {
        title: '交易时间',
        dataIndex: 'tradeTime',
        key: 'tradeTime',
        width: 100,
      },
      {
        title: '操作人',
        dataIndex: 'opName',
        key: 'opName',
        width: 100,
      },
    ]

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };

    return (
      <PageHeaderLayout title="账号交易流水">
        <Card bordered={false}>
          <Tabs defaultActiveKey="personTradeList" onChange={this.switchTab}>
            <TabPane tab="个人账号交易流水" key="personTradeList">
              <div className={styles.tableListForm}>{this.personSearchForm()}</div>
              <div className={styles.tableList}>
                <Table
                  rowKey="id"
                  pagination={paginationProps}
                  loading={loading}
                  onChange={this.personTableChange}
                  dataSource={afcflowData}
                  columns={personTradeColumns}
                />
              </div>
            </TabPane>
            <TabPane tab="组织账号交易流水" key="orgTradeList">
              <div className={styles.tableListForm}>{this.orgSearchForm()}</div>
              <div className={styles.tableList}>
                <Table
                  rowKey="id"
                  pagination={paginationProps}
                  loading={loading}
                  onChange={this.orgTableChange}
                  dataSource={afcflowData}
                  columns={orgTradeColumns}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>

      </PageHeaderLayout>
    );
  }
}