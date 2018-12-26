import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrgAccount.less';
const { Search } = Input;
@connect(({ orgaccount, sucorg,loading }) => ({
  orgaccount,sucorg,
  loading: loading.models.orgaccount ||loading.models.sucorg,
}))
@Form.create()
export default class OrgAccount extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'orgaccount';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
  }

  /**
   * 改变页数的时候查询
   */
  handleTableChange = pagination => {
    this.props.form.validateFields((err, values) => {
      console.log(values);
      let paload={}
      paload.pageNum=pagination.current;
      paload.pageSize=pagination.pageSize;
      paload.name=values;
      this.props.dispatch({
        type: 'orgaccount/listOrgAccount',
        payload: paload,
      });
    });
  };

    //初始化
    componentDidMount() {
      this.state.payloads = {
        pageNum: this.state.options.pageNum,
        pageSize: this.state.options.pageSize,
      };
      this.props.dispatch({
        type: `${this.moduleCode}/listOrgAccount`,
        payload: this.state.payloads,
      });
    }

  //刷新
  handReload() {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: 'orgaccount/listOrgAccount',
      payload: {
        pageNum: 1,
        pageSize: 5,
      },
    });
  }





  // 查询
  selectOrgAccount = (e) => {
    let paload = {};
    paload.name = e;
    paload.pageNum = this.state.options.pageNum;
    paload.pageSize = this.state.options.pageSize;
    this.props.dispatch({
      type: 'orgaccount/listOrgAccount',
      payload: paload,
    });
  }

  render() {
    const { orgaccount: { orgaccount }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const columns = [
      {
        title: '供应商名称',
        dataIndex: 'supplierName',
      },
      {
        title: '余额',
        dataIndex: 'tradeType',
      },
      {
        title: '待结算',
        dataIndex: 'tradeAmount',
      },      {
        title: '已结算',
        dataIndex: 'tradeTime',
      }, 
     
    ];

    let ps;
    if (orgaccount === undefined || orgaccount.pageSize === undefined) {
      ps = 5;
    } else {
      ps = orgaccount.pageSize;
    }
    let tl;
    if (orgaccount === undefined || orgaccount.total === undefined) {
      tl = 1;
    } else {
      tl = Number(orgaccount.total);
    }
    let orgaccountData;
    if (orgaccount === undefined) {
      orgaccountData = [];
    } else {
      orgaccountData = orgaccount.list;
    }

    // 分页
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ marginBottom: 10 }}  >
              <Col md={6} sm={24}>
                <Search style={{ width: 220 }} placeholder="供应商名称" onSearch={this.selectOrgAccount} />
              </Col>
              <Col md={6} sm={24}>
                <Button icon="reload" onClick={() => this.handReload()}>
                  刷新
                  </Button>
              </Col>
            </Row>
            <div className={styles.tableList}>
              <Table
                rowKey="supplierId"
                pagination={paginationProps}
                loading={loading}
                dataSource={orgaccountData}
                columns={columns}
                onChange={this.handleTableChange}
              />
            </div>
          </Card>
        </PageHeaderLayout>,
      </Fragment>
    );
  }
}
