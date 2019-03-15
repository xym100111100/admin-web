import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.xyzarea,
}))
@EditForm
export default class XyzForm extends PureComponent {
  render() {
    const { form, record } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域名称">
          {form.getFieldDecorator('areaName', {
            rules: [{ required: true, message: '请输入区域的名称' }],
            initialValue: record.name,
          })(<Input placeholder="请输入区域的名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('remark', { initialValue: record.remark })(<Input placeholder="请输入区域描述" />)}
        </FormItem>
      </Fragment>
    );
  }
}
