import React, { Fragment } from 'react';
import { Button, Card, Col, Divider, Input, message, Popconfirm, Row, Switch, Table, Tabs } from 'antd';
import { connect } from 'dva';
import EditMng from 'components/Rebue/EditMng';
import DragSortTable from 'components/Rebue/DragSortTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TreeUtils from '../../utils/TreeUtils';
import styles from './MenuMng.less';

const { TabPane } = Tabs;

@connect(({ pfmsys, pfmmenu, loading }) => ({
  pfmsys,
  pfmmenu,
  loading: loading.models.pfmmenu,
  pfmsysloading: loading.models.pfmsys,
}))
export default class MenuMng extends EditMng {
  state = {
    options: {},
    expandedRowKeys: [],
    isDrag: false,
  };

  constructor() {
    super();
    this.moduleCode = 'pfmmenu';
    this.moduleName = '菜单';
  }

  componentDidMount() {
    // 刷新
    this.props.dispatch({
      type: `pfmsys/list`,
      callback: () => {
        const { pfmsys: { pfmsys } } = this.props;
        this.handleReload({ sysId: pfmsys[0].id });
      },
    });
  }

  getList() {
    const { pfmmenu: { pfmmenu } } = this.props;
    return pfmmenu;
  }

  cloneList() {
    const { pfmmenu: { pfmmenu } } = this.props;
    return Object.assign(pfmmenu);
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
    const key = record.id;
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

  // 启用/禁用菜单
  handleEnable(record) {
    this.props.dispatch({
      type: 'pfmmenu/enable',
      payload: { id: record.id, isEnabled: !record.isEnabled },
      callback: () => {
        this.handleReload();
      },
    });
  }

  // 显示添加顶级菜单编辑器
  showAddEditor() {
    const { pfmmenu: { pfmmenu } } = this.props;
    const { sysId } = this.state.options;

    let code;
    const { length } = pfmmenu;
    if (length === 0) {
      code = '00';
    } else if (length >= 9) {
      code = `${length}`;
    } else {
      code = `0${length}`;
    }
    // 克隆新数组
    const newList = this.cloneList();
    // 创建新记录
    const newRecord = {
      id: new Date().getTime(),
      sysId,
      code,
      path: undefined,
      name: undefined,
      title: undefined,
      remark: undefined,
      icon: undefined,
      isEnabled: true,
    };
    // 添加新记录
    newList.push(newRecord);
    this.setState({ editType: 'add', editRecord: newRecord, pfmmenu: newList });
  }

  // 显示添加子菜单编辑器
  showAddChildEditor(record) {
    const { sysId } = this.state.options;
    // 克隆新数组
    const newList = this.getList();
    const item = TreeUtils.findById(newList, record.id);
    if (!item) message.error('找不到记录，记录可能已被删除，请刷新列表重试');
    this.handleExpand(true, record);
    let { code } = item;
    if (!item.children) {
      item.children = [];
      code += '00';
    } else {
      const { length } = item.children;
      if (length >= 9) code += `${length}`;
      else code += `0${length}`;
    }
    // 创建新记录
    const newRecord = {
      id: new Date().getTime(),
      sysId,
      code,
      path: undefined,
      name: undefined,
      title: undefined,
      remark: undefined,
      icon: undefined,
      isEnabled: true,
    };
    // 添加新记录
    item.children.push(newRecord);
    this.setState({ editType: 'add', editRecord: newRecord, pfmmenu: newList });
  }

  // 显示添加编辑器
  showEditEditor(record) {
    this.setState({ editType: 'edit', editRecord: record });
  }

  validate() {
    const { editRecord } = this.state;
    if (!editRecord.name) {
      message.error('请输入菜单名称');
      return false;
    }
    if (!editRecord.path) {
      message.error('请输入菜单路径');
      return false;
    }
    return true;
  }

  // 开始drag时收起子节点
  beginDrag = dragRecord => {
    this.handleExpand(false, dragRecord);
  };

  // 比较drag和drop记录的大小
  compareDragRecordAndDropRecord = (dragRecord, hoverRecord) => {
    return dragRecord.code > hoverRecord.code;
  };

  // 判断能否drop到此节点
  canDrop = (dragRecord, hoverRecord) => {
    if (hoverRecord.code.indexOf(`${dragRecord.code}`) === 0) {
      return false;
    } else {
      return true;
    }
  };

  // 移动行
  handleDrop = (dragRecord, dropRecord) => {
    this.props.dispatch({
      type: 'pfmmenu/sort',
      payload: { dragCode: dragRecord.code, dropCode: dropRecord.code },
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { pfmsys: { pfmsys }, pfmmenu: { pfmmenu }, loading, pfmsysloading } = this.props;
    const { expandedRowKeys, editType, isDrag } = this.state;

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: '20%',
        render: (text, record) => {
          const { editRecord } = this.state;
          if (editType !== 'none' && record && editRecord && editRecord.id === record.id)
            return (
              <Input
                defaultValue={text}
                // 首格input要设置width不是默认的100%，否则会被换到下一行
                style={{ width: 'auto' }}
                onChange={e => this.handleFieldChange('name', e.target.value)}
                onKeyPress={::this.handleKeyPress}
                placeholder="菜单名称"
              />
            );
          return text;
        },
      },
      {
        title: '路径',
        dataIndex: 'path',
        width: '10%',
        render: (text, record) => {
          const { editRecord } = this.state;
          if (editType !== 'none' && record && editRecord && editRecord.id === record.id)
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange('path', e.target.value)}
                onKeyPress={::this.handleKeyPress}
                placeholder="路径"
              />
            );
          return text;
        },
      },
      {
        title: '标题',
        dataIndex: 'title',
        width: '20%',
        render: (text, record) => {
          const { editRecord } = this.state;
          if (editType !== 'none' && record && editRecord && editRecord.id === record.id)
            return (
              <Input
                defaultValue={text}
                // 首格input要设置width不是默认的100%，否则会被换到下一行
                style={{ width: 'auto' }}
                onChange={e => this.handleFieldChange('title', e.target.value)}
                onKeyPress={::this.handleKeyPress}
                placeholder="菜单名称"
              />
            );
          return text;
        },
      },
      {
        title: '图标',
        dataIndex: 'icon',
        width: '10%',
        render: (text, record) => {
          const { editRecord } = this.state;
          if (editType !== 'none' && record && editRecord && editRecord.id === record.id)
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange('icon', e.target.value)}
                onKeyPress={::this.handleKeyPress}
                placeholder="图标"
              />
            );
          return text;
        },
      },
      {
        title: '描述',
        dataIndex: 'remark',
        // width: '20%',
        render: (text, record) => {
          const { editRecord } = this.state;
          if (editType !== 'none' && record && editRecord && editRecord.id === record.id)
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange('remark', e.target.value)}
                onKeyPress={::this.handleKeyPress}
                placeholder="描述"
              />
            );
          return text;
        },
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        // width: '10%',
        render: (text, record) => {
          if (editType !== 'none' || isDrag) return null;
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
        width: '16%',
        render: (text, record) => {
          const { editRecord } = this.state;
          if (isDrag) return null;
          if (editType === 'none')
            return (
              <Row>
                <Col xs={24} xxl={10}>
                  <a onClick={() => this.showAddChildEditor(record)}>添加子菜单</a>
                </Col>
                <Col xs={0} xxl={2}>
                  <Divider type="vertical" />
                </Col>
                <Col xs={24} xxl={5}>
                  <a onClick={() => this.showEditEditor(record)}>编辑</a>
                </Col>
                <Col xs={0} xxl={2}>
                  <Divider type="vertical" />
                </Col>
                <Col xs={24} xxl={5}>
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                    <a>删除</a>
                  </Popconfirm>
                </Col>
              </Row>
            );
          if (editRecord && editRecord.id === record.id)
            return (
              <Fragment>
                <a onClick={::this.handleSave}>保存</a>
                <Divider type="vertical" />
                <a onClick={::this.cancelEdit}>取消</a>
              </Fragment>
            );
          return null;
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={pfmsysloading}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Tabs onChange={this.switchSys}>{pfmsys.map(sys => <TabPane tab={sys.name} key={sys.id} />)}</Tabs>
              <Button
                icon="plus"
                type="primary"
                disabled={editType !== 'none' || isDrag}
                onClick={() => this.showAddEditor()}
              >
                添加顶级菜单
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
            <DragWrapper
              isDrag={isDrag}
              beginDrag={::this.beginDrag}
              compare={::this.compareDragRecordAndDropRecord}
              canDrop={::this.canDrop}
              onDrop={::this.handleDrop}
            >
              <Table
                rowKey="id"
                pagination={false}
                loading={loading}
                dataSource={pfmmenu}
                columns={columns}
                onExpand={::this.handleExpand}
                expandedRowKeys={expandedRowKeys}
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
