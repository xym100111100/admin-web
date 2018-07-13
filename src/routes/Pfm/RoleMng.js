import React, { Fragment } from 'react';
import { Button, Card, Divider, Popconfirm, Switch, Table, Tabs } from 'antd';
import { connect } from 'dva';
import SimpleMng from 'components/Rebue/SimpleMng';
import DragSortTable from 'components/Rebue/DragSortTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RoleForm from './RoleForm';
import RoleActiForm from './RoleActiForm';
import styles from './RoleMng.less';

const { TabPane } = Tabs;

@connect(({ pfmsys, pfmrole, pfmroleacti, pfmfunc, loading }) => ({
  pfmsys,
  pfmrole,
  pfmroleacti,
  pfmfunc,
  loading: loading.models.pfmrole,
  pfmsysloading: loading.models.pfmsys,
}))
export default class RoleMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'pfmrole';
    Object.assign(this.state, {
      options: {},
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

  // 启用/禁用角色
  handleEnable(record) {
    this.props.dispatch({
      type: `${this.moduleCode}/enable`,
      payload: { id: record.id, isEnabled: !record.isEnabled },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 比较drag和drop记录的大小
  compareDragRecordAndDropRecord = (dragRecord, hoverRecord) => {
    return dragRecord.orderNo > hoverRecord.orderNo;
  };

  // 移动行
  handleDrop = (dragRecord, dropRecord) => {
    this.props.dispatch({
      type: 'pfmrole/sort',
      payload: { dragCode: dragRecord.id, dropCode: dropRecord.id },
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { pfmsys: { pfmsys }, pfmrole: { pfmrole }, loading, pfmsysloading } = this.props;
    const { isDrag, editForm, editFormType, editFormTitle, editFormRecord, options } = this.state;
    const { sysId } = options;

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
        render: (text, record) => {
          if (isDrag) return null;
          return (
            <Fragment>
              <a
                onClick={() =>
                  this.showEditForm({
                    id: record.id,
                    moduleCode: 'pfmrole',
                    editForm: 'roleActiForm',
                    editFormTitle: '设置角色的功能动作',
                  })
                }
              >
                功能
              </a>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  this.showEditForm({ id: record.id, editForm: 'roleForm', editFormTitle: '编辑角色信息' })
                }
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="角色信息管理">
        <Card bordered={false} loading={pfmsysloading}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Tabs onChange={this.switchSys}>{pfmsys.map(sys => <TabPane tab={sys.name} key={sys.id} />)}</Tabs>
              <Button
                icon="plus"
                type="primary"
                disabled={isDrag}
                onClick={() =>
                  this.showAddForm({ editForm: 'roleForm', editFormTitle: '添加新角色', editFormRecord: { sysId } })
                }
              >
                添加
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
            <DragWrapper isDrag={isDrag} compare={::this.compareDragRecordAndDropRecord} onDrop={::this.handleDrop}>
              <Table rowKey="id" pagination={false} loading={loading} dataSource={pfmrole} columns={columns} />
            </DragWrapper>
          </div>
        </Card>
        {editForm === 'roleForm' && (
          <RoleForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave({ fields })}
          />
        )}
        {editForm === 'roleActiForm' && (
          <RoleActiForm
            loading={loading}
            sysId={sysId}
            roleId={editFormRecord.id}
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave({ fields, moduleCode: 'pfmroleacti' })}
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
