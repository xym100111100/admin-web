import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Table, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SenderInfoForm from './SenderInfoForm';
import ReceiverInfoForm from './ReceiverInfoForm';

@connect(({ kdieorder, loading }) => ({ kdieorder, loading: loading.models.kdieorder }))
@Form.create()
export default class KdiEorder extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdieorder';
  }

  state = {
    options: {},
    record: {},
  };

  componentDidMount() {
    this.handleReload();
  }

  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  // 刷新
  handleReload(params) {
    if (params) {
      this.state.options = params;
    }
    // const { ...state } = this.state;
    const payload = this.state;
    // 刷新
    this.props.dispatch({
      type: `kdisender/list`,
      payload,
      callback: data => {
        this.setState({ record: data[0] });
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const record = this.state.record;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 6 },
        // style:{marginBottom:'14px'},
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 12 },
        md: { span: 16 },
      },
    };

    const senderFormItemLayout = {
      labelCol: {
        xs: { span: 1 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
        md: { span: 18 },
      },
    };

    const dataSource = [
      {
        name: '微薄利',
        senderTel: '13657882081',
        senderMobile: '13657882081',
        senderPostCode: '530000',
        address: '广西南宁市西乡塘区发展大道189号安吉华尔街工谷B座一楼微薄利',
      },
      {
        name: '微薄利',
        address: '广西南宁市西乡塘区发展大道189号安吉华尔街工谷B座一楼微薄利',
      },
      {
        name: '微薄利',
        address: '广西南宁市西乡塘区发展大道189号安吉华尔街工谷B座一楼微薄利',
      },
      {
        name: '微薄利',
        address: '广西南宁市西乡塘区发展大道189号安吉华尔街工谷B座一楼微薄利',
      },
    ];

    const columns = [
      {
        title: '名字',
        dataIndex: 'name',
        align: 'center',
        width: '80px',
      },
      {
        title: '地址',
        align: 'center',
        dataIndex: 'address',
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operat',
        width: '80px',
        render: () => <a href="javascript:;">删除</a>,
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
      type: 'radio',
    };
    return (
      <PageHeaderLayout title="快递下单">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <Card title="寄件人信息">
              <SenderInfoForm record={record} />
            </Card>
            <div style={{ marginTop: '30px', height: '1px' }}>
              <Card title="选择寄件人">
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  scroll={{ x: 300, y: 100 }}
                />
              </Card>
            </div>
          </Col>
          <Col md={12} sm={24}>
            <Card title="收件人信息" bordered={false}>
              <ReceiverInfoForm />
            </Card>
            <div style={{ marginTop: '25px' }}>
              <Card title="快递下单">
                {getFieldDecorator('shipperCompany')(
                  <Select placeholder="选择快递公司" style={{ width: '50%' }}>
                    {/* <Option value="0">全部</Option> */}
                    <Option value="1">百世快递</Option>
                    <Option value="2">圆通快递</Option>
                    <Option value="3">邮政快递</Option>
                  </Select>
                )}
                <Button style={{ marginLeft: 60 }}>快递下单</Button>
              </Card>
            </div>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
