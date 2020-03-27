import React, { PureComponent } from 'react';
import { Button, Form, Modal } from 'antd';

// 编辑表单
const SenderForm = DivInfo => {
  return @Form.create({
    mapPropsToFields(props) {
      const { record } = props;
      const result = {};
      for (const key in record) {
        if ({}.hasOwnProperty.call(record, key)) {
          result[key] = Form.createFormField({
            value: record[key],
          });
        }
      }
      return result;
    },
  })
  class extends PureComponent {
    render() {
      const { title, visible, width = 520, handleSave, closeModal, submitting, form, ...restProps } = this.props;
      const handleOk = () => {
        form.validateFieldsAndScroll((err, fields) => {
          if (err) return;
          handleSave(fields);
        });
      };
      return (
        <Modal
          // visible={visible}
          title={title}
          closable={false}
          bodyStyle={{ overflow: 'scroll' }}
          width={width}
          footer={[
            <Button style={{ marginLeft: 60 }}>新增联系人</Button>,
            <Button style={{ marginLeft: 20 }}>设为默认联系人</Button>,
            <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
              清空
            </Button>,
          ]}
        >
          <DivInfo form={form} {...restProps} />
        </Modal>
      );
    }
  };
};

export default SenderForm;
