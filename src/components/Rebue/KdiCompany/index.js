import { Form, Select, Input } from 'antd';
import { PureComponent } from 'react';
import { connect } from 'dva';
const FormItem = Form.Item;
@connect(({ kdicompany, user, loading }) => ({
  kdicompany,
  user,
  loading: loading.models.kdicompany || loading.models.user,
}))
export default class KdiCompany extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdicompany';
  }

  componentDidMount() {
    // let {user} =this.props
    // let organizeId=user.currentUser.organizeId
    //这里连调的时候先写死organizeId
    let organizeId = 253274870;
    //初始化的时候加载快递公司
    this.props.dispatch({
      type: `kdicompany/list`,
      payload: { organizeId: organizeId },
    });
  }

  componentWillMount() {
    if (this.props.getShipper != undefined) {
      this.props.getShipper(this);
    }
  }

  render() {
    const { kdicompany: { kdicompany }, form, FormItemStyle, SelectStyle } = this.props;
    const { Option } = Select;
    const { ...props } = this.props;
    let defaultItems;
    if (kdicompany === undefined || kdicompany.length === 0) {
      return <Select placeholder="请选择快递公司" />;
    }
    const listItems = kdicompany.map(items => {
      if (items.isDefault === true) {
        defaultItems = items.id + '/' + items.companyName + '/' + items.companyCode;
        return (
          <Option value={items.id + '/' + items.companyName + '/' + items.companyCode} key={items.id.toString()}>
            {items.companyName}
          </Option>
        );
      } else {
        return (
          <Option value={items.id + '/' + items.companyName + '/' + items.companyCode} key={items.id.toString()}>
            {items.companyName}
          </Option>
        );
      }
    });
    return (
      <FormItem label="快递公司" style={FormItemStyle}>
        {form.getFieldDecorator('shipperName', {
          rules: [
            {
              required: true,
              message: '请输入快递公司',
            },
          ],
          initialValue: defaultItems,
        })(
          <Select {...props} style={SelectStyle} placeholder="请选择快递公司">
            {listItems}
          </Select>
        )}
      </FormItem>
    );
  }
}
