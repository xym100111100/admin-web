import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Col, Row, Card, Table, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './pntList.less';
const { Search } = Input;

@connect(({ pntList, loading }) => ({ 
  pntList, 
  loading: loading.models.pntList 
}))
@Form.create()
export default class pntList extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'pntList';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
  }

  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    const { form } = this.props;
    pager.current = pagination.current;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        options: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          orderState: fieldsValue.orderState
        },
      });
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;


      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  selectUser = (e) => {
    let paload = {};
    paload.users = e;
    paload.pageNum = this.state.options.pageNum;
    paload.pageSize = this.state.options.pageSize;
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: paload,
    });
  }

  render() {
    const { pntList: { pntList }, loading } = this.props;
    
    let ps;
    if (pntList === undefined || pntList.pageSize === undefined) {
      ps = 5;
    } else {
      ps = pntList.pageSize;
    }
    let tl;
    if (pntList === undefined || pntList.total === undefined) {
      tl = 1;
    } else {
      tl = Number(pntList.total);
    }
    let pntListData;
    if (pntList === undefined) {
      pntListData = [];
    } else {
      pntListData = pntList.list;
    }

    // 分页
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };
    const columns = [
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: '当前积分',
        dataIndex: 'point',
      },
      {
        title: '当前收益',
        dataIndex: 'income',
      },
      {
        title: '历史总收益',
        dataIndex: 'totalIncome',
      },
      {
        title: '是否锁定',
        dataIndex: 'isLocked',
        render:(text,record)=>{
          if(record.isLocked === true){
            return '是'
          }
          if(record.isLocked === false){
            return '否'
          }
        }
      },
      {
        title: '修改时间戳',
        dataIndex: 'modifiedTimestamp'
      },

    ];

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableListForm}>
              <Form  layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col md={16} sm={24} >
                    
                    <Button icon="reload" onClick={() => this.handleReload()}>
                      刷新
            </Button>
                  </Col>
                  <Col md={8} sm={24} >
                    <Search placeholder="昵称/用户id" onSearch={this.selectUser} />
                  </Col>
                </Row>
              </Form>
            </div>
            <Table rowKey="id" pagination={paginationProps} loading={loading} dataSource={pntList.list} columns={columns} onChange={this.handleTableChange}/>
          </Card>
        </PageHeaderLayout>
      </Fragment>
    );
  }
}
