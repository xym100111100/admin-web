import React, { Fragment } from 'react';
import { Form, Input, Upload, Icon, Modal } from 'antd';
import EditForm from 'components/Rebue/EditForm';

const { TextArea } = Input;
const FormItem = Form.Item;

// 添加与编辑的表单
@EditForm
export default class PrdCategoryForm extends React.Component {

    componentWillMount() {

    }

    state = {
    };



    // 提交前事件
    beforeSave = () => {
        const { form, editFormType, record } = this.props;
        
        // 分类id
        let id = editFormType === 'edit' ? record.id : undefined;

        let name = undefined;
        let fullName = undefined;
        form.validateFields((err, values) => {
            name = values.name;
            fullName = values.fullName;
        });

        form.getFieldDecorator('id');
        form.getFieldDecorator('name');
        form.getFieldDecorator('fullName');
        form.getFieldDecorator('code');
        form.getFieldDecorator('opId');
        form.setFieldsValue({
            id: id,
            code: record.code,
            opId: record.opId,
            name: name,
            fullName: fullName,
        })
    }

    render() {
        const { form, } = this.props;
        return (
            <Fragment>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称">
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入分类的名称' }],
                    })(<Input placeholder="请输入分类的名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类全称">
                    {form.getFieldDecorator('fullName')(<Input placeholder="请输入分类全称" />)}
                </FormItem>
            </Fragment>
        );
    }
}
