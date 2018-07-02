import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SysInfo from './SysInfo';
import styles from './SysMng.less';

@connect(({ pfmsys, loading }) => ({ pfmsys, loading: loading.models.pfmsys }))
export default class SysMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'pfmsys';
    this.moduleName = '系统';
  }
  render() {
    const { pfmsys: { pfmsys }, loading } = this.props;
    const { editFormType, editFormTitle, editFormVisable, editFormRecord } = this.state;

    const columns = [
      {
        title: '代号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'sysName',
      },
      {
        title: '描述',
        dataIndex: 'sysDesc',
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
      <PageHeaderLayout title="系统信息管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={::this.showAddForm}>
                添加
              </Button>
              <Divider type="vertical" />
              <Button icon="reload" onClick={() => this.handleReload()}>
                刷新
              </Button>
            </div>
            <Table rowKey="id" pagination={false} loading={loading} dataSource={pfmsys} columns={columns} />
          </div>
        </Card>
        <SysInfo
          title={editFormTitle}
          visible={editFormVisable}
          editFormType={editFormType}
          record={editFormRecord}
          closeModal={() => this.setState({ editFormVisable: false })}
          handleSave={::this.handleSave}
        />
      </PageHeaderLayout>
    );
  }
}
