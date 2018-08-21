import { Form, Select } from 'antd';
import { PureComponent } from 'react';
import { connect } from 'dva';

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

  render() {
    const { kdicompany: { kdicompany }, loading } = this.props;
    const { Option } = Select;
    const { ...props } = this.props;
    if (kdicompany === undefined || kdicompany.length === 0) {
      return <Select placeholder="请选择快递公司" />;
    }
    const listItems = kdicompany.map(items => (
      <Option value={items.id + '/' + items.companyName + '/' + items.companyCode} key={items.id.toString()}>
        {items.companyName}
      </Option>
    ));
    return (
      <Select {...props} placeholder="请选择快递公司">
        {listItems}
      </Select>
    );
  }
}
