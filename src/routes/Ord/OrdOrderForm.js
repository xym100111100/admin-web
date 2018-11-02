import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Row, Col, Select } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import KdiCompany from 'components/Kdi/KdiCompany';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
// 添加与编辑的表单
@connect(({ kdisender,user, loading }) => ({
  kdisender,user,
  loading: loading.models.kdisender ||  loading.models.user
}))
@EditForm
export default class OrdOrderForm extends PureComponent {
  //初始化
  componentDidMount() {
    const { user } = this.props;
    let orgId = user.currentUser.orgId;
    this.props.dispatch({
      type: `kdisender/list`,
      payload: { orgId: orgId },
    });

  }

  render() {
    const { form, kdisender } = this.props;
    const sender = kdisender.kdisender;
    const { ...props } = this.props;
    let defaultItems;
    if (sender === undefined || sender.length === 0 || sender.length === undefined) {
      return <Select placeholder="请选择发件人" />;
    }
    const listItems = sender.map(items => {
      if (items.isDefault === true) {
        defaultItems =
          items.senderName + '/'
          + items.senderMobile + '/'
          + items.senderProvince + '/'
          + items.senderCity + '/'
          + items.senderExpArea + '/'
          + items.senderPostCode + '/'
          + items.senderAddress + '/';
        return (
          <Option value={
            items.senderName + '/'
            + items.senderMobile + '/'
            + items.senderProvince + '/'
            + items.senderCity + '/'
            + items.senderExpArea + '/'
            + items.senderPostCode + '/'
            + items.senderAddress + '/'
          }
            key={items.id.toString()}>
            {items.senderName}
          </Option>
        );
      } else {
        return (
          <Option value={
            items.senderName + '/'
            + items.senderMobile + '/'
            + items.senderProvince + '/'
            + items.senderCity + '/'
            + items.senderExpArea + '/'
            + items.senderPostCode + '/'
            + items.senderAddress + '/'
          } key={items.id.toString()}>
            {items.senderName}
          </Option>
        );
      }
    });



    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('orderCode')(<Input type="hidden" />)}
        {form.getFieldDecorator('orderState')(<Input type="hidden" />)}
        {form.getFieldDecorator('orderTitle')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverName')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverProvince')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverCity')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverExpArea')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverAddress')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverMobile')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverTel')(<Input type="hidden" />)}
        {form.getFieldDecorator('receiverPostCode')(<Input type="hidden" />)}
        {form.getFieldDecorator('senderPostCode', {
          rules: [
            {
              required: true,
              message: '请输入选择发件人发件地编码',
            },
          ],
          initialValue: '000000',

        })(<Input type="hidden" />)}

        <Form layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col push={4} md={20} sm={24} style={{ marginBottom: 20 }}  >
              <KdiCompany SelectStyle={{ width: 170 }} form={form} />
            </Col>
            <Col push={4} md={20} sm={24}  >
              <FormItem style={{ marginLeft: 15 }} label="发件人" >
                {form.getFieldDecorator('senderInfo', {
                  rules: [
                    {
                      required: true,
                      message: '请输入选择发件人',
                    },
                  ],
                  initialValue: defaultItems,
                })(
                  <Select {...props} placeholder="请选择发件人" style={{ width: 170 }} >
                    {listItems}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
