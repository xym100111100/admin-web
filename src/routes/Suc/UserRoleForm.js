import React, { PureComponent } from 'react';
import { Tabs, Transfer, Tooltip } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import styles from './UserRoleForm.less';

const { TabPane } = Tabs;

@connect(({ pfmsys, pfmuserrole, loading }) => ({
  pfmsys,
  pfmuserrole,
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
        const { pfmsys: { pfmsys }, userId } = this.props;
        this.handleReload({ sysId: pfmsys[0].id, userId });
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
      type: `pfmuserrole/listUserRoles`,
      payload,
    });
  }

  // 切换系统
  switchSys = activeKey => {
    const { userId } = this.props;
    this.handleReload({ sysId: activeKey, userId });
  };

  handleChange = targetKeys => {
    const { pfmuserrole: { userrole } } = this.props;
    userrole.targetKeys = targetKeys;
    this.forceUpdate();
  };

  renderItem = item => {
    const customLabel = <Tooltip title={item.description}>{item.title}</Tooltip>;
    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  };

  render() {
    const { pfmsys: { pfmsys }, pfmuserrole: { userrole } } = this.props;

    return (
      <div className={styles.tableList}>
        <Tabs onChange={this.switchSys} defaultActiveKey="1">
          {pfmsys.map(sys => (
            <TabPane tab={sys.name} key={sys.id}>
              <Transfer
                titles={['未添加角色', '已添加角色']}
                dataSource={userrole.dataSource}
                targetKeys={userrole.targetKeys}
                listStyle={{
                  width: 310,
                  height: 310,
                }}
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
