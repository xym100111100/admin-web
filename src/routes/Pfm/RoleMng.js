import React, { Fragment } from 'react';
import { Button, Card, Col, Divider, Input, message, Popconfirm, Row, Switch, Table, Tabs } from 'antd';
import { connect } from 'dva';
import SimpleMng from 'components/Rebue/SimpleMng';
import DragSortTable from 'components/Rebue/DragSortTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TreeUtils from '../../utils/TreeUtils';
import styles from './RoleMng.less';

const { TabPane } = Tabs;

@connect(({ pfmsys, pfmrole, loading }) => ({
  pfmsys,
  pfmrole,
  loading: loading.models.pfmrole,
  pfmsysloading: loading.models.pfmsys,
}))
export default class RoleMng extends SimpleMng {
  state = {
    sysId: undefined,
    isDrag: false,
  };

  constructor() {
    super();
    this.moduleCode = 'pfmrole';
    this.moduleName = '角色';
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
    const { pfmrole: { pfmrole } } = this.props;
    return pfmrole;
  }

  cloneList() {
    const { pfmrole: { pfmrole } } = this.props;
    return Object.assign(pfmrole);
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

  // 启用/禁用角色
  handleEnable(record) {
    this.props.dispatch({
      type: 'pfmrole/enable',
      payload: { id: record.id, isEnabled: !record.isEnabled },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 移动行
  moveRow = (dragRecord, dropRecord) => {
    this.props.dispatch({
      type: 'pfmrole/sort',
      payload: { dragCode: dragRecord.code, dropCode: dropRecord.code },
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { pfmsys: { pfmsys }, pfmrole: { pfmrole }, loading, pfmsysloading } = this.props;
    const { isDrag } = this.state;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        render: (text, record) => {
          if (isDrag) return null;
          return (
            <Fragment>
              <Switch checked={record.isEnabled} loading={loading} onChange={() => this.handleEnable(record)} />
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditForm(record.id)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="角色信息管理">
        <Card bordered={false} loading={pfmsysloading}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Tabs onChange={this.switchSys}>{pfmsys.map(sys => <TabPane tab={sys.name} key={sys.id} />)}</Tabs>
              <Button icon="plus" type="primary" disabled={isDrag} onClick={() => this.showAddEditor()}>
                添加
              </Button>
              <Divider type="vertical" />
              拖拽排序:{' '}
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
            <DragWrapper isDrag={isDrag}>
              <Table
                rowKey="id"
                pagination={false}
                loading={loading}
                dataSource={pfmrole}
                columns={columns}
                moveRow={::this.moveRow}
              />
            </DragWrapper>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

function DragWrapper(props) {
  const { children, isDrag } = props;
  if (isDrag) {
    return <DragSortTable>{children}</DragSortTable>;
  } else {
    return children;
  }
}
