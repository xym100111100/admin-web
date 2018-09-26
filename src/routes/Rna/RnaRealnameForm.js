import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

@EditForm
export default class RnaRealnameForm extends PureComponent {
  render() {
    const { form } = this.props;
    return (
      <div>
        <div>
          <h2>
            用户名字:{form.getFieldValue('realName')}&nbsp;&nbsp;&nbsp;&nbsp;用户身份证:{form.getFieldValue('idCard')}
          </h2>
          <Fragment>
            <FormItem max="5" label="" style={{ width: 100 }}>
              {form.getFieldDecorator('id')(<Input type="hidden" />)}
            </FormItem>
            <FormItem max="5" label="" style={{ width: 100 }}>
              {form.getFieldDecorator('realName')(<Input type="hidden" />)}
            </FormItem>
          </Fragment>
        </div>
        <div style={{ marginTop: -40 }}>
          <img
            alt="身份证正反面及手持身份证正反面"
            style={{ height: 300, width: 450, margin: 5 }}
            src={`/ise-svr/files${form.getFieldValue('picOne')}`}
          />
          <img
            alt="身份证正反面及手持身份证正反面"
            style={{ height: 300, width: 450, margin: 5 }}
            src={`/ise-svr/files${form.getFieldValue('picTwo')}`}
          />
          <img
            alt="身份证正反面及手持身份证正反面"
            style={{ height: 300, width: 450, margin: 5 }}
            src={`/ise-svr/files${form.getFieldValue('picThree')}`}
          />
          <img
            alt="身份证正反面及手持身份证正反面"
            style={{ height: 300, width: 450, margin: 5 }}
            src={`/ise-svr/files${form.getFieldValue('picFour')}`}
          />
        </div>
      </div>
    );
  }
}
