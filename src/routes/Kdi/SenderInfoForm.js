import React, { Fragment, PureComponent } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import AddrCascader from 'components/Rebue/AddrCascader';
import { connect } from 'dva';
import styles from './KdiEorder.less';

const FormItem = Form.Item;
@connect(({ kdisender,user, loading }) => ({ kdisender, user,loading: loading.models.kdisender }))

@Form.create({
  mapPropsToFields(props) {
    const { kdisender: { kdisender }, loading } = props;
    // const { record } = props;
    const result = {};
    for (const key in kdisender) {
      if ({}.hasOwnProperty.call(kdisender, key)) {
        result[key] = Form.createFormField({
          value: kdisender[key],
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
  };

  state = {
    seleteSender: undefined
  };

  componentDidMount() {
    this.props.getSender(this)
  }

  setDefaulSender = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, fields) => {
      if (err) return;
      const payload = fields;
      console.info(payload);
      this.props.dispatch({
        type: 'kdisender/setDefaultSender',
        payload
      });
    });
  };

  addSender = () => {
    const { form,user } = this.props;
    form.validateFieldsAndScroll((err, fields) => {
      if (err) return;
      const payload = fields;
      payload.senderProvince = payload.senderaddr[0];
      payload.senderCity = payload.senderaddr[1];
      payload.senderExpArea = payload.senderaddr[2];
      // payload.organizeId = user.currentUser.organizeId;
      payload.organizeId = 123;
      console.info(payload);
      this.props.dispatch({
        type: 'kdisender/addSender',
        payload
      });
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
            <Col span={0}>
              <Form.Item label="id">
                {form.getFieldDecorator('senderId', {
                  rules: [{ required: false, message: '请输入' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="寄件人">
                {form.getFieldDecorator('senderName', {
                  rules: [{ required: true, message: '寄件人不能为空' },{ whitespace: true, message: '寄件人不能为空' }],
                })(<Input placeholder="寄件人不能为空" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="手机">
                {form.getFieldDecorator('senderMobile', {
                  rules: [{ required: true, message: '寄件人手机不能为空' },{ whitespace: true, message: '寄件人手机不能为空' }],
                })(<Input placeholder="寄件人手机不能空" />)}
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="邮编">
                {form.getFieldDecorator('senderPostCode', {
                  rules: [{ required: true, message: '寄件人邮编不能为空' },{pattern: /^\d{6}$/,
                  message: '请输入六位全部为数字的邮编'},
                  { whitespace: true, message: '寄件人邮编不能为空' }],
                })(<Input placeholder="" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} className={styles.formItem} label="电话">
                {form.getFieldDecorator('senderTel', {
                  rules: [],
                })(<Input placeholder="" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} pull={2}>
              <Form.Item {...senderFormItemLayout} className={styles.formItem} label="省市区">
                {form.getFieldDecorator('senderaddr', {
                  rules: [{ required: true, message: '寄件人省市区不能为空' }],
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
                      message: '寄件人地址不能为空',
                    },
                    { whitespace: true, message: '寄件人地址不能为空' }
                  ],
                })(<Input placeholder="" />)}
              </FormItem>
            </Col>
          </Row>
          {/* <Button style={{ marginLeft: 60 }} onClick={this.addSender}>新增联系人</Button>
          <Button style={{ marginLeft: 20 }} onClick={this.setDefaulSender}>
            设为默认联系人
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
            清空
          </Button> */}

        </Form>
      </Fragment>
    );
  }
}
