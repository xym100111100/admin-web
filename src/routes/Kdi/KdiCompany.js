import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, message, Card, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CompanyForm from './CompanyForm';
import styles from './KdiCompany.less';
import KdiTemplateImgForm from './KdiTemplateImgForm';
import TemplateForm from './TemplateForm';
import CompanyShopForm from './CompanyShopForm';

@connect(({ kdicompany, kditemplate, companydic, user, login, loading }) => ({
  kdicompany,
  companydic,
  kditemplate,
  user,
  login,
  loading: loading.models.kdicompany || loading.models.kditemplate || loading.models.user || loading.models.companydic || loading.models.login,
}))
export default class KdiCompany extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdicompany';
  }
  //初始化
  componentDidMount() {
    let { user } = this.props
    let orgId = user.currentUser.orgId
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { orgId: orgId },
    });
  }
  // 刷新
  handleReload() {
    let { user } = this.props
    let orgId = user.currentUser.orgId
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: { orgId: orgId },
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

  /**
   * 是否显示为添加电子面单
   */
  isShowAddTempLate = (record) => {
    if (record.templateName === undefined) {
      return (
        <a onClick={() => this.showAddForm({ editFormRecord: record, editForm: 'addTemplate', editFormTitle: '添加电子面单' })}>添加电子面单</a>
      )
    } else {
      return (
        <a onClick={() => this.showEditForm({ editFormRecord: record, editForm: 'editTemplate', editFormTitle: '更改电子面单' })}>更改电子面单</a>

      )
    }
  }
  /**
   * 添加电子面单
   */
  addTemplate = (record) => {
    if (record.templateDicId === 0) {
      message.error('未选择任何模板，不能添加');
      return;
    }
    record.companyId = record.id;
    record.id = undefined;
    this.props.dispatch({
      type: `kditemplate/add`,
      payload: record,
      callback: () => {
        this.setState({ editForm: undefined })
        this.handleReload();
      },
    });

  }
  /**
   * 修改电子面单
   */
  editTemplate = (record) => {
    record.companyId = record.id;
    record.id = record.templateId;
    record.templateId = undefined;
    this.props.dispatch({
      type: `kditemplate/modify`,
      payload: record,
      callback: () => {
        this.setState({ editForm: undefined })
        this.handleReload();
      },
    });
  }

    /**
   * 修改电子面单
   */
  editShop = (record) => {
    let shopInfo=record.shopId.split('/')
    
    let fields={
       id:record.id,
       shopId:shopInfo[0],
       shopName:shopInfo[1]
    }
    this.props.dispatch({
      type: `${this.moduleCode}/modify`,
      payload: fields,
      callback: () => {
        this.setState({ editForm: undefined })
        this.handleReload();
      },
    });
  }


  render() {
    const { kdicompany: { kdicompany }, loading, user } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const orgId = user.currentUser.orgId;
    editFormRecord.orgId = orgId;
    const columns = [
      {
        title: '名称',
        dataIndex: 'companyName',
        render: (text, record) => {
          if (record.anotherName === undefined) {
            return record.companyName;
          } else {
            return record.anotherName;
          }

        },
      },
      {
        title: '帐号',
        dataIndex: 'companyAccount',
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
        title: '默认使用的店铺',
        dataIndex: 'shopName',
        render: (text, record) => {
          return record.shopName;
        }
      },
      {
        title: '电子面单',
        dataIndex: 'templateName',
        render: (text, record) => {
          return (
            <a onClick={() =>
              this.showEditForm({ editFormRecord: record, editForm: 'templateImg', editFormTitle: '预览电子面单' })
            }
            >{record.templateName}</a>
          )
        }
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
                <br />
                {this.isShowAddTempLate(record, editFormRecord)}
                <br />
                <a onClick={()=>this.showAddForm({editFormRecord: {'id':record.id,'initShopId':record.shopId},editForm: 'CompanyShopForm', editFormTitle: '添加默认使用该快递的店铺'})} >
                  设置默认使用的店铺
                </a>
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
                <br />
                {this.isShowAddTempLate(record, editFormRecord)}
                <br />
                <a onClick={()=>this.showEditForm({editFormRecord: {'id':record.id,'initShopId':record.shopId},editForm: 'CompanyShopForm', editFormTitle: '添加默认使用该快递的店铺'})} >
                  设置默认使用的店铺
                </a>
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
                  this.showAddForm({ orgId: orgId, editForm: 'kdiCompany', editFormTitle: '添加新快递公司' })
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
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields })}
          />
        )}
        {editForm === 'templateImg' && (
          <KdiTemplateImgForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
        {editForm === 'addTemplate' && (
          <TemplateForm
            visible
            width={635}
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.addTemplate(fields)}
          />
        )}
        {editForm === 'editTemplate' && (
          <TemplateForm
            visible
            width={635}
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.editTemplate(fields)}
          />
        )}
       {editForm === 'CompanyShopForm' && (
          <CompanyShopForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.editShop(fields)}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
