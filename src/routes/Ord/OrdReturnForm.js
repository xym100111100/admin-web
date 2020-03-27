import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Row, Col, Radio } from 'antd';
import EditForm from 'components/Rebue/EditForm';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// 添加与编辑的表单
@EditForm
export default class OrdReturnForm extends PureComponent {

    state = {
        refundType: 1,
    }

    onChange = (e) => {
        this.setState({
            refundType: e.target.value,
        });
    }

    // 提交前事件
    beforeSave = () => {
        const { form, record } = this.props;
        form.getFieldDecorator('returnId');
        form.getFieldDecorator('returnNum');
        form.getFieldDecorator('isAutoCalcRefund');
        form.setFieldsValue({
            returnId: record.id,
            returnNum: record.returnCount,
            isAutoCalcRefund: this.state.refundType === 1 ? true : false,
        });
    }

    render() {
        const { form, record } = this.props;
        console.log(record)
        const { refundType } = this.state;
        return (
            <Fragment>
                <Form layout="inline">
                    {form.getFieldDecorator('id')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderId')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderDetailId')(<Input type="hidden" />)}
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col md={24} sm={24}  >
                            <FormItem style={{ marginLeft: 15 }} label="退款类型">
                                <RadioGroup onChange={this.onChange} value={refundType}>
                                    <Radio value={1}>自动退款</Radio>
                                    <Radio value={2}>手动退款</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem style={{ marginLeft: 15 }} label={refundType === 2 ? undefined : "退款金额"}>
                                {refundType === 2 ? undefined : form.getFieldDecorator('refundAmount', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                                            message: '请输入退款金额',
                                            
                                        },
                                    ],
                                    initialValue: record.returnRental,
                                })(<Input placeholder="请输入退款金额" />)}
                            </FormItem>
                            <FormItem style={{ marginLeft: 15 }} label={refundType === 1 ? undefined : "退到余额"}>
                                {refundType === 1 ? undefined : form.getFieldDecorator('refundAmount1', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                                            message: '请输入退款到余额的金额',
                                        },
                                    ],
                                })(<Input placeholder="请输入退款到余额的金额" />)}
                            </FormItem>
                            <FormItem style={{ marginLeft: 15 }} label={refundType === 1 ? undefined : "退到返现"}>
                                {refundType === 1 ? undefined : form.getFieldDecorator('refundAmount2', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                                            message: '请输入退款到返现金的金额',
                                        },
                                    ],
                                })(<Input placeholder="请输入退款到返现金的金额" />)}
                            </FormItem>
                            <FormItem style={{ marginLeft: 15 }} label="补偿金额">
                                {form.getFieldDecorator('refundCompensation', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                                            message: '请输入退款到返现金的金额',
                                        },
                                    ],
                                })(<Input placeholder="退货退款产生的需补偿给卖家的金额，例如补偿运费" />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}
