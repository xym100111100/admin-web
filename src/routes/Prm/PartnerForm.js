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
export default class PartnerForm extends PureComponent {

    render() {
        const { form, editFormType, record } = this.props;
        return (
            <Fragment>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="伙伴名称">
                    {form.getFieldDecorator('partnerName', {
                        rules: [{ required: true, message: '请输入伙伴的名称' }],
                        initialValue: record.partnerName,
                    })(<Input placeholder="请输入伙伴的名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="公司地址">
                    {form.getFieldDecorator('companyAddress', { initialValue: record.companyAddress })(<Input placeholder="请输入公司地址(选填)" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
                    {form.getFieldDecorator('contact', {
                        rules: [{ required: true, message: '请输入伙伴的联系方式' }],
                        initialValue: record.contact,
                    })(<Input placeholder="请输入伙伴的联系方式(名字+号码/号码)" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="伙伴类型">
                    {form.getFieldDecorator('partnerType', {
                        rules: [{ required: true, message: '请选择伙伴的类型' }],
                        initialValue: record.partnerType === undefined ? 1 : record.partnerType,
                    })(
                        <Select style={{ width: 120 }} >
                            <Option value="1">供应商</Option>
                            <Option value="2">经销商</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
                    {form.getFieldDecorator('remark', { initialValue: record.remark })(<Input placeholder="备注(选填)" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属业务员">
                    {form.getFieldDecorator('salesmanId', { initialValue: record.remark })(<Input placeholder="所属业务员(选填)" />)}
                </FormItem>
            </Fragment>
        );
    }
}