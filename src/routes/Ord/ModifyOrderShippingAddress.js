import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import AddrCascader from 'components/Kdi/AddrCascader';
import styles from './ModifyOrderShippingAddress.less';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

@EditForm
export default class ModifyOrderShippingAddress extends PureComponent {
    constructor() {
        super();
        this.moduleCode = 'ordorder';
    }

    /**
     * 收发件人的自定义规则
     */
    provinceInfo = (rule, value, callback) => {
        if (value === undefined || value.length < 3) {
            callback('请选择完省市区 ');
        } else {
            callback();
        }
    };

    // 提交前事件
    beforeSave = () => {
        const { form } = this.props;
        form.getFieldDecorator('receiverProvince');
        form.getFieldDecorator('receiverCity');
        form.getFieldDecorator('receiverExpArea');
        form.validateFields((err, values) => {
            form.setFieldsValue({
                receiverProvince: values.receiverArea[0],
                receiverCity: values.receiverArea[1],
                receiverExpArea: values.receiverArea[2],
            });
        });
    }

    render() {
        const { form, record } = this.props;
        // 设置省市区初始值
        const receiverArea = [record.receiverProvince, record.receiverCity, record.receiverExpArea];
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 12 },
                md: { span: 16 },
            },
        };

        return (
            <Fragment>
                <Form>
                    {form.getFieldDecorator('id')(<Input type="hidden" />)}
                    <Form.Item {...formItemLayout} className={styles.formItem} label="收件人">
                        {form.getFieldDecorator('receiverName', {
                            rules: [{ required: true, message: '收件人不能为空' }, { whitespace: true, message: '收件人不能为空' }],
                        })(<Input placeholder="" />)}
                    </Form.Item>

                    <Form.Item {...formItemLayout} className={styles.formItem} label="手机">
                        {form.getFieldDecorator('receiverMobile', {
                            rules: [{ required: true, message: '收件人手机不能为空' }, { whitespace: true, message: '收件人手机不能为空' }],
                        })(<Input placeholder="" />)}
                    </Form.Item>

                    <Form.Item {...formItemLayout} className={styles.formItem} label="电话">
                        {form.getFieldDecorator('receiverTel', {
                            rules: [],
                        })(<Input placeholder="" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} className={styles.formItem} label="邮编">
                        {form.getFieldDecorator('receiverPostCode', {
                            rules: [{ required: true, message: '收件人邮编不能为空' }, { whitespace: true, message: '收件人邮编不能为空' }, {
                                pattern: /^\d{6}$/,
                                message: '请输入六位全部为数字的邮编',
                            }],
                            initialValue: '000000',
                        })(<Input placeholder="" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} className={styles.formItem} label="省市区">
                        {form.getFieldDecorator('receiverArea', {
                            rules: [{ required: true, message: '省市区不能为空' }, {
                                validator: this.provinceInfo,
                            }],
                            initialValue: receiverArea,
                        })(<AddrCascader />)}
                    </Form.Item>
                    <FormItem {...formItemLayout} className={styles.formItem} label="详细地址">
                        {form.getFieldDecorator('receiverAddress', {
                            rules: [
                                {
                                    required: true,
                                    message: '详细地址不能为空',
                                }, {
                                    whitespace: true,
                                    message: '详细地址不能为空'
                                }
                            ],
                        })(<Input placeholder="请输入详细的地址信息，如道路、门牌号、小区、楼栋号、单元等信息" />)}
                    </FormItem>
                </Form>
            </Fragment>
        );
    }
}
