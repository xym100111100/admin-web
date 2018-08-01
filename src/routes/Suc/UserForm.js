import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.sucuser,
}))
@EditForm
export default class UserForm extends PureComponent {
  render() {
    const { form } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录名称">
          {form.getFieldDecorator('loginName', {
            rules: [{ required: true, message: '请输入登录的名称' }],
          })(<Input placeholder="请输入登录的名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电子邮箱">
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入电子邮箱' }],
          })(<Input placeholder="请输入电子邮箱" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {form.getFieldDecorator('mobile', {
            rules: [{ required: true, message: '请输入手机号码' }],
          })(<Input placeholder="请输入手机号码" />)}
        </FormItem>
      </Fragment>
    );
  }
}
