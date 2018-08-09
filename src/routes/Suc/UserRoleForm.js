import React, { PureComponent } from 'react';
import { Tabs, Transfer } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import styles from './UserRoleForm.less';

@connect(({ pfmsys, userrole, loading }) => ({
  pfmsys,
  userrole,
  loading: loading.models.pfmsys,
}))
@EditForm
export default class UserRoleForm extends PureComponent {
  state = {
    options: {},
  };

  componentDidMount() {
    // 刷新系统
    this.props.dispatch({
      type: `pfmsys/list`,
      callback: () => {
        const { pfmsys: { pfmsys }, id } = this.props;
        this.handleReload({ sysId: pfmsys[0].id, userId: id });
      },
    });
  }

  // 刷新
  handleReload(params) {
    if (params) {
      Object.assign(this.state.options, params);
    }
    const payload = this.state.options;
    // 刷新
    this.props.dispatch({
      type: `userrole/list`,
      payload,
    });
  }

  // 切换系统
  switchSys = activeKey => {
    const { id } = this.props;
    this.handleReload({ sysId: activeKey, userId: id });
  };

  handleChange = targetKeys => {
    const { userrole: { userrole } } = this.props;
    userrole.targetKeys = targetKeys;
    this.forceUpdate();
  };

  renderItem = item => {
    const customLabel = <span className="custom-item">{item.description}</span>;

    return {
      label: customLabel, // for displayed item
      value: item.description, // for title and filter matching
    };
  };

  render() {
    const TabPane = Tabs.TabPane;
    const { pfmsys: { pfmsys }, userrole: { userrole } } = this.props;
    return (
      <div className={styles.tableList}>
        <Tabs onChange={this.switchSys} defaultActiveKey="1">
          {pfmsys.map(sys => (
            <TabPane tab={sys.name} key={sys.id}>
              <Transfer
                titles={['未添加角色', '已添加角色']}
                dataSource={userrole.dataSource}
                listStyle={{
                  width: 300,
                  height: 300,
                }}
                targetKeys={userrole.targetKeys}
                onChange={this.handleChange}
                render={this.renderItem}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
