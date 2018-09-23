import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;
const Option = Select.Option;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.pfmsys,
}))
@EditForm
export default class OnlOnlinePromotionForm extends PureComponent {
  handleChange = value => {
    this.props.form.setFieldsValue({ promotionType: value });
  };
  render() {
    const { form } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('onlineId')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上线标题">
          {form.getFieldDecorator('onlineTitle', {})(<Input disabled />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="推广类型">
          {form.getFieldDecorator('promotionType', {
            initialValue: '2',
          })(
            <Select style={{ width: 120 }} onChange={this.handleChange}>
              <Option value="1">每日热门</Option>
            </Select>
          )}
        </FormItem>
      </Fragment>
    );
  }
}
