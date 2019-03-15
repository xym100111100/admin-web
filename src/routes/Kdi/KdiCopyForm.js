import React, { Fragment, PureComponent } from 'react';
import { Form,  Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ kdisender, kdicompany, ordorder, user, loading }) => ({
    kdisender, user, ordorder, kdicompany,
    loading: loading.models.kdisender || loading.models.user || loading.models.ordorder || loading.models.kdicompany
}))
@EditForm
export default class KdiCopyForm extends PureComponent {
    render() {
        const { form, record } = this.props;
        return (
            <div style={{ height: 400 }}>
                <FormItem label='快递发件信息'>
                    {form.getFieldDecorator('receivingInformation', {
                        initialValue:record.receivingInformation,
                    })(<Input.TextArea
                            autosize={{ minRows: 10, maxRows: 16 }}
                            placeholder='发货信息的顺序为:地址、姓名、手机号码，它们之间用空格隔开;每条发货信息用回车键隔开'
                        />)}
                </FormItem>
            </div>
        )
    }
}
