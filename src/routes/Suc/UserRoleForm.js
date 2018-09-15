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

  /**
   *  切换系统
   */
  switchSys = activeKey => {
    const { userId } = this.props;
    this.handleReload({ sysId: activeKey, userId });
  };

  /**
   * 处理两栏之间转移角色
   */
  handleRolesMove = (targetKeys1, direction, moveKeys) => {
    // const { pfmuserrole: { userrole } } = this.props;
    // userrole.targetKeys = targetKeys;
    // this.forceUpdate();
    const { dispatch, userId } = this.props;
    const { sysId } = this.state.options;
    console.log(sysId);

    // 调用的model
    const type = direction === 'left' ? 'pfmuserrole/delRoles' : 'pfmuserrole/addRoles';
    const payload = { userId, sysId, moveIds: moveKeys };
    // 发出请求
    dispatch({
      type,
      payload,
    });
  };

  /**
   * 渲染每一个item
   */
  renderItem = item => {
    const customLabel = <Tooltip title={item.description}>{item.title}</Tooltip>;
    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  };

  render() {
    const { pfmsys: { pfmsys }, pfmuserrole: { userrole } } = this.props;

    // 将model中的roles转成穿梭框需要的dataSource
    const dataSource = [];
    for (const role of userrole.roles) {
      dataSource.push({
        key: role.id,
        title: role.name,
        description: role.remark,
      });
    }

    return (
      <div className={styles.tableList}>
        <Tabs onChange={this.switchSys} defaultActiveKey="1">
          {pfmsys.map(sys => (
            <TabPane tab={sys.name} key={sys.id}>
              <Transfer
                titles={['未添加角色', '已添加角色']}
                dataSource={dataSource}
                targetKeys={userrole.existIds}
                listStyle={{
                  width: 310,
                  height: 310,
                }}
                onChange={this.handleRolesMove}
                render={this.renderItem}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
