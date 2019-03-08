import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;
const Option = Select.Option;

// 添加与编辑的表单
@connect(({ sucorg, loading }) => ({
    sucorg, loading: loading.models.sucorg
}))
@EditForm
export default class ShpShopForm extends React.Component {

    componentWillMount() {
        this.partnerSearch();
    }

    state = {
        orgData: [],
    }

    // 搜索伙伴
    partnerSearch = e => {
        this.props.dispatch({
            type: `sucorg/list`,
            payload: {
                pageNum: 1,
                pageSize: 5,
                keys: e,
            },
            callback: partner => {
                this.setState({
                    orgData: partner.list === undefined ? [] : partner.list
                })
            },
        });
    }

    beforeSave = () => {
        const { form } = this.props;
        let orgId = undefined;
        form.validateFields((err, values) => {
            orgId = values.orgId;
        });
    }

    render() {
        const { form, editFormType, record } = this.props;
        const { orgData } = this.state;
        return (
            <Fragment>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺名称">
                    {form.getFieldDecorator('shopName', {
                        rules: [{ required: true, message: '请输入店铺名称' }],
                        initialValue: record.id,
                    })(<Input placeholder="请输入店铺名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="店铺简称">
                    {form.getFieldDecorator('shopAbbre', {
                        rules: [{ required: true, message: '请输入店铺简称' }],
                        initialValue: record.name,
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
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属组织">
                    {form.getFieldDecorator('orgId', {
                        rules: [{ required: true, message: '请输入店铺的所属组织' }],
                        initialValue: record.orgId
                    })(
                        <Select
                            showSearch
                            placeholder={record.orgId === undefined ? "请输入组织名称" : record.orgId}
                            style={{ width: 250 }}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.partnerSearch}
                            notFoundContent="没有可选择的组织"
                        >
                            {orgData.map(d => <Option key={d.id}>{d.name}</Option>)}
                        </Select>
                    )}
                </FormItem>
            </Fragment>
        );
    }
}
