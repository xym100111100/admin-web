import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.pfmsys,
}))
@EditForm
export default class SysForm extends PureComponent {
  render() {
    const { form, editFormType, record } = this.props;
    return (
      <Fragment>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="代号">
          {form.getFieldDecorator('id', {
            rules: [{ required: true, message: '请输入系统的代号' }],
            initialValue: record.id,
          })(<Input disabled={editFormType !== 'add'} placeholder="请输入系统的代号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入系统的名称' }],
            initialValue: record.name,
          })(<Input placeholder="请输入系统的名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('remark', { initialValue: record.remark })(<Input placeholder="请输入系统的描述" />)}
        </FormItem>
      </Fragment>
    );
  }
}
