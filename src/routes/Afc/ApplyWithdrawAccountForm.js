import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';
const { TextArea } = Input;
const FormItem = Form.Item;

// 添加与编辑的表单
@EditForm
export default class ApplyWithdrawAccountForm extends PureComponent {
  render() {
    const { form, editFormType, record } = this.props;
    console.log(record)
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拒绝原因">
          {form.getFieldDecorator('rejectReason', { initialValue: record.rejectReason })(<TextArea />)}
        </FormItem>
      </Fragment>
    );
  }
}
