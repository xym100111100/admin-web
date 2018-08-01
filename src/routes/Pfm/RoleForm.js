import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;
const { TextArea } = Input;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.pfmsys,
}))
@EditForm
export default class RoleForm extends PureComponent {
  render() {
    const { form } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('sysId')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色的名称' }],
          })(<Input placeholder="请输入角色的名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('remark', {})(<TextArea placeholder="请输入角色的描述" rows={4} />)}
        </FormItem>
      </Fragment>
    );
  }
}
