import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Popconfirm, Form, Table, Input, Row, Col, List, Menu, Dropdown, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OnlineForm from './OnlineForm';
import styles from './OnlineMng.less';

const FormItem = Form.Item;

@connect(({ onlonline }) => ({ onlonline }))
@Form.create()
export default class OnlineMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'onlonline';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
  }

  handleTableChange = pagination => {
    this.props.form.validateFields((err, values) => {
      this.handleReload({
        onlineTitle: values.onlineTitle,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
    });
  };

  // 搜索
  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">{getFieldDecorator('onlineTitle')(<Input placeholder="上线标题" />)}</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 取消推广
  cancelPromotion = record => {
    this.props.dispatch({
      type: `onlonline/cancelPromotion`,
      payload: {
        onlineId: record.id,
      },
      callback: () => {
        this.handleReload();
      },
    });
  };

  // 下线
  tapeOut = record => {
    this.props.dispatch({
      type: `onlonline/tapeOut`,
      payload: {
        id: record.id,
        onlineState: 0,
      },
      callback: () => {
        this.handleReload();
      },
    });
  };

  render() {
    const { onlonline: { onlonline } } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const MoreBtn = props => {
      const { record } = props;
      const menu = (
        <Menu>
          <Menu.Item>
            <a
              onClick={() =>
                this.showAddForm({
                  id: record.id,
                  editForm: 'onlineForm',
                  editFormRecord: record,
                  editFormTitle: '复制上线',
                })
              }
            >
              复制上线
            </a>
          </Menu.Item>
          <Menu.Item>
            <Popconfirm title="是否要取消此商品的推广？" onConfirm={() => this.cancelPromotion(record)}>
              <a>取消推广</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item>
            <a
              onClick={() =>
                this.showAddForm({
                  id: record.id,
                  editForm: 'onlLineSpecForm',
                  editFormRecord: record,
                  editFormTitle: '规格信息',
                })
              }
            >
              查询规格信息
            </a>
          </Menu.Item>
        </Menu>
      );

      return (
        <Dropdown overlay={menu}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };

    const columns = [
      {
        title: '上线标题',
        dataIndex: 'onlineTitle',
      },
      {
        title: '上线状态',
        dataIndex: 'onlineState',
        render: (text, record) => {
          if (record.onlineState === 1) {
            return '已上线';
          } else {
            return '已下线';
          }
        },
      },
      {
        title: '上线时间',
        dataIndex: 'onlineTime',
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.onlineState === 1) {
            return (
              <Fragment>
                <Divider type="vertical" />
                <List.Item
                  actions={[
                    <Popconfirm title="是否要下线此商品？" onConfirm={() => this.tapeOut(record)}>
                      <a>下线</a>
                    </Popconfirm>,
                    <MoreBtn record={record} />,
                  ]}
                />
                <Divider type="vertical" />
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <a
                  onClick={() =>
                    this.showAddForm({
                      id: record.id,
                      editForm: 'onlineForm',
                      editFormRecord: record,
                      editFormTitle: '复制上线',
                    })
                  }
                >
                  复制上线
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() =>
                    this.showAddForm({
                      id: record.id,
                      editForm: 'onlLineSpecForm',
                      editFormRecord: record,
                      editFormTitle: '规格信息',
                    })
                  }
                >
                  查询规格信息
                </a>
              </Fragment>
            );
          }
        },
      },
    ];

    // 分页
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: Number(onlonline.total),
    };

    return (
      <PageHeaderLayout title="系统信息管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.showAddForm({ editForm: 'onlineForm', editFormTitle: '商品上线' })}
              >
                添加
              </Button>
              <Divider type="vertical" />
              <Button icon="reload" onClick={() => this.handleReload()}>
                刷新
              </Button>
            </div>
            <Table
              rowKey="id"
              pagination={paginationProps}
              onChange={this.handleTableChange}
              dataSource={onlonline.list}
              columns={columns}
              expandRowByClick={true}
            />
          </div>
        </Card>
        {editForm === 'onlineForm' && (
          <OnlineForm
            visible
            title={editFormTitle}
            width={1100}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
