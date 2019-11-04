import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, message, Table, Icon, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImportProduct.less';

@connect(({ goodFromProduct, loading }) => ({ goodFromProduct, loading: loading.models.goodFromProduct }))
export default class GoodFromProduct extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'goodFromProduct';
    this.state.data = []
    this.state.data1 = []
  }





  render() {
    const { goodFromProduct: { goodFromProduct }, loading } = this.props;
    const prop = {
      name: 'fileName',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
    };
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'productName',
      },
      {
        title: '产品分类',
        dataIndex: 'fullName',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a
                onClick={() =>
                  this.showEditForm({
                    editForm: 'prdProductForm',
                    editFormRecord: record,
                    editFormTitle: '上线产品',
                  })
                }
              >
                上线
              </a>
            </Fragment>
          );
        },
      },
    ];

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
              </div>
              <Table rowKey="id" pagination={false} loading={loading} dataSource={this.state.data1} columns={columns} />

            </div>
          </Card>
        </PageHeaderLayout>,

      </Fragment>
    );
  }
}
