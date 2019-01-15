import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
const FormItem = Form.Item;
// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.sucuser,
}))
@EditForm
export default class UserChargeForm extends PureComponent {

  /**
   * 判断昵称是否存在，不存在的话返回微信昵称
   */
  isNickname = () => {
    const { form } = this.props;
    if (this.props.record.nickname !== undefined) {
      return (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名称">
          {form.getFieldDecorator('nickname', {
            
          })(<Input placeholder="用户昵称" disabled={true} />)}
        </FormItem>
      )
    } else if(this.props.record.wxNickname !== undefined){
      return(
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名称">
        {form.getFieldDecorator('wxNickname', {
          
        })(<Input placeholder="用户昵称" disabled={true} />)}
      </FormItem>
      )
    }else if(this.props.record.qqNickname !== undefined){
      return(
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名称">
        {form.getFieldDecorator('qqNickname', {
          
        })(<Input placeholder="用户昵称" disabled={true} />)}
      </FormItem>
      )
    }else {
      return(
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名称">
        {form.getFieldDecorator('loginName', {
          
        })(<Input placeholder="用户昵称" disabled={true} />)}
      </FormItem>
      )
    }
  }

  render() {
    const { form } = this.props;

    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('point')(<Input type="hidden" />)}
        {form.getFieldDecorator('modifiedTimestamp')(<Input type="hidden"/>)}
        {this.isNickname()}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="充值积分">
          {form.getFieldDecorator('newPoint', {
            rules: [
              {
                required: true,
                pattern: /0|-?^\d+(\.\d{1,4})?$/,
                message: '充值积分必须为数字',
              },
            ],
          })(<Input placeholder="充值积分" />)}
        </FormItem>
      </Fragment>
    );
  }
}
