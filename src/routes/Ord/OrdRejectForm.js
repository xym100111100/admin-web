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
export default class OrdRejectForm extends PureComponent {
    render() {
        const { form } = this.props;
        return (
            <Fragment>
                <Form layout="inline">
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                {form.getFieldDecorator('returnCode')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderId')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderDetailId')(<Input type="hidden" />)}
                {form.getFieldDecorator('rejectOpId')(<Input type="hidden" />)}
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col md={24} sm={24}  >
                            <FormItem style={{ marginLeft: 15 }} label="拒绝原因">
                                {form.getFieldDecorator('rejectReason', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入拒绝原因',
                                        },
                                    ],
                                })(<Input placeholder="请输入退款到余额的金额" />)}

                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}
