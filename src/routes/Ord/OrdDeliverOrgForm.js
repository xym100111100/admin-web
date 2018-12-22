import React, { Fragment, PureComponent } from 'react';
import { Form, Radio, Input, Row, Col, Select } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
// 添加与编辑的表单
@connect(({ kdisender, user, loading }) => ({
    kdisender, user,
    loading: loading.models.kdisender || loading.models.user
}))
@EditForm
export default class OrdDeliverOrgForm extends PureComponent {

    state = {
        ordData: [],
    }

    //初始化
    componentDidMount() {
        this.props.dispatch({
            type: `ordorder/listAll`,
            payload: {},
            callback: (data) => {
                this.setState({
                    ordData: data,
                })
            }
        });

    }

    render() {
        const { form } = this.props;
        const { ...props } = this.props;
        let listItems = this.state.ordData.map(items => {
            return (
                <Option value={items.id} key={items.id.toString()} >
                    {items.name}
                </Option>
            )
        })


        return (
            <Fragment>
                {form.getFieldDecorator('orderId')(<Input type="hidden" />)}
                {form.getFieldDecorator('onlineOrgId')(<Input type="hidden" />)}
                {form.getFieldDecorator('deliverOrgId')(<Input type="hidden" />)}
                <Form layout="inline">
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col push={4} md={20} sm={24}  >
                            <FormItem style={{ marginLeft: 15 }} label="供应商" >
                                {form.getFieldDecorator('supplierId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入选择供应商',
                                        },
                                    ],
                                })(
                                    <Select {...props} placeholder="请选择供应商" style={{ width: 170 }} >
                                        {listItems}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem style={{ marginLeft: 15 }} label="发货类型" >
                                {form.getFieldDecorator('deliver', {
                                  initialValue: 1,
                                })(
                                    <RadioGroup >
                                    <Radio value={1}>自发</Radio>
                                    <Radio value={2}>供应商</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}
