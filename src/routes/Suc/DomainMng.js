import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DomainForm from './DomainForm';
import styles from './DomainMng.less';

@connect(({ sucdomain, loading }) => ({ sucdomain, loading: loading.models.sucdomain }))
export default class DomainMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'sucdomain';
  }
  render() {
    const { sucdomain: { sucdomain }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const columns = [
      {
        title: '领域id',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditForm({ id: record.id, editForm: 'DomainForm', editFormTitle: '编辑领域信息' })}>
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
                {/* <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.showAddForm({ editForm: 'DomainForm', editFormTitle: '添加新系统' })}
                >
                  添加
                </Button>
                <Divider type="vertical" /> */}
                <Button icon="reload" onClick={() => this.handleReload()}>
                  刷新
                </Button>
              </div>
              <Table rowKey="id" pagination={false} loading={loading} dataSource={sucdomain} columns={columns} />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'DomainForm' && (
          <DomainForm
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
