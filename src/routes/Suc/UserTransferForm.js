/**
 * 用户传输框表单
 */
import React, { PureComponent, Fragment } from 'react';
import { Icon, Popover, Transfer, Tooltip, Pagination } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import styles from './UserTransferForm.less';

function getUserItem(user) {
  const title = user.realname || user.nickname || user.wxNickname || user.qqNickname;
  let description = '';
  if (user.realname) description += `<p>用户名称：${user.realname}</p>`;
  if (user.nickname) description += `<p>用户昵称：${user.nickname}</p>`;
  if (user.wxNickname) description += `<p>微信昵称：${user.wxNickname}</p>`;
  if (user.qqNickname) description += `<p>QQ昵称：${user.qqNickname}</p>`;
  if (user.mobile) description += `<p>电话号码：${user.mobile}</p>`;
  if (user.email) description += `<p>电子邮箱：${user.email}</p>`;
  if (user.idcard) description += `<p>身份证号：${user.idcard}</p>`;
  return {
    key: user.id,
    title,
    description,
  };
}

@connect(({ sucuser, loading }) => ({
  sucuser,
  loading: loading.models.sucuser,
}))
@EditForm
export default class UserTransferForm extends PureComponent {
  // state = {
  //   options: {},
  // };

  // componentDidMount() {
  //   const { moduleCode } = this.props;
  //   // 刷新
  //   this.props.dispatch({
  //     type: `${moduleCode}/listAddedAndUnaddedUsers`,
  //     payload,
  //   });
  // }

  // // 刷新
  // handleReload(params) {
  //   if (params) {
  //     Object.assign(this.state.options, params);
  //   }
  //   const payload = this.state.options;
  //   // 刷新
  //   this.props.dispatch({
  //     type: `${moduleCode}/listAddedAndUnaddedUsers`,
  //     payload,
  //   });
  // }

  handleChange = targetKeys => {
    const { pfmuserrole: { userrole } } = this.props;
    userrole.targetKeys = targetKeys;
    this.forceUpdate();
  };

  handleSearchChange = (direction, e) => {
    const { value } = e.target;
    // 重新搜索未添加用户列表
    if (direction === 'left') {
    } else {
      // 重新搜索已添加用户列表
    }
  };

  /**
   * 渲染每一个item
   */
  renderItem = item => {
    const content = <div dangerouslySetInnerHTML={{ __html: item.description }} />;
    const customLabel = (
      <Fragment>
        {item.title}
        &nbsp;
        <Popover content={content}>
          <Icon type="message" />
        </Popover>
      </Fragment>
    );
    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  };

  /**
   * 渲染底部分页
   */
  renderFooter = props => {
    console.log('renderFooter', props);

    return <Pagination size="small" defaultCurrent={1} total={500} style={{ float: 'right', margin: 5 }} />;
  };

  render() {
    const { sucuser: { addedSucUsers, unaddedSucUsers } } = this.props;

    const dataSource = [];
    const targetKeys = [];

    for (const user of addedSucUsers.list) {
      dataSource.push(getUserItem(user));
      targetKeys.push(user.id);
    }
    for (const user of unaddedSucUsers.list) {
      dataSource.push(getUserItem(user));
    }

    return (
      <Transfer
        titles={['未添加用户', '已添加用户']}
        dataSource={dataSource}
        targetKeys={targetKeys}
        listStyle={{
          width: 360,
          height: 360,
        }}
        showSearch
        render={this.renderItem}
        footer={this.renderFooter}
        onChange={this.handleChange}
        onSearchChange={this.handleSearchChange}
      />
    );
  }
}
