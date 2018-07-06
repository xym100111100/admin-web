import React, { Fragment } from 'react';
import { Button, Card, Divider, Popconfirm, Switch, Table, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import DragSortTable from 'components/Rebue/DragSortTable';
import SimpleMng from 'components/Rebue/SimpleMng';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FuncForm from './FuncForm';
import ActiForm from './ActiForm';
import ActiMenuForm from './ActiMenuForm';
import styles from './FuncMng.less';

const { TabPane } = Tabs;

@connect(({ pfmsys, pfmfunc, pfmacti, pfmmenu, loading }) => ({
  pfmsys,
  pfmfunc,
  pfmacti,
  pfmmenu,
  loading: loading.models.pfmfunc || loading.models.pfmacti,
  pfmsysloading: loading.models.pfmsys,
}))
export default class FuncMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'pfmfunc';
    Object.assign(this.state, {
      options: {},
      expandedRowKeys: [],
      isDrag: false,
    });
  }

  componentDidMount() {
    // 刷新系统
    this.props.dispatch({
      type: `pfmsys/refresh`,
      callback: () => {
        const { pfmsys: { pfmsys } } = this.props;
        this.handleReload({ sysId: pfmsys[0].id });
        // 刷新菜单
        this.props.dispatch({
          type: 'pfmmenu/refresh',
          payload: { sysId: pfmsys[0].id },
          callback: () => {
            const { pfmmenu: { pfmmenu } } = this.props;
            console.log(pfmmenu);
          },
        });
      },
    });
  }

  // 切换系统
  switchSys = activeKey => {
    this.handleReload({ sysId: activeKey });
  };

  // 切换拖拽排序
  switchDrag = () => {
    const { isDrag } = this.state;
    this.setState({ isDrag: !isDrag });
  };

  // 展开/收起菜单的子节点
  handleExpand(expanded, record) {
    const { expandedRowKeys } = this.state;
    const temp = [];
    Object.assign(temp, expandedRowKeys);
    const key = record.type + record.id;
    if (expanded) {
      temp.push(key);
    } else {
      const removedIndex = temp.findIndex(item => item === key);
      if (removedIndex !== -1) {
        temp.splice(removedIndex, 1);
      }
    }
    this.setState({ expandedRowKeys: temp });
  }
  // 鉴权/忽略功能
  handleAuth(record) {
    this.props.dispatch({
      type: 'pfmacti/auth',
      payload: { id: record.id, isAuth: !record.isAuth },
      callback: () => {
        this.handleReload();
      },
    });
  }
  // 启用/禁用功能
  handleEnable(record) {
    const moduleCode = record.type === 'func' ? 'pfmfunc' : 'pfmacti';
    this.props.dispatch({
      type: `${moduleCode}/enable`,
      payload: { id: record.id, isEnabled: !record.isEnabled },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 开始drag时收起子节点
  beginDrag = dragRecord => {
    if (dragRecord.type === 'func') {
      this.setState({ expandedRowKeys: [] });
    }
  };

  // 比较drag和drop记录的大小
  compareDragRecordAndDropRecord = (dragRecord, hoverRecord) => {
    return dragRecord.orderNo > hoverRecord.orderNo;
  };

  // 判断能否drop到此节点
  canDrop = (dragRecord, hoverRecord) => {
    // 不是同类型不能drop
    if (hoverRecord.type !== dragRecord.type) return false;
    // 自己不能drop
    if (dragRecord.id === hoverRecord.id) return false;
    // 不是同一功能下的动作不能drop
    if (hoverRecord.type === 'acti' && hoverRecord.funcId !== dragRecord.funcId) return false;
    return true;
  };

  // 移动行
  handleDrop = (dragRecord, dropRecord) => {
    this.props.dispatch({
      type: 'pfmfunc/sort',
      payload: { dragCode: dragRecord.code, dropCode: dropRecord.code },
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { pfmsys: { pfmsys }, pfmfunc: { pfmfunc }, pfmmenu: { pfmmenu }, loading, pfmsysloading } = this.props;
    const { expandedRowKeys, isDrag, editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const { sysId } = this.state.options;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => (record.type === 'func' ? `[功能]${text}` : `[动作]${text}`),
      },
      {
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '是否鉴权',
        dataIndex: 'isAuth',
        render: (text, record) => {
          if (isDrag) return null;
          if (!record || record.type !== 'acti') return null;
          return (
            <Tooltip title={record.isAuth ? '通过鉴权判断用户是否能使用此动作' : '所有用户都能使用此动作'}>
              <Switch
                checkedChildren="鉴权"
                unCheckedChildren="忽略"
                checked={record.isAuth}
                loading={loading}
                onChange={() => this.handleAuth(record)}
              />
            </Tooltip>
          );
        },
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        render: (text, record) => {
          if (isDrag) return null;
          return (
            <Fragment>
              <Switch
                checkedChildren="启用"
                unCheckedChildren="禁止"
                checked={record.isEnabled}
                loading={loading}
                onChange={() => this.handleEnable(record)}
              />
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          if (isDrag) return null;
          return (
            <Fragment>
              {record.type === 'func' && (
                <Fragment>
                  <a onClick={() => this.showAddForm('actiForm', '添加新动作', { funcId: record.id, sysId })}>
                    添加新动作
                  </a>
                  <Divider type="vertical" />
                  <a onClick={() => this.showEditForm(record.id, this.moduleCode, 'funcForm', '编辑功能信息')}>编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record, this.moduleCode)}>
                    <a>删除</a>
                  </Popconfirm>
                </Fragment>
              )}
              {record.type === 'acti' && (
                <Fragment>
                  <a onClick={() => this.showEditForm(record.id, 'pfmacti', 'actiMenuForm', '设置动作的菜单')}>菜单</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.showEditForm(record.id)}>链接</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.showEditForm(record.id, 'pfmacti', 'actiForm', '编辑动作信息')}>编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record, 'pfmacti')}>
                    <a>删除</a>
                  </Popconfirm>
                </Fragment>
              )}
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="功能信息管理">
        <Card bordered={false} loading={pfmsysloading}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Tabs onChange={this.switchSys}>{pfmsys.map(sys => <TabPane tab={sys.name} key={sys.id} />)}</Tabs>
              <Button
                icon="plus"
                type="primary"
                disabled={isDrag}
                onClick={() => this.showAddForm('funcForm', '添加新功能', { sysId })}
              >
                添加新功能
              </Button>
              <Divider type="vertical" />
              拖拽排序:&nbsp;&nbsp;
              <Switch
                checked={isDrag}
                checkedChildren="开启"
                unCheckedChildren="禁止"
                loading={loading}
                onChange={::this.switchDrag}
              />
              <Divider type="vertical" />
              <Button icon="reload" onClick={() => this.handleReload()}>
                刷新
              </Button>
            </div>
            <DragWrapper
              isDrag={isDrag}
              beginDrag={::this.beginDrag}
              compare={::this.compareDragRecordAndDropRecord}
              canDrop={::this.canDrop}
              onDrop={::this.handleDrop}
            >
              <Table
                rowKey={record => record.type + record.id}
                expandedRowKeys={expandedRowKeys}
                onExpand={::this.handleExpand}
                pagination={false}
                loading={loading}
                dataSource={pfmfunc}
                columns={columns}
              />
            </DragWrapper>
          </div>
        </Card>
        {editForm === 'funcForm' && (
          <FuncForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave(fields, this.moduleCode)}
          />
        )}
        {editForm === 'actiForm' && (
          <ActiForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave(fields, 'pfmacti')}
          />
        )}
        {editForm === 'actiMenuForm' && (
          <ActiMenuForm
            // pfmmenu={pfmmenu}
            sysId={sysId}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave(fields, 'pfmactimenu')}
          />
        )}
      </PageHeaderLayout>
    );
  }
}

function DragWrapper(props) {
  const { children, isDrag, ...restProps } = props;
  if (isDrag) {
    return <DragSortTable {...restProps}>{children}</DragSortTable>;
  } else {
    return children;
  }
}
