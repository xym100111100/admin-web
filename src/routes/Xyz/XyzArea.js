import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import XyzAreaForm from './XyzAreaForm';
import styles from './XyzArea.less';
import OrgTransferForm from './OrgTransferForm';

@connect(({ xyzarea,sucorg, loading }) => ({sucorg, xyzarea, loading: loading.models.xyzarea || loading.models.sucorg }))
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
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '录入时间',
        dataIndex: 'entryTime',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
              <a
                onClick={() =>
                  this.showAddForm({
                    editFormRecord: record,
                    id: record.id,
                    editForm: 'OrgForm',
                    editFormTitle: '设置区域组织',
                  })
                }
                
              >
                组织
              </a>
            <Divider type="vertical" />
            <a onClick={() => this.showEditForm({ id: record.id, editForm: 'xyzForm', editFormTitle: '编辑系统信息' })}>
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
                  onClick={() => this.showAddForm({ editForm: 'xyzForm', editFormTitle: '添加新系统' })}
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
        {editForm === 'xyzForm' && (
          <XyzAreaForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({fields})}

          />
        )}
         {editForm === 'OrgForm' && (
          <OrgTransferForm
            id={editFormRecord.id}
            visible
            modelName='xyzarea'
            title={editFormTitle}
            width={815}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
      </Fragment>
    );
  }
}
