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
export default class EditPwForm extends PureComponent {
  render() {
    const { form } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录名称">
          {form.getFieldDecorator('loginPswd', {
            rules: [{ required: true, message: '请输入用户登录密码' }],
          })(<Input type="password"  placeholder="请输入用户登录密码" />)}
        </FormItem>
      </Fragment>
    );
  }
}
