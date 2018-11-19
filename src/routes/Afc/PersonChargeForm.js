import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;
import EditForm from 'components/Rebue/EditForm';

@EditForm
export default class PersonChargeForm extends PureComponent {
    constructor() {
        console.info(333333);
        super();
        this.moduleCode = 'afcpersoncharge';
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
    }
    render() {
        console.info(this.props);
        const { form } = this.props;
        return (
            <Fragment>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label="充值账号">
                        {form.getFieldDecorator('chargeAccount', {
                            rules: [
                                {
                                required: true,
                                message: '请输入充值账号',
                                },{ whitespace: true, message: '充值账号不能为空' }
                            ],
                        })(<Input placeholder="" />)}
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            充值
                        </Button>
                    </FormItem>
                </Form>
            </Fragment>
        );
    }
}