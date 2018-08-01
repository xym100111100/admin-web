import { Input, Card } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';
import React, { Fragment, PureComponent } from 'react';
import styles from './ActiUrnForm.less';

const { TextArea } = Input;

// 添加与编辑的表单
@connect(({ pfmactiurn, loading }) => ({
  pfmactiurn,
  loading: loading.models.pfmactiurn,
}))
@EditForm
export default class ActiMenuForm extends PureComponent {
  constructor() {
    super();
    this.state = { urns: [] };
  }

  componentDidMount() {
    const { actiId } = this.props;
    // 刷新
    this.props.dispatch({
      type: 'pfmactiurn/list',
      payload: { actiId },
      callback: () => {
        const { form, pfmactiurn: { pfmactiurn } } = this.props;
        const urns = [];
        for (const item of pfmactiurn) {
          urns.push(`${item.urn}`);
        }
        form.setFieldsInitialValue({ actiId, urns });
        this.setState({ urns });
      },
    });
  }

  handleChange = event => {
    const { form } = this.props;
    const text = event.target.value;
    text.split('\r\n');
    const urns = text.split('\r\n');
    form.setFieldsValue({ urns });
  };

  render() {
    const { form, loading } = this.props;
    const { urns } = this.state;

    let text = '';
    for (const urn of urns) {
      text += `${urn}\r\n`;
    }

    return (
      <Fragment>
        {form.getFieldDecorator('actiId')(<Input type="hidden" />)}
        {form.getFieldDecorator('urns')(<Input type="hidden" />)}
        <Card loading={loading} bordered={false} className={styles.body}>
          <p>链接URN地址（多个地址用换行隔开）:</p>
          <TextArea size="large" rows={15} onChange={this.handleChange} defaultValue={text} />
        </Card>
      </Fragment>
    );
  }
}
