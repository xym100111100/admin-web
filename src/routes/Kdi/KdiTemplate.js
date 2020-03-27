import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TemplateForm from './TemplateForm';
import styles from './KdiTemplate.less';


@connect(({ kditemplate,kdicompany, user,  loading }) => ({
  kditemplate,
  kdicompany,
  user,
  loading: loading.models.kditemplate || loading.models.user || loading.models.kdicompany
}))
export default class KdiTemplate extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kditemplate';
  }
  //初始化
  componentDidMount() {
    let {user} =this.props
    let orgId=user.currentUser.orgId
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { orgId: orgId },
    });
  }
  // 刷新
  handleReload() {
    let {user} =this.props
    let orgId=user.currentUser.orgId
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { orgId: orgId },
    });
  }

  //设置默认快递公司
  setDefuteCompany = record => {
    this.props.dispatch({
      type: `${this.moduleCode}/setDefualt`,
      payload: record,
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { kditemplate: { kditemplate }, loading, user } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
     const orgId=user.currentUser.orgId; 
    editFormRecord.orgId = orgId;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '面单',
        dataIndex: 'imgPath',
        render: (text, record) => {
          return(
            <div>
              <img style={{width:150}}   src={record.imgPath}/>
            </div>
          )
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.default === false) {
            return (
              <Fragment>

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
                  this.showAddForm({ orgId: orgId, editForm: 'template', editFormTitle: '添加电子面单' })
                }
              >
                添加
              </Button>
              <Divider type="vertical" />
              <Button icon="reload" onClick={() => this.handleReload()}>
                刷新
              </Button>
            </div>
            <Table rowKey="id" pagination={false} loading={loading} dataSource={kditemplate} columns={columns} />
          </div>
        </Card>
        {editForm === 'template' && (
          <TemplateForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields })}
            width={635}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
