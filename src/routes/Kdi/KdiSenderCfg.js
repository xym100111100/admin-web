import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SenderForm from './SenderForm';
import styles from './KdiSender.less';

@connect(({ kdisender, user, login, loading }) => ({
  kdisender,
  login,
  user,
  loading: loading.models.kdisender || loading.models.login || loading.models.user,
}))
export default class KdiSenderCfg extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdisender';
  }
  //初始化
  componentDidMount() {
    // let {user} =this.props
    // let organizeId=user.currentUser.organizeId
    //这里连调的时候先写死organizeId
    let organizeId = 253274870;
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { organizeId: organizeId },
    });
  }
  // 刷新
  handleReload() {
    // let {user} =this.props
    // let organizeId=user.currentUser.organizeId
    //这里连调的时候先写死organizeId
    let organizeId = 253274870;
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { organizeId: organizeId },
    });
  }
  //设置默认发件人
  setDefuteSender = record => {
    this.props.dispatch({
      type: `${this.moduleCode}/setDefaultSender`,
      payload: record,
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { kdisender: { kdisender }, loading, user } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    //  const organizeId=user.currentUser.organizeId; 不是连调的时候应该把这里放开获取动态的organizeId
    const organizeId = 253274870;
    editFormRecord.organizeId = organizeId;
    let kdisenderData;
    if (!Array.isArray(kdisender)) {
      kdisenderData = [];
    } else {
      kdisenderData = kdisender;
    }

    const columns = [
      {
        title: '名字',
        dataIndex: 'senderName',
      },
      {
        title: '手机',
        dataIndex: 'senderMobile',
      },
      {
        title: '地址',
        dataIndex: 'senderaddr',
      },
      {
        title: '邮编',
        dataIndex: 'senderPostCode',
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.isDefault === false) {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showEditForm({ id: record.id, editForm: 'kdiSender', editFormTitle: '编辑发件人信息' })
                  }
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() => this.setDefuteSender(record)}>设为默认</a>
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showEditForm({ id: record.id, editForm: 'kdiSender', editFormTitle: '编辑发件人信息' })
                  }
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a>默认</a>
              </Fragment>
            );
          }
        },
      },
    ];

    return (
      <PageHeaderLayout title="发件人配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() =>
                  this.showAddForm({ organizeId: organizeId, editForm: 'kdiSender', editFormTitle: '添加新快递公司' })
                }
              >
                添加
              </Button>
              <Divider type="vertical" />
              <Button icon="reload" onClick={() => this.handleReload()}>
                刷新
              </Button>
            </div>
            <Table rowKey="id" pagination={false} loading={loading} dataSource={kdisenderData} columns={columns} />
          </div>
        </Card>
        {editForm === 'kdiSender' && (
          <SenderForm
            visible
            organizeId={organizeId}
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave({ fields })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
