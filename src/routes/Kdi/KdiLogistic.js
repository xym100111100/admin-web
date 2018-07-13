import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SysForm from './SysForm';
import styles from './SysMng.less';

@connect(({ kdilogistic, loading }) => ({ kdilogistic, loading: loading.models.kdilogistic }))
export default class KdiLogistic extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdilogistic';
  }
  render() {
    const { kdilogistic: { kdilogistic }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    console.info(kdilogistic);
    const columns = [
      {
        title: '订单号',
        dataIndex: 'shipper_id',
      },
      {
        title: '快递公司',
        dataIndex: 'shipper_name',
      },
      {
        title: '快递单号',
        dataIndex: 'logistic_code',
      },
      {
        title: '收件人信息',
        dataIndex: 'receive_name',
      },
      {
        title: '寄件人信息',
        dataIndex: 'sender_name',
      },
      {
        title: '商品内容',
        dataIndex: 'goods_info',
      },
      {
        title: '下单时间',
        dataIndex: 'order_time',
      },
    ];

    return (
      <PageHeaderLayout title="快递订单管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table rowKey="id" pagination={false} loading={loading} dataSource={kdilogistic} columns={columns} />
          </div>
        </Card>
        {editForm === 'sysForm' && (
          <SysForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            handleSave={fields => this.handleSave(fields)}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
