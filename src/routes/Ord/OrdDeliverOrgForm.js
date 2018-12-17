import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Row, Col, Select } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
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
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                <Form layout="inline">
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                        <Col push={4} md={20} sm={24}  >
                            <FormItem style={{ marginLeft: 15 }} label="供应商" >
                                {form.getFieldDecorator('deliverOrgId', {
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
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}
