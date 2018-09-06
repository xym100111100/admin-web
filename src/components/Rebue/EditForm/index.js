import React, { PureComponent } from 'react';
import { Button, Form, Modal, Icon } from 'antd';

// 编辑表单
const EditForm = DivInfo => {
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
    handleSave = () => {
      const { form, onSave } = this.props;
      form.validateFieldsAndScroll((err, fields) => {
        if (err) return;
        onSave(fields);
      });
    };
    handleNext = () => {
      const { form, onNext } = this.props;
      form.validateFieldsAndScroll((err, fields) => {
        if (err) return;
        onNext(fields);
      });
    };
    handleSubmit = () => {
      const { form, onSubmit } = this.props;
      form.validateFieldsAndScroll((err, fields) => {
        if (err) return;
        onSubmit(fields);
      });
    };

    render() {
      const {
        title,
        visible,
        form,
        onSave,
        onNext,
        onSubmit,
        closeModal,
        submitting,
        width = 520,
        ...restProps
      } = this.props;
      return (
        <Modal
          visible={visible}
          title={title}
          closable={false}
          width={width}
          footer={[
            <Button key="return" icon="rollback" size="large" onClick={closeModal}>
              返 回
            </Button>,
            onSave && (
              <Button key="save" icon="check" size="large" loading={submitting} onClick={this.handleSave}>
                保 存
              </Button>
            ),
            onNext && (
              <Button key="next" icon="fall" size="large" loading={submitting} onClick={this.handleNext}>
                下一条
              </Button>
            ),
            onSubmit && (
              <Button
                key="submit"
                icon="upload"
                type="primary"
                size="large"
                loading={submitting}
                onClick={this.handleSubmit}
              >
                提 交
              </Button>
            ),
          ]}
        >
          <DivInfo form={form} {...restProps} />
        </Modal>
      );
    }
  };
};

export default EditForm;
