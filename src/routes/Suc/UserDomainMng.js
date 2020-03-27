import React, { Fragment } from 'react';
import { Button, Card, Divider, Switch, Table, Tabs, Form, message, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import SimpleMng from 'components/Rebue/SimpleMng';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UserDomainForm from './UserDomainForm';
import styles from './UserDomainMng.less';

const { Search } = Input;

const { TabPane } = Tabs;

@connect(({ sucdomain, sucuserdomain, loading }) => ({
  sucdomain,
  sucuserdomain,
  loading: loading.models.sucuserdomain,
  sucdomainloading: loading.models.sucdomain,
}))
@Form.create()
export default class UserDomainMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'sucuserdomain';
    Object.assign(this.state, {
      options: {},
      pageNum: 1,
      pageSize: 5,
    });
  }

  componentDidMount() {
    // 刷新tabs页 1.获取tabs数据 2.获取table数据
    this.props.dispatch({
      type: `sucdomain/list`,
      callback: () => {
        const { sucdomain: { sucdomain } } = this.props;
        const { pageNum, pageSize } = this.state;
        this.handleReload({ domainId: sucdomain[0].id, pageNum: pageNum, pageSize: pageSize });
        this.setState({
          domainId: sucdomain[0].id
        })
      },
    });
  }

  // 切换tabs页
  switchDomain = activeKey => {
    this.handleReload({ domainId: activeKey });
    this.setState({
      domainId: activeKey
    })
  };

  //翻页
  handleTableChange = pagination => {
    const { domainId } = this.state;
    this.props.form.validateFields((err, values) => {
      this.handleReload({
        domainId: domainId,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
    });
  };

  // 锁定/解锁用户
  handleEnable(record) {
    let Reason = null;
    if (record.isLock === false) {
      Reason = prompt('请填写锁定原因');
    } else {
      Reason = prompt('请填写解锁原因');
    }
    if (Reason === null) {
      return;
    }
    if (Reason === "" && record.isLock === false) {
      message.error("锁定原因不能为空");
      return;
    } else if (Reason === "" && record.isLock === true) {
      message.error("解锁原因不能为空");
      return;
    }
    this.props.dispatch({
      type: 'sucuser/enable',
      payload: { id: record.id, isLock: !record.isLock },
      callback: () => {
        this.handleReload();
      },
    });
  }

  //添加用户
  addUser(record, domainId) {
    record.domainId = domainId;
    console.log("record", record);
    this.props.dispatch({
      type: `${this.moduleCode}/add`,
      payload: record,
      callback: () => {
        this.setState({ editForm: undefined })
        this.handleReload();
      },
    });
  }

  /**
   * 设置为测试号
  */
  setIsTester = (record) => {
    this.props.dispatch({
      type: 'sucuser/modify',
      payload: { id: record.id, isTester: !record.isTester },
      callback: () => {
        this.handleReload();
      },
    });

  }

  //搜索
  selectUser = (e) => {
    let paload = {};
    paload.keys = e;
    paload.pageNum = this.state.options.pageNum;
    paload.pageSize = this.state.options.pageSize;
    paload.domainId = this.state.domainId;
    this.props.dispatch({
      type: `${this.moduleCode}/listByDomainAndKeys`,
      payload: paload,
    });
  }

  render() {
    const { sucdomain: { sucdomain }, sucuserdomain: { sucuserdomain }, loading, pfmsysloading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord, options } = this.state;
    const { domainId } = options;
    const columns = [
      {
        title: '用户id',
        dataIndex: 'id',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: '微信昵称',
        dataIndex: 'wxNickname',
      },
      {
        title: 'QQ昵称',
        dataIndex: 'qqNickname',
      },
      {
        title: '登录名',
        dataIndex: 'loginName',
      },
      {
        title: '是否锁定',
        dataIndex: 'isLock',
        width: 100,
        render: (text, record) => {
          return (
            <Switch
              checkedChildren="锁定"
              unCheckedChildren="未锁"
              checked={record.isLock}
              loading={loading}
              onChange={() => this.handleEnable(record)}
            />
          );
        },
      },
      {
        title: '是否测试号',
        dataIndex: 'isTester',
        render: (text, record) => {
          return (
            <Fragment>
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={record.isTester}
                loading={loading}
                onChange={() => this.setIsTester(record)}
              />
            </Fragment>
          );
        },
      },
    ];

    //获取返回的数据
    let ps;
    if (sucuserdomain === undefined || sucuserdomain.pageSize === undefined) {
      ps = 5;
    } else {
      ps = sucuserdomain.pageSize;
    }
    let tl;
    if (sucuserdomain === undefined || sucuserdomain.total === undefined) {
      tl = 1;
    } else {
      tl = Number(sucuserdomain.total);
    }
    let userdomainData;
    if (sucuserdomain === undefined) {
      userdomainData = [];
    } else {
      userdomainData = sucuserdomain.list;
    }
    //console.log(sucuserdomain);


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
          <Card loading={pfmsysloading}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Tabs onChange={this.switchDomain}>{sucdomain.map(sys => <TabPane tab={sys.name} key={sys.id} />)}</Tabs>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col md={16} sm={24} >
                    <Button
                      icon="plus"
                      type="primary"
                      onClick={() =>
                        this.showAddForm({ editForm: 'userDomainForm', editFormTitle: '添加新用户', editFormRecord: { domainId: domainId, isOrgAdd: false } })
                      }
                    >
                      添加
                </Button>
                    <Divider type="vertical" />
                    <Button icon="reload" onClick={() => this.handleReload()}>
                      刷新
                </Button>
                  </Col>
                  <Col md={8} sm={24} >
                    <Search placeholder="登录账号/昵称/微信昵称/QQ昵称" onSearch={this.selectUser} />
                  </Col>
                </Row>
              </div>
              <Table
                rowKey="id"
                pagination={paginationProps}
                loading={loading}
                dataSource={userdomainData}
                columns={columns}
                onChange={this.handleTableChange}
              />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'userDomainForm' && (
          <UserDomainForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.addUser(fields, domainId)}
          />
        )}
      </Fragment>
    );
  }
}
