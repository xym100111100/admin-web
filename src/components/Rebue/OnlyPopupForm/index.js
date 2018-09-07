import React, { PureComponent } from 'react';
import { Button, Form, Modal } from 'antd';

// 编辑表单
const OnlyPopupForm = DivInfo => {
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
      const {
        title,
        visible,
        width = 520,
        height = 300,
        handleSave,
        closeModal,
        submitting,
        form,
        ...restProps
      } = this.props;
      return (
        <Modal
          style={{ marginTop: -90 }}
          visible={visible}
          title={title}
          closable={false}
          bodyStyle={{ overflow: 'scroll', height: height }}
          width={width}
          footer={
            <Button key="return" icon="rollback" size="large" onClick={closeModal}>
              返 回
            </Button>
          }
        >
          <DivInfo form={form} {...restProps} />
        </Modal>
      );
    }
  };
};

export default OnlyPopupForm;
