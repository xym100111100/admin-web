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
export default class PrdCategoryForm extends PureComponent {
  render() {
    const { form, editFormType, record } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入分类名称' }],
            initialValue: record.name,
          })(<Input disabled={editFormType !== 'add'} placeholder="请输入分类名称" />)}
        </FormItem>
      </Fragment>
    );
  }
}
