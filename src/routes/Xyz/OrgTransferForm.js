/**
 * 组织传输框表单
 */
import React, { PureComponent, Fragment } from 'react';
import { Icon, Popover, Transfer, Pagination, Spin } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

/**
 * 获取显示组织简介的渲染内容
 * @param {{id:Number,name:String,...}} org
 */
function getUserItem(org) {
  const title = org.name;
  let description = '';
  if (org.name) description += `<p>组织名称：${org.name}</p>`;
  return {
    key: org.id,
    title,
    description,
  };
}


@connect(({ xyzarea, loading }) => ({
  xyzarea,
  loading,
}))
@EditForm
export default class OrgTransferForm extends PureComponent {
  state = {
    leftKeys: undefined,
    rightKeys: undefined,
    unaddedOrgs: {},
    addedOrgs: {}
  };


  //初始化
  componentDidMount() {
    this.props.dispatch({
      type: `xyzarea/listAddedAndUnaddedOrgs`,
      payload: { id: this.props.id },
      callback: (data) => {
        this.setState({
          unaddedOrgs: data.unaddedOrgs,
          addedOrgs: data.addedOrgs

        })
      },
    });

  }

  /**
   * 处理两栏之间转移组织
   */
  handleOrgsMove = (targetKeys, direction, moveKeys) => {
    const { dispatch, id, xyzarea: { addedOrgs, unaddedOrgs }, modelName, movePayload } = this.props;
    // 调用的model
    const type = direction === 'left' ? `${modelName}/delOrgs` : `${modelName}/addOrgs`;
    // 已添加和未添加查询的页码

    const payload = { id, moveIds: moveKeys, ...movePayload };
    // 已添加和未添加组织模糊查询的关键字
    const addedKeys = this.state.rightKeys;
    const unaddedKeys = this.state.leftKeys;
    if (addedKeys) payload.addedKeys = addedKeys;
    if (unaddedKeys) payload.unaddedKeys = unaddedKeys;
    // 发出请求
    dispatch({
      type,
      payload,
      callback: (data) => {
        this.props.dispatch({
          type: `xyzarea/listAddedAndUnaddedOrgs`,
          payload: { id: this.props.id },
          callback: (data) => {
            this.setState({
              unaddedOrgs: data.unaddedOrgs,
              addedOrgs: data.addedOrgs

            })
          },
        });
      },
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
    const type = direction === 'left' ? `${modelName}/listUnaddedOrgs` : `${modelName}/listAddedOrgs`;
    const payload = { id, keys, pageNum };
    dispatch({
      type,
      payload,
      callback: (data) => {
        if (direction === 'left') {
          this.setState({
            unaddedOrgs: data
          })
        } else {
          this.setState({
            addedOrgs: data
          })
        }
      },
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
   * 渲染底部分页,未完成
   */
  renderFooter = props => {
    if (this.state.unaddedOrgs !== undefined && this.state.unaddedOrgs.list !== undefined) {

      const { filter, titleText } = props;
      // 判断左边框还是右边框
      const direction = titleText === '未添加组织' ? 'left' : 'right';
      const orgs = direction === 'left' ? this.state.unaddedOrgs : this.state.addedOrgs;
      // 获取总记录数
      const total = orgs.total - 0;
      // 获取第几页
      const current = orgs.pageNum - 0;
      // 获取每页大小
      const pageSize = orgs.pageSize - 0;
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
    }
  };

  render() {



    const dataSource = [];
    const targetKeys = [];

    if (this.state.addedOrgs !== undefined && this.state.addedOrgs.list !== undefined) {
      for (const org of this.state.addedOrgs.list) {
        dataSource.push(getUserItem(org));
        targetKeys.push(org.id);
      }
    }

    if (this.state.unaddedOrgs !== undefined && this.state.unaddedOrgs.list !== undefined) {
      for (const org of this.state.unaddedOrgs.list) {

        dataSource.push(getUserItem(org));
      }

    }
    return (
      <Transfer
        titles={['未添加组织', '已添加组织']}
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
        onChange={this.handleOrgsMove}
        onSearchChange={this.handleSearchChange}
      />
    );
  }
}
