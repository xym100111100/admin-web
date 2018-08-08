import React, { Fragment, PureComponent } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import AddrCascader from 'components/Rebue/AddrCascader';
import { connect } from 'dva';
import styles from './KdiEorder.less';

const FormItem = Form.Item;
@connect(({ kdisender, loading }) => ({ kdisender, loading: loading.models.kdisender }))
@Form.create({
  mapPropsToFields(props) {
    const { record } = props;
    const result = {};
    for (const key in record) {
      if ({}.hasOwnProperty.call(record, key)) {
        result[key] = Form.createFormField({
          value: record[key],
        });
      }
    }
    return result;
  },
})
export default class SenderInfoForm extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdisender';
  }

  // state = {
  //   options: {},
  //   record: {},
  // };

  setDefaulSender = () => {
    this.props.dispatch({
      type: 'kdisender/setDefaultSender',
      payload: {},
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      // formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  render() {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 6 },
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

    return (
      <Fragment>
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="寄件人">
                {form.getFieldDecorator('senderName', {
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="电话">
                {form.getFieldDecorator('senderTel', {
                  rules: [{ required: true, message: '请选择' }],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="手机">
                {form.getFieldDecorator('senderMobile', {
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="邮编">
                {form.getFieldDecorator('senderPostCode', {
                  rules: [{ required: true, message: '请选择' }],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} pull={2}>
              <Form.Item {...senderFormItemLayout} className={styles.formItem} label="省市区">
                {form.getFieldDecorator('senderaddr', {
                  rules: [{ required: true, message: '请选择' }],
                })(<AddrCascader />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} pull={2}>
              <FormItem {...senderFormItemLayout} label="地  址" className={styles.formItem}>
                {form.getFieldDecorator('senderAddress', {
                  rules: [
                    {
                      required: true,
                      message: '请输入详细地址',
                    },
                  ],
                })(<Input placeholder="请输入详细地址" />)}
              </FormItem>
            </Col>
          </Row>
          <Button style={{ marginLeft: 60 }}>新增联系人</Button>
          <Button style={{ marginLeft: 20 }} onClick={this.setDefaulSender}>
            设为默认联系人
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
            清空
          </Button>
        </Form>
      </Fragment>
    );
  }
}
