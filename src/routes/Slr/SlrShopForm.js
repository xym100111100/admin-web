import React, { Fragment } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ sucorg, loading }) => ({
    sucorg, loading: loading.models.sucorg
}))
@EditForm
export default class SlrShopForm extends React.Component {

    /**
     * 提交前事件
     */
    beforeSave = () => {
        const { form, record, editFormType } = this.props;
        // 卖家id/组织id
        let sellerId = undefined;
        // 店铺id
        let shopId = undefined;
        if (editFormType === 'add') {
            sellerId = record.id;
        } else {
            sellerId = record.sellerId;
            shopId = record.id;
        }

        // 门店名称
        let shopName = undefined;
        // 门店简称
        let shopAbbre = undefined;
        // 地址
        let adderss = undefined;
        // 经度
        let latitude = undefined;
        // 纬度
        let longitude = undefined;
        // 联系方式
        let contact = undefined;

        form.validateFields((err, values) => {
            console.log(values);
            // 门店名称
            shopName = values.shopName;
            // 门店简称
            shopAbbre = values.shopAbbre;
            // 地址
            adderss = values.adderss;
            // 经度
            latitude = values.latitude;
            // 纬度
            longitude = values.longitude;
            // 联系方式
            contact = values.contact;
        });

        form.getFieldDecorator('sellerId');
        form.getFieldDecorator('shopName');
        form.getFieldDecorator('shopAbbre');
        form.getFieldDecorator('adderss');
        form.getFieldDecorator('latitude');
        form.getFieldDecorator('longitude');
        form.getFieldDecorator('contact');
        form.setFieldsValue({
            // 门店id
            id: shopId,
            // 卖家id
            sellerId: sellerId,
            // 门店名称
            shopName: shopName,
            // 门店简称
            shopAbbre: shopAbbre,
            // 地址
            adderss: adderss,
            // 经度
            latitude: latitude,
            // 纬度
            longitude: longitude,
            // 联系方式
            contact: contact,
        });
    }

    render() {
        const { form, record } = this.props;
        return (
            <Fragment>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺名称">
                    {form.getFieldDecorator('shopName', {
                        rules: [{ required: true, message: '请输入店铺名称' }],
                        initialValue: record.shopName,
                    })(<Input placeholder="请输入店铺名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺简称">
                    {form.getFieldDecorator('shopAbbre', {
                        rules: [{ required: true, message: '请输入店铺简称' }],
                        initialValue: record.shopAbbre,
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