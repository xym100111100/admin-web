import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;
const { TextArea } = Input;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.sucuserdomain,
}))
@EditForm
export default class UserDomainForm extends PureComponent {
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('loginPswd')) {
      callback('两次密码输入不正确');
    } else {
      callback();
    }
  };

  // 提交前事件
  beforeSave = () => {
    const { form, record } = this.props;

    let loginName = undefined;
    let loginPswd = undefined;
    let comfirmLoginPswd = undefined;
    let email = undefined;
    let mobile = undefined;
    let nickname = undefined;
    let realname = undefined;
    let idcard = undefined;
    // 是否为组织添加
    let isOrgAdd = record.isOrgAdd;

    form.validateFields((err, values) => {
      loginName = values.loginName,
        loginPswd = values.loginPswd,
        comfirmLoginPswd = values.comfirmLoginPswd,
        email = values.email,
        mobile = values.mobile,
        nickname = values.nickname,
        realname = values.realname,
        idcard = values.idcard
    });

    form.getFieldDecorator('loginName');
    form.getFieldDecorator('loginPswd');
    form.getFieldDecorator('comfirmLoginPswd');
    form.getFieldDecorator('email');
    form.getFieldDecorator('mobile');
    form.getFieldDecorator('nickname');
    form.getFieldDecorator('realname');
    form.getFieldDecorator('idcard');
    form.getFieldDecorator('isOrgAdd');

    form.setFieldsValue({
      loginName: loginName,
      loginPswd: loginPswd,
      comfirmLoginPswd: comfirmLoginPswd,
      email: email,
      mobile: mobile,
      nickname: nickname,
      realname: realname,
      idcard: idcard,
      isOrgAdd: isOrgAdd,
    });
  }

  render() {
    const { form } = this.props;
    return (
      <Fragment>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录名称">
          {form.getFieldDecorator('loginName', {
            rules: [{ required: true, message: '请输入用户的登陆名称' }],
          })(<Input placeholder="请输入用户的登陆名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录密码">
          {form.getFieldDecorator('loginPswd', {
            rules: [{ required: true, message: '请输入用户的登录密码' }],
          })(<Input type="password" placeholder="请输入用户的登录密码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
          {form.getFieldDecorator('comfirmLoginPswd', {
            rules: [
              { required: true, message: '请再次输入用户的登录密码' },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input type="password" placeholder="请再次输入用户的登录密码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电子邮箱">
          {form.getFieldDecorator('email', {})(<Input placeholder="请输入电子邮箱（选填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {form.getFieldDecorator('mobile', {})(<Input placeholder="请输入手机号码（选填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {form.getFieldDecorator('nickname', {})(<Input placeholder="请输入昵称（选填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="真实姓名">
          {form.getFieldDecorator('realname', {})(<Input placeholder="请输入真实姓名（选填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="身份证号">
          {form.getFieldDecorator('idcard', {})(<Input placeholder="请输入身份证号（选填）" />)}
        </FormItem>
      </Fragment>
    );
  }
}
