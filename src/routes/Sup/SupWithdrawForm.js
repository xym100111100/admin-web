import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.supaccount,
}))
@EditForm
export default class SupWithdrawForm extends PureComponent {
  render() {
    const { form, record } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('applicantId')(<Input type="hidden" />)}
        {form.getFieldDecorator('applicantOrgId')(<Input type="hidden" />)}
        {form.getFieldDecorator('withdrawType', {
          initialValue: 1,
        })(<Input type="hidden" placeholder="用户组织id" />)}
        {form.getFieldDecorator('accountType', {
          initialValue: 2,
        })(<Input type="hidden" placeholder="提现类型，1个人，2供应商" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="金额">
          {form.getFieldDecorator('withdrawAmount', {
            rules: [{
              required: true, message: '请输入符合格式的提现金额',
              pattern: /^\d+(\.\d{1,4})?$/,
            }],
          })(<Input placeholder="请输入符合格式的提现金额" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="银行名称">
          {form.getFieldDecorator('openAccountBank', {
            rules: [{ required: true, message: '请输入银行的名称' }],
          })(<Input placeholder="请输入银行的名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账户姓名">
          {form.getFieldDecorator('bankAccountName', {
            rules: [{ required: true, message: '请输入账户姓名' }],
          })(<Input placeholder="请输入账户姓名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="银行卡号">
          {form.getFieldDecorator('bankAccountNo', {
            rules: [{
              required: true, message: '请输入全部为数字银行卡号',
              pattern: /^[0-9]*$/,
            }],
          })(<Input placeholder="请输入全部为数字银行卡号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="身份证号">
          {form.getFieldDecorator('idCard', {
            rules: [{
              required: true, message: '请输入全部为数字身份证号',
            }],
          })(<Input placeholder="请输入全部为数字身份证号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系电话">
          {form.getFieldDecorator('contactTel', {
            rules: [{
              required: true, message: '请输入全部为数字联系电话',
              pattern: /^[0-9]*$/,
            }],
          })(<Input placeholder="请输入联系电话" />)}
        </FormItem>

      </Fragment>
    );
  }
}
