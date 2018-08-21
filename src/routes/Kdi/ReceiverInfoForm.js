import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import AddrCascader from 'components/Rebue/AddrCascader';
import styles from './KdiEorder.less';

const FormItem = Form.Item;

@connect(({ kdireceiver, loading }) => ({ kdireceiver, loading: loading.models.kdireceiver }))
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
export default class ReceiverInfoForm extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdireceiver';
  }

  componentDidMount() {
    this.props.getReceiver(this)
  }

  state = {
    // options: {},
    // record: {},
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

    return (
      <Fragment>
        <Form>
          <FormItem {...formItemLayout} className={styles.formItem} label="订单标题">
            {form.getFieldDecorator('orderTitle', {
              rules: [
                {
                  required: true,
                  message: '请输入标题',
                },
              ],
            })(<Input placeholder="" />)}
          </FormItem>

          <Form.Item {...formItemLayout} className={styles.formItem} label="收件人">
            {form.getFieldDecorator('receiverName', {
              rules: [{ required: true, message: '收件人不能为空' }],
            })(<Input placeholder="" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} className={styles.formItem} label="手机">
            {form.getFieldDecorator('receiverMobile', {
              rules: [{ required: true, message: '收件人手机不能为空' }],
            })(<Input placeholder="" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} className={styles.formItem} label="电话">
            {form.getFieldDecorator('receiverTel', {
              rules: [],
            })(<Input placeholder="" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} className={styles.formItem} label="邮编">
            {form.getFieldDecorator('receiverPostCode', {
              rules: [{ required: true, message: '收件人邮编不能为空' }],
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} className={styles.formItem} label="省市区">
            {form.getFieldDecorator('receiveraddr', {
              rules: [{ required: true, message: '省市区不能为空' }],
            })(<AddrCascader />)}
          </Form.Item>
          <FormItem {...formItemLayout} className={styles.formItem} label="详细地址">
            {form.getFieldDecorator('receiverAddress', {
              rules: [
                {
                  required: true,
                  message: '详细地址不能为空',
                },
              ],
            })(<Input placeholder="" />)}
          </FormItem>
          <Button style={{ marginLeft: 300 }} onClick={this.handleFormReset}>
            重置
          </Button>
        </Form>
      </Fragment>
    );
  }
}
