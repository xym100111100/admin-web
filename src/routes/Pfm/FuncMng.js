import React, { Fragment } from 'react';
import { Button, Card, Tag, Divider, Icon, Popconfirm, Switch, Table, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import DragSortTable from 'components/Rebue/DragSortTable';
import SimpleMng from 'components/Rebue/SimpleMng';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FuncForm from './FuncForm';
import ActiForm from './ActiForm';
import ActiMenuForm from './ActiMenuForm';
import ActiUrnForm from './ActiUrnForm';
import styles from './FuncMng.less';

const { TabPane } = Tabs;

@connect(({ pfmsys, pfmfunc, pfmacti, pfmactimenu, pfmactiurn, pfmmenu, loading }) => ({
  pfmsys,
  pfmfunc,
  pfmacti,
  pfmactimenu,
  pfmactiurn,
  pfmmenu,
  loading:
    loading.models.pfmsys ||
    loading.models.pfmfunc ||
    loading.models.pfmacti ||
    loading.models.pfmactimenu ||
    loading.models.pfmactiurn ||
    loading.models.pfmmenu,
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
      type: `pfmsys/list`,
      callback: () => {
        const { pfmsys: { pfmsys } } = this.props;
        this.handleReload({ sysId: pfmsys[0].id });
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
      payload: { dragCode: dragRecord.id, dropCode: dropRecord.id },
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { pfmsys: { pfmsys }, pfmfunc: { pfmfunc }, loading, pfmsysloading } = this.props;
    const { expandedRowKeys, isDrag, editForm, editFormType, editFormTitle, editFormRecord, options } = this.state;
    const { sysId } = options;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          return (
            <Fragment>
              {record.type === 'func' && (
                <Tag color="purple">
                  功能<Icon type="tags" />
                </Tag>
              )}
              {record.type === 'acti' && (
                <Tag color="purple">
                  动作<Icon type="tag" />
                </Tag>
              )}
              {text}
            </Fragment>
          );
        },
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
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁止"
              checked={record.isEnabled}
              loading={loading}
              onChange={() => this.handleEnable(record)}
            />
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
                  <a
                    onClick={() =>
                      this.showAddForm({
                        editForm: 'actiForm',
                        editFormTitle: '添加新动作',
                        editFormRecord: { funcId: record.id, sysId },
                      })
                    }
                  >
                    添加新动作
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() =>
                      this.showEditForm({ id: record.id, editForm: 'funcForm', editFormTitle: '编辑功能信息' })
                    }
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                    <a>删除</a>
                  </Popconfirm>
                </Fragment>
              )}
              {record.type === 'acti' && (
                <Fragment>
                  <a
                    onClick={() =>
                      this.showEditForm({
                        id: record.id, // 通过id调用getById方法请求获取记录并设置状态的editFormRecord
                        moduleCode: 'pfmactimenu',
                        editForm: 'actiMenuForm',
                        editFormTitle: '设置动作的菜单',
                      })
                    }
                  >
                    菜单
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() =>
                      this.showEditForm({
                        id: record.id, // 通过id调用getById方法请求获取记录并设置状态的editFormRecord
                        moduleCode: 'pfmactiurn',
                        editForm: 'actiUrnForm',
                        editFormTitle: '设置动作的链接',
                      })
                    }
                  >
                    链接
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() =>
                      this.showEditForm({
                        id: record.id, // 通过id调用getById方法请求获取记录并设置状态的editFormRecord
                        moduleCode: 'pfmacti',
                        editForm: 'actiForm',
                        editFormTitle: '编辑动作信息',
                      })
                    }
                  >
                    编辑
                  </a>
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
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false} loading={pfmsysloading}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Tabs onChange={this.switchSys}>{pfmsys.map(sys => <TabPane tab={sys.name} key={sys.id} />)}</Tabs>
                <Button
                  icon="plus"
                  type="primary"
                  disabled={isDrag}
                  onClick={() =>
                    this.showAddForm({ editForm: 'funcForm', editFormTitle: '添加新功能', editFormRecord: { sysId } })
                  }
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
        </PageHeaderLayout>,
        {editForm === 'funcForm' && (
          <FuncForm
            record={editFormRecord}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields })}
          />
        )}
        {editForm === 'actiForm' && (
          <ActiForm
            record={editFormRecord}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'pfmacti' })}
          />
        )}
        {editForm === 'actiMenuForm' && (
          <ActiMenuForm
            actiId={editFormRecord.id}
            sysId={sysId}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'pfmactimenu' })}
          />
        )}
        {editForm === 'actiUrnForm' && (
          <ActiUrnForm
            actiId={editFormRecord.id}
            visible
            width={650}
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'pfmactiurn' })}
          />
        )}
      </Fragment>
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
