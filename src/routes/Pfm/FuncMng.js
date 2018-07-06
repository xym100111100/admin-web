import React, { Fragment } from 'react';
import { Button, Card, Divider, Popconfirm, Switch, Table, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import DragSortTable from 'components/Rebue/DragSortTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FuncMng.less';

const { TabPane } = Tabs;

@connect(({ pfmsys, pfmfunc, loading }) => ({
  pfmsys,
  pfmfunc,
  loading: loading.models.pfmfunc,
  pfmsysloading: loading.models.pfmsys,
}))
export default class FuncMng extends React.PureComponent {
  constructor() {
    super();
    this.moduleCode = 'pfmfunc';
    this.moduleName = '功能';
    this.state = {
      sysId: undefined,
      expandedRowKeys: [],
      isDrag: false,
    };
  }

  componentDidMount() {
    // 刷新
    this.props.dispatch({
      type: `pfmsys/refresh`,
      callback: () => {
        const { pfmsys: { pfmsys } } = this.props;
        this.handleReload({ sysId: pfmsys[0].id });
      },
    });
  }

  getList() {
    const { pfmfunc: { pfmfunc } } = this.props;
    return pfmfunc;
  }

  cloneList() {
    const { pfmfunc: { pfmfunc } } = this.props;
    return Object.assign(pfmfunc);
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

  // 刷新
  handleReload(params) {
    if (params) {
      this.state.options = params;
    }
    const payload = this.state.options;

    // 刷新
    this.props.dispatch({
      type: `${this.moduleCode}/refresh`,
      payload,
    });
  }

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
  // 启用/禁用功能
  handleEnable(record) {
    this.props.dispatch({
      type: 'pfmfunc/enable',
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
    const { pfmsys: { pfmsys }, pfmfunc: { pfmfunc }, loading, pfmsysloading } = this.props;
    const { expandedRowKeys, isDrag } = this.state;

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
                onChange={() => this.handleEnable(record)}
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
                  <a onClick={() => this.showEditForm(record.id)}>添加动作</a>
                  <Divider type="vertical" />
                </Fragment>
              )}
              {record.type === 'acti' && (
                <Fragment>
                  <a onClick={() => this.showEditForm(record.id)}>菜单</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.showEditForm(record.id)}>链接</a>
                  <Divider type="vertical" />
                </Fragment>
              )}
              <a onClick={() => this.showEditForm(record.id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record.id)}>
                <a>删除</a>
              </Popconfirm>
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
              <Tabs onChange={this.switchSys}>{pfmsys.map(sys => <TabPane tab={sys.sysName} key={sys.id} />)}</Tabs>
              <Button icon="plus" type="primary" disabled={isDrag} onClick={::this.showFuncAddForm}>
                添加功能
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
