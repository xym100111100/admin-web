import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SysForm from './SysForm';
import styles from './SysMng.less';

@connect(({ student, loading }) => ({ student, loading: loading.models.student }))
export default class SysMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'student';
  }
  render() {
    const { student: { student }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
      console.log(student);
    const columns = [

      {
        title: '学号',
        dataIndex: 'studentCode',
      },
      {
        title: '学生姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号码',
        dataIndex: 'phone1',
      },
      {
        title: '电话号码',
        dataIndex: 'phone2',
      },{
        title: '身份证',
        dataIndex: 'idCard',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditForm({ id: record.id, editForm: 'sysForm', editFormTitle: '编辑学生信息' })}>
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
                  onClick={() => this.showAddForm({ editForm: 'sysForm', editFormTitle: '添加新学生' })}
                >
                  添加
                </Button>
                <Divider type="vertical" />
                <Button icon="reload" onClick={() => this.handleReload()}>
                  刷新
                </Button>
              </div>
              <Table rowKey="id" pagination={false} loading={loading} dataSource={student.list} columns={columns} />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'sysForm' && (
          <SysForm
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
