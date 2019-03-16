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
                            placeholder='发货信息的顺序为:地址、姓名、手机号码、订单标题或买家留言，它们之间用空格隔开，并且每条发货信息用回车键换行隔开!&#10;例:&#10;河南省新乡市牧野区荣校路XX号XX小区     何XX       1563943XXXX    青枣一件    &#10;广东省深圳市宝安区圣明路XX号XXX小区        刘XX           1762531XXXX     一件血橙                            '
                        />)}
                </FormItem>
            </div>
        )
    }
}
