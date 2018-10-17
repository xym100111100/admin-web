import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';
const FormItem = Form.Item;
const { TextArea } = Input;

// 添加与编辑的表单
@EditForm
export default class WithdrawCancelForm extends PureComponent {
  render() {
    const { form, record } = this.props;
    console.log(record)
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('accountId')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拒绝原因">
          {form.getFieldDecorator('reason', {})(<TextArea />)}
        </FormItem>
      </Fragment>
    );
  }
}
