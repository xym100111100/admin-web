/**
 * 用户传输框表单
 */
import React, { PureComponent, Fragment } from 'react';
import { Icon, Popover, Transfer, Pagination, Spin } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

/**
 * 获取显示用户简介的渲染内容
 * @param {{id:Number,loginName:String,realname:String,nickname:String,...}} user
 */
function getUserItem(user) {
  const title = user.realname || user.nickname || user.wxNickname || user.qqNickname || user.loginName;
  let description = '';
  if (user.loginName) description += `<p>登录名称：${user.loginName}</p>`;
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
  loading,
}))
@EditForm
export default class UserTransferForm extends PureComponent {
  state = {
    leftKeys: undefined,
    rightKeys: undefined,
  };

  /**
   * 处理两栏之间转移用户
   */
  handleUsersMove = (targetKeys, direction, moveKeys) => {
    const { dispatch, id, sucuser: { addedUsers, unaddedUsers }, modelName, movePayload } = this.props;
    // 调用的model
    const type = direction === 'left' ? `${modelName}/delUsers` : `${modelName}/addUsers`;
    // 已添加和未添加查询的页码
    const addedPageNum = addedUsers.pageNum;
    const unaddedPageNum = unaddedUsers.pageNum;
    const payload = { id, addedPageNum, unaddedPageNum, moveIds: moveKeys, ...movePayload };
    // 已添加和未添加用户模糊查询的关键字
    const addedKeys = this.state.rightKeys;
    const unaddedKeys = this.state.leftKeys;
    if (addedKeys) payload.addedKeys = addedKeys;
    if (unaddedKeys) payload.unaddedKeys = unaddedKeys;
    // 发出请求
    dispatch({
      type,
      payload,
    });
  };

  /**
   * 处理搜索
   * @param {String} direction (left/right)左边框还是右边框
   * @param {String} keys 模糊查询的关键字
   * @param {Number} pageNum 第几页
   */
  handleSearch = (direction, keys, pageNum) => {
    const { dispatch, id, modelName } = this.props;
    const type = direction === 'left' ? `${modelName}/listUnaddedUsers` : `${modelName}/listAddedUsers`;
    const payload = { id, keys, pageNum };
    dispatch({
      type,
      payload,
    });
  };

  /**
   * 处理输入关键字搜索
   */
  handleSearchChange = (direction, e) => {
    const { value } = e.target;
    if (direction === 'left') this.state.leftKeys = value;
    else this.state.rightKeys = value;
    this.handleSearch(direction, value, 1);
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
    const { sucuser: { addedUsers, unaddedUsers } } = this.props;
    const { filter, titleText } = props;

    // 判断左边框还是右边框
    const direction = titleText === '未添加用户' ? 'left' : 'right';
    const users = direction === 'left' ? unaddedUsers : addedUsers;

    // 获取总记录数
    const total = users.total - 0;
    // 获取第几页
    const current = users.pageNum - 0;
    // 获取每页大小
    const pageSize = users.pageSize - 0;

    return (
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        size="small"
        style={{ float: 'right', margin: 5 }}
        onChange={pageNum => this.handleSearch(direction, filter, pageNum)}
      />
    );
  };

  render() {
    const { sucuser: { addedUsers, unaddedUsers }, loading, modelName } = this.props;

    const dataSource = [];
    const targetKeys = [];

    for (const user of addedUsers.list) {
      dataSource.push(getUserItem(user));
      targetKeys.push(user.id);
    }
    for (const user of unaddedUsers.list) {
      dataSource.push(getUserItem(user));
    }

    return (
      <Spin spinning={loading.models[modelName]}>
        <Transfer
          titles={['未添加用户', '已添加用户']}
          dataSource={dataSource}
          targetKeys={targetKeys}
          listStyle={{
            width: 360,
            height: 360,
          }}
          showSearch
          filterOption={() => true}
          render={this.renderItem}
          footer={this.renderFooter}
          onChange={this.handleUsersMove}
          onSearchChange={this.handleSearchChange}
        />
      </Spin>
    );
  }
}
