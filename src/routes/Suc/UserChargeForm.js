import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;
const { Option } = Select;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.sucuser,
}))
@EditForm
export default class UserChargeForm extends PureComponent {
  state = {
  };
  render() {
    const { form } = this.props;
    console.info(form);
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名称">
          {form.getFieldDecorator('wxNickname', {
            rules: [{ required: false, message: '用户昵称' }],
          })(<Input placeholder="用户昵称" disabled = "true"/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="充值金额">
          {form.getFieldDecorator('tradeAmount', {
            rules: [
              {
                required: true,
                pattern: /0|-?^\d+(\.\d{1,4})?$/,
                message: '充值金额必须为数字',
              },
            ],
          })(<Input placeholder="充值金额" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="充值类型">
          {form.getFieldDecorator('tradeType', {
            rules: [{ required: true, message: '请选择充值类型' }],
          })(
            <Select placeholder="请选择充值类型" style={{ width: '100%' } } >
              <Option value="1">余额充值</Option>
              <Option value="2">返现金充值</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="凭证号">
          {form.getFieldDecorator('tradeVoucherNo', {
            rules: [{ required: false, message: '凭证号' }],
          })(<Input placeholder="凭证号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('tradeDetail', {
            rules: [{ required: false, message: '备注' }],
          })(<Input placeholder="备注" />)}
        </FormItem>
      </Fragment>
    );
  }
}
