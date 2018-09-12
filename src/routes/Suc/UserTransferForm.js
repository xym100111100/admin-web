/**
 * 用户传输框表单
 */
import React, { PureComponent } from 'react';
import { Tabs, Transfer, Tooltip, Pagination } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import styles from './UserTransferForm.less';

const { TabPane } = Tabs;

@connect(({ sucuser, loading }) => ({
  sucuser,
  loading: loading.models.sucuser,
}))
@EditForm
export default class UserTransferForm extends PureComponent {
  // state = {
  //   options: {},
  // };

  componentDidMount() {
    // // 刷新系统
    // this.props.dispatch({
    //   type: `pfmsys/list`,
    //   callback: () => {
    //     const { pfmsys: { pfmsys }, userId } = this.props;
    //     this.handleReload({ sysId: pfmsys[0].id, userId });
    //   },
    // });
  }

  // 刷新
  handleReload(params) {
    // if (params) {
    //   Object.assign(this.state.options, params);
    // }
    // const payload = this.state.options;
    // // 刷新
    // this.props.dispatch({
    //   type: `pfmuserrole/listUserRoles`,
    //   payload,
    // });
  }

  handleChange = targetKeys => {
    const { pfmuserrole: { userrole } } = this.props;
    userrole.targetKeys = targetKeys;
    this.forceUpdate();
  };

  handleSearchChange = (direction, e) => {
    // 重新搜索用户列表
    if (direction === 'left') {
    } else {
      // 过滤已存在的用户
    }
  };

  renderItem = item => {
    const customLabel = <Tooltip title={item.description}>{item.title}</Tooltip>;
    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  };

  filterOption = (inputValue, option) => {
    console.log(inputValue, option);

    return option.description.indexOf(inputValue) > -1;
  };

  /**
   * 渲染底部分页
   */
  renderFooter = () => {
    return <Pagination size="small" defaultCurrent={1} total={500} style={{ float: 'right', margin: 5 }} />;
  };

  render() {
    // const { pfmsys: { pfmsys }, pfmuserrole: { userrole } } = this.props;

    return (
      <Transfer
        titles={['未添加用户', '已添加用户']}
        // dataSource={userrole.dataSource}
        // targetKeys={userrole.targetKeys}
        listStyle={{
          width: 360,
          height: 360,
        }}
        showSearch
        filterOption={this.filterOption}
        render={this.renderItem}
        footer={this.renderFooter}
        onChange={this.handleChange}
        onSearchChange={this.handleSearchChange}
      />
    );
  }
}
