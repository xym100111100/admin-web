import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SysForm from './SysForm';
import styles from './SysMng.less';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ kdilogistic, loading }) => ({ kdilogistic, loading: loading.models.kdilogistic }))
@Form.create()
export default class KdiLogistic extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdilogistic';
  }

  renderSearchForm() {
    console.info(this.props);
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">{getFieldDecorator('no')(<Input placeholder="收件人姓名/电话/快递单号" />)}</FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="">
              {getFieldDecorator('status')(
                <Select placeholder="状态" style={{ width: '100%' }}>
                  {/* <Option value="0">全部</Option> */}
                  <Option value="0">无轨迹</Option>
                  <Option value="1">已揽收</Option>
                  <Option value="2">在途中</Option>
                  <Option value="3">已签收</Option>
                  <Option value="-1">作废</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
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
    const { kdilogistic: { kdilogistic }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'shipper_id',
      },
      {
        title: '快递公司',
        dataIndex: 'shipper_name',
      },
      {
        title: '快递单号',
        dataIndex: 'logistic_code',
      },
      {
        title: '收件人信息',
        dataIndex: 'receive_name',
      },
      {
        title: '寄件人信息',
        dataIndex: 'sender_name',
      },
      {
        title: '商品内容',
        dataIndex: 'goods_info',
      },
      {
        title: '下单时间',
        dataIndex: 'order_time',
      },
    ];

    return (
      <PageHeaderLayout title="快递订单管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table rowKey="id" pagination={false} loading={loading} dataSource={kdilogistic} columns={columns} />
          </div>
        </Card>
        {editForm === 'sysForm' && (
          <SysForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave(fields)}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
