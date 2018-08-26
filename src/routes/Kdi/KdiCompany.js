import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CompanyForm from './CompanyForm';
import styles from './KdiCompany.less';

@connect(({ kdicompany, user, login, loading }) => ({
  kdicompany,
  user,
  login,
  loading: loading.models.kdicompany || loading.models.user || loading.models.login,
}))
export default class KdiCompany extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdicompany';
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

  //设置默认快递公司
  setDefuteCompany = record => {
    this.props.dispatch({
      type: `${this.moduleCode}/setDefaultCompany`,
      payload: record,
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { kdicompany: { kdicompany }, loading, user } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    //  const organizeId=user.currentUser.organizeId; 不是连调的时候应该把这里放开获取动态的organizeId
    const organizeId = 253274870;
    editFormRecord.organizeId = organizeId;
    const columns = [
      {
        title: '名称',
        dataIndex: 'companyName',
      },
      {
        title: '帐号',
        dataIndex: 'companyAccount',
      },
      {
        title: '编号',
        dataIndex: 'companyCode',
      },
      {
        title: '支付方式',
        dataIndex: 'payType',
        render: (text, record) => {
          if (record.payType === 1) return '现付';
          if (record.payType === 2) return '到付';
          if (record.payType === 3) return '月结';
          if (record.payType === 4) return '第三方付';
        },
      },
      {
        title: '录入时间',
        dataIndex: 'entryTime',
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.isDefault === false) {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showEditForm({ id: record.id, editForm: 'kdiCompany', editFormTitle: '编辑快递公司信息' })
                  }
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(record)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() => this.setDefuteCompany(record)}>设为默认</a>
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showEditForm({ id: record.id, editForm: 'kdiCompany', editFormTitle: '编辑快递公司信息' })
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
      <PageHeaderLayout title="快递公司配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() =>
                  this.showAddForm({ organizeId: organizeId, editForm: 'kdiCompany', editFormTitle: '添加新快递公司' })
                }
              >
                添加
              </Button>
              <Divider type="vertical" />
              <Button icon="reload" onClick={() => this.handleReload()}>
                刷新
              </Button>
            </div>
            <Table rowKey="id" pagination={false} loading={loading} dataSource={kdicompany} columns={columns} />
          </div>
        </Card>
        {editForm === 'kdiCompany' && (
          <CompanyForm
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
