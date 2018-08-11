import { Form, Select } from 'antd';
import { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ kdicompany, loading }) => ({ kdicompany, loading: loading.models.kdicompany }))
export default class KdiCompany extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdicompany';
  }
  componentDidMount() {
    //初始化的时候加载快递公司
    this.props.dispatch({
      type: `kdicompany/list`,
      payload: {},
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
