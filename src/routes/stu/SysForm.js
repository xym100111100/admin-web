import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.student,
}))
@EditForm
export default class SysForm extends PureComponent {
  render() {
    const { form, editFormType, record } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="学号">
          {form.getFieldDecorator('studentCode', {
            rules: [{ required: true, message: '请输入学号' }],
            initialValue: record.id,
          })(<Input disabled={editFormType !== 'add'} placeholder="请输入学号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="学生姓名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入学生姓名' }],
            initialValue: record.name,
          })(<Input placeholder="请输入学生姓名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {form.getFieldDecorator('phone1', {
            rules: [{ required: true, message: '请输入手机号码' }],
            initialValue: record.name,
          })(<Input placeholder="请输入手机号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话号码">
          {form.getFieldDecorator('phone2', {
            rules: [{ required: true, message: '请输入电话号码' }],
            initialValue: record.name,
          })(<Input placeholder="请输入电话号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="身份证">
          {form.getFieldDecorator('idCard', {
            rules: [{ required: true, message: '请输入身份证号码' }],
            initialValue: record.name,
          })(<Input placeholder="请输入身份证号码" />)}
        </FormItem>
      </Fragment>
    );
  }
}
