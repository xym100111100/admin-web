import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiEntry.less';
import AddrCascader from 'components/Rebue/AddrCascader';
import KdiCompany from 'components/Rebue/KdiCompany';
import AddrRanalysis from 'components/Rebue/AddrRanalysis';

const FormItem = Form.Item;
@connect(({ kdientry, user, loading }) => ({ kdientry, user, loading: loading.models.kdientry || loading.models.user }))
@Form.create()
export default class KdiEntry extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdientry';
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  componentDidMount() {
    const { form } = this.props;
    //设置默认发件人
    form.setFieldsValue({ senderPostCode: '530000' });
    form.setFieldsValue({ receiverPostCode: '000000' });
  }

  /**
   * 收发件人的自定义规则
   */
  provinceInfo = (rule, value, callback) => {
    if (value === undefined || value.length < 3) {
      callback('请选择完省市区 ');
    } else {
      callback();
    }
  };

  /**
   * 录入物流信息
   */
  entry = () => {
    const { form } = this.props;

    //设置截取后的详细地址
    //  const organizeId=user.currentUser.organizeId; 不是连调的时候应该把这里放开获取动态的organizeId(在上面的获取属性里面加user)
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //添加组织ID
      fieldsValue.organizeId = 253274870;
      //这里其实传上来的shipperName中已经包含了shipperId和shipperCode，且用/隔开，所有这里要处理数据。
      let shipperInfo;
      if (fieldsValue.shipperName !== undefined) {
        shipperInfo = fieldsValue.shipperName.split('/');
        fieldsValue.shipperId = shipperInfo[0];
        fieldsValue.shipperName = shipperInfo[1];
        fieldsValue.shipperCode = shipperInfo[2];
      }
      //这里其实传上来的senderProvince中已经包含了senderCity和senderExpArea，是个数组，所有这里要处理数据。
      let senderProvinceInfo = fieldsValue.senderProvince;
      if (senderProvinceInfo !== undefined) {
        fieldsValue.senderProvince = senderProvinceInfo[0];
        fieldsValue.senderCity = senderProvinceInfo[1];
        fieldsValue.senderExpArea = senderProvinceInfo[2];
      }
      //这里其实传上来的receiverProvince中已经包含了receiverCity和receiverExpArea，是个数组，所有这里要处理数据。
      let receiverProvinceInfo = fieldsValue.receiverProvince;
      if (receiverProvinceInfo !== undefined) {
        fieldsValue.receiverProvince = receiverProvinceInfo[0];
        fieldsValue.receiverCity = receiverProvinceInfo[1];
        fieldsValue.receiverExpArea = receiverProvinceInfo[2];
      }
      //  console.log(fieldsValue);

      this.props.dispatch({
        type: `${this.moduleCode}/add`,
        payload: { ...fieldsValue },
        callback: () => {
          this.handleReload();
        },
      });
    });
  };

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { kdientry: { kdientry }, loading, form } = this.props;
    return (
      <Form onSubmit={() => this.entry()} layout="inline">
        <Row gutter={{ md: 1, lg: 4, xl: 2 }}>
          <Col md={10} sm={24} push={1}>
            <h3 style={{ paddingTop: 20, marginBottom: 40 }}>收件人信息</h3>
            <FormItem label="智能解析" style={{ paddingLeft: 24 }}>
              {getFieldDecorator('receiver')(<AddrRanalysis who="receiver" form={form} />)}
            </FormItem>
            <Divider />
            <FormItem label="收件人姓名">
              {getFieldDecorator('receiverName', {
                rules: [
                  {
                    required: true,
                    message: '请输入收件人姓名',
                  },
                ],
              })(<Input placeholder="请输入收件人姓名" />)}
            </FormItem>
            <FormItem label="收件人手机">
              {getFieldDecorator('receiverMobile', {
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9]*$/,
                    message: '请输入全部为数字的收件人手机',
                  },
                ],
              })(<Input placeholder="请输入全部为数字的收件人手机" />)}
            </FormItem>
            <FormItem label="收件地邮编">
              {getFieldDecorator('receiverPostCode', {
                rules: [
                  {
                    required: true,
                    pattern: /^\d{6}$/,
                    message: '请输入六位全部为数字收件地邮编',
                  },
                ],
              })(<Input placeholder="请输入收件地邮编" />)}
            </FormItem>
            <FormItem label="收件人地址">
              {getFieldDecorator('receiverProvince', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                  {
                    validator: this.provinceInfo,
                  },
                ],
              })(<AddrCascader />)}
            </FormItem>
            <FormItem label="详细地址" style={{ paddingLeft: 15 }}>
              {getFieldDecorator('receiverAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入收件人详细地址',
                  },
                ],
              })(<Input placeholder="请输入收件人详细地址" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24} push={1} style={{ textAlign: 'center' }}>
            <Divider type="vertical" style={{ height: 255, marginTop: 155 }} />
          </Col>
          <Col md={10} sm={24} push={1}>
            <h3 style={{ paddingTop: 20, marginBottom: 40 }}>发件人信息</h3>
            <FormItem label="智能解析" style={{ paddingLeft: 24 }}>
              {getFieldDecorator('sender')(<AddrRanalysis who="sender" form={form} />)}
            </FormItem>
            <Divider />
            <FormItem label="发件人姓名">
              {getFieldDecorator('senderName', {
                rules: [
                  {
                    required: true,
                    message: '请输入发件人姓名',
                  },
                ],
              })(<Input placeholder="请输入发件人姓名" />)}
            </FormItem>
            <FormItem label="发件人手机">
              {getFieldDecorator('senderMobile', {
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9]*$/,
                    message: '请输入全部为数字的发件人手机',
                  },
                ],
              })(<Input placeholder="请输入全部为数字的发件人手机" />)}
            </FormItem>
            <FormItem label="发件地邮编">
              {getFieldDecorator('senderPostCode', {
                rules: [
                  {
                    required: true,
                    pattern: /^\d{6}$/,
                    message: '请输入六位全部为数字发件地邮编',
                  },
                ],
              })(<Input placeholder="请输入发件地邮编" />)}
            </FormItem>
            <FormItem label="发件人地址">
              {getFieldDecorator('senderProvince', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                  ,
                  {
                    validator: this.provinceInfo,
                  },
                ],
              })(<AddrCascader />)}
            </FormItem>
            <FormItem label="详细地址" style={{ paddingLeft: 15 }}>
              {getFieldDecorator('senderAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入发件人详细地址',
                  },
                ],
              })(<Input placeholder="请输入发件人详细地址" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={24} sm={24} push={1}>
            <h3 style={{ paddingTop: 20, marginBottom: 20 }}>物流信息</h3>
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={24} push={1}>
            <FormItem style={{ paddingLeft: 15 }} label="物流单号">
              {getFieldDecorator('logisticCode', {
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9]*$/,
                    message: '请输入全部为数字的物流单号',
                  },
                ],
              })(<Input placeholder="请输入全部为数字的物流单号" />)}
            </FormItem>
            <FormItem label="订单标题" style={{ paddingLeft: 15 }}>
              {getFieldDecorator('orderTitle', {
                rules: [
                  {
                    required: true,
                    message: '请输入订单标题',
                  },
                ],
              })(<Input placeholder="请输入订单标题" />)}
            </FormItem>
          </Col>
          <Col md={10} sm={24} push={2}>
            <FormItem label="快递公司" style={{ paddingLeft: 15 }}>
              {getFieldDecorator('shipperName', {
                rules: [
                  {
                    required: true,
                    message: '请输入快递公司',
                  },
                ],
              })(<KdiCompany />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={14} sm={24}>
            <FormItem>
              <Button style={{ float: 'right', marginRight: 30 }} type="primary" htmlType="submit">
                录入
              </Button>
              <Button style={{ float: 'right', marginRight: 35 }} onClick={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { kdientry: { kdientry }, loading } = this.props;
    return (
      <PageHeaderLayout title="快递单录入">
        <div id="dd" style={{ background: 'white' }} className={styles.tableListForm}>
          {this.renderSearchForm()}
        </div>
      </PageHeaderLayout>
    );
  }
}
