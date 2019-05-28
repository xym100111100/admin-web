import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ slrseller, slrshop, user, slrshopaccount, loading }) => ({ slrseller, slrshop, user, slrshopaccount, loading: loading.models.slrseller, user }))
@EditForm
export default class SlrShopForm extends PureComponent {



    render() {
        const { form, record } = this.props;

        return (
            <Fragment>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                {form.getFieldDecorator('accountId')(<Input type="hidden" />)}
                {form.getFieldDecorator('sellerId')(<Input type="hidden" />)}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺名称">
                    {form.getFieldDecorator('shopName', {
                        rules: [{ required: true, message: '请输入店铺名称' }],
                        initialValue: record.shopName,
                    })(<Input placeholder="请输入店铺名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺简称">
                    {form.getFieldDecorator('shortName', {
                        rules: [{ required: true, message: '请输入店铺简称' }],
                        initialValue: record.shortName,
                    })(<Input placeholder="请输入店铺简称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地址">
                    {form.getFieldDecorator('adderss', { initialValue: record.remark })(<Input placeholder="请输入店铺地址" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="经度">
                    {form.getFieldDecorator('latitude', { initialValue: record.remark })(<Input placeholder="请输入店铺经度" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="纬度">
                    {form.getFieldDecorator('longitude', { initialValue: record.remark })(<Input placeholder="请输入店铺纬度" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
                    {form.getFieldDecorator('contact', {
                        rules: [{ required: true, message: '请输入店铺的联系方式' }],
                        initialValue: record.contact
                    })(<Input placeholder="请输入店铺联系方式" />)}
                </FormItem>
            </Fragment>
        );
    }
}
