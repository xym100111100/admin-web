import React, { Fragment } from 'react';
import { Form, Input, Upload, Icon, Modal } from 'antd';
import EditForm from 'components/Rebue/EditForm';

const { TextArea } = Input;
const FormItem = Form.Item;

// 添加与编辑的表单
@EditForm
export default class SlrSearchCategoryForm extends React.Component {

    componentWillMount() {
        const { record, editFormType } = this.props;
        if (record.image !== undefined && editFormType === 'edit') {
            this.setState({
                fileList: [{
                    uid: record.id,
                    name: record.image,
                    status: 'done',
                    url: '/ise-svr/files' + record.image,
                }],
            })
        }
    }

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    // 提交前事件
    beforeSave = () => {
        const { form, editFormType, record } = this.props;
        // 店铺id
        let shopId = record.shopId === undefined ? record.id : record.shopId;
        // 分类id
        let id = editFormType === 'edit' ? record.id : undefined;
        const { fileList } = this.state;
        let image = undefined;
        if (fileList !== '[]' && fileList !== undefined && fileList.length !== 0) {
            image = fileList[0].response === undefined ? fileList[0].name : fileList[0].response.filePaths[0];
        }

        let name = undefined;
        let remark = undefined;
        form.validateFields((err, values) => {
            name = values.name;
            remark = values.remark;
        });

        form.getFieldDecorator('id');
        form.getFieldDecorator('sellerId');
        form.getFieldDecorator('shopId');
        form.getFieldDecorator('name');
        form.getFieldDecorator('remark');
        form.getFieldDecorator('code');
        form.setFieldsValue({
            id: id,
            sellerId: record.sellerId,
            shopId: shopId,
            image: image,
            code: record.code,
            name: name,
            remark: remark,
        })
    }

    render() {
        const { form } = this.props;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text" />
            </div>
        )

        const uploadData = {
            moduleName: 'searchCategory',
        };

        return (
            <Fragment>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称">
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入分类的名称' }],
                    })(<Input placeholder="请输入分类的名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类备注">
                    {form.getFieldDecorator('remark')(<TextArea placeholder="选填" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类图片">
                    {form.getFieldDecorator('image')(
                        <div className="clearfix">
                            <Upload
                                action="/ise-svr/ise/upload"
                                // action="http://192.168.1.203:36697/ise/upload"
                                listType="picture-card"
                                fileList={fileList}
                                name="multipartFile"
                                data={uploadData}
                                multiple={false}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>

                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>
                    )}
                </FormItem>
            </Fragment>
        );
    }
}
