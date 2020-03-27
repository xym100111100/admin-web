import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';
const FormItem = Form.Item;

// 添加与编辑的表单
@EditForm
export default class WithdrawReviewForm extends PureComponent {
  render() {
    const { form, record } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('accountId')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="交易凭证">
          {form.getFieldDecorator('rejectReason', {})(<Input placeholder="请输入交易凭证号（选填）" />)}
        </FormItem>
      </Fragment>
    );
  }
}
