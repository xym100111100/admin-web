import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

@EditForm
export default class OrdMngForm extends PureComponent {
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
          <img style={{ height: 300, width: 450, margin: 5 }} src={'ise-svr' + form.getFieldValue('picOne')} />
          <img style={{ height: 300, width: 450, margin: 5 }} src={'ise-svr' + form.getFieldValue('picTwo')} />
          <img style={{ height: 300, width: 450, margin: 5 }} src={'ise-svr' + form.getFieldValue('picThree')} />
          <img style={{ height: 300, width: 450, margin: 5 }} src={'ise-svr' + form.getFieldValue('picFour')} />
        </div>
      </div>
    );
  }
}
