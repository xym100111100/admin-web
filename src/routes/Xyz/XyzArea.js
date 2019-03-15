import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import XyzForm from './XyzForm';
import styles from './XyzArea.less';

@connect(({ xyzarea, loading }) => ({ xyzarea, loading: loading.models.xyzarea }))
export default class XyzArea extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'xyzarea';
  }
  render() {
    const { xyzarea: { xyzarea }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const columns = [
      {
        title: '区域名称',
        dataIndex: 'areaName',
      },
      {
        title: '录入时间',
        dataIndex: 'entryTime',
      },
      {
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditForm({ id: record.id, editForm: 'sysForm', editFormTitle: '编辑系统信息' })}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.showAddForm({ editForm: 'sysForm', editFormTitle: '添加新系统' })}
                >
                  添加
                </Button>
                <Divider type="vertical" />
                <Button icon="reload" onClick={() => this.handleReload()}>
                  刷新
                </Button>
              </div>
              <Table rowKey="id" pagination={false} loading={loading} dataSource={xyzarea} columns={columns} />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'sysForm' && (
          <XyzForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields })}
          />
        )}
      </Fragment>
    );
  }
}
