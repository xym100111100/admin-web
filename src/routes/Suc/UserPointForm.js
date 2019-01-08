import React, { PureComponent } from 'react';
import { Form, Table } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import styles from './UserPointForm.less';

const FormItem = Form.Item;



// 添加与编辑的表单
@connect(({ userrole, pntList, sucuser, loading }) => ({
  userrole,
  sucuser,
  pntList,
  loading: loading.models.pntList || loading.models.sucuser,
}))
@EditForm
export default class UserPointForm extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'pntList';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
  }
  state={
    pntList:[],
  }

  //初始化   
  componentDidMount() {
    const { id } = this.props;
    let accountId = id;
    this.props.dispatch({
      type: `${this.moduleCode}/listByAccountId`,
      payload: { accountId: accountId },
      callback: data => {
        if (data !== undefined) {
          this.setState(
            {
              pntList: data,
            })
        }
      },
    });
  }

  // 分页翻页
  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    const { form } = this.props;
    const { id } = this.props;
    let accountId = id;

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
      fieldsValue.accountId = accountId;
      this.props.dispatch({
        type: `${this.moduleCode}/listByAccountId`,
        payload: fieldsValue,
      });
    });
  };

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
    const userColumns = [
      {
        title: '订单ID',
        dataIndex: 'orderId',
      },
      {
        title: '改变积分的标题',
        dataIndex: 'changedTitile',
      },
      {
        title: '改变积分的详情',
        dataIndex: 'changedDetail',
      },
      {
        title: '改变前的积分',
        dataIndex: 'pointBeforeChanged',
      },
      {
        title: '改变的积分',
        dataIndex: 'changedPoint',
      },
      {
        title: '改变后的积分',
        dataIndex: 'pointAfterChanged',
      },
    ];
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Table
            rowKey="id"
            pagination={paginationProps}
            loading={loading}
            onChange={this.handleTableChange}
            dataSource={this.state.pntList.list}
            columns={userColumns}
          />
        </div>
      </div>
    );
  }
}
