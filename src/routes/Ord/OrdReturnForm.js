import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Row, Col, Select } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';
const FormItem = Form.Item;
// 添加与编辑的表单
@connect(({ ordreturn, loading }) => ({
    ordreturn,
    loading: loading.models.ordreturn
}))
@EditForm
export default class OrdReturnForm extends PureComponent {
    render() {
        const { form,ordreturn } = this.props;
        console.log(this.props);
        return (
            <Fragment>
                <Form layout="inline">
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                {form.getFieldDecorator('returnCode')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderId')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderDetailId')(<Input type="hidden" />)}
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col md={24} sm={24}  >
                            <FormItem style={{ marginLeft: 15 }} label="余额">
                                {form.getFieldDecorator('returnAmount1', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入退款到余额的金额',
                                        },
                                    ],
                                    initialValue: this.props.record.returnRental,
                                })(<Input placeholder="请输入退款到余额的金额" />)}

                            </FormItem>
                            <FormItem label="返现金">
                                {form.getFieldDecorator('returnAmount2', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入退款到返现金的金额',
                                        },
                                    ],
                                    initialValue: 0,
                                })(<Input placeholder="请输入退款到返现金的金额" />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}
