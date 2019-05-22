import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Form, Table, Input, Row, Col, Switch, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PrdProductMng.less';
import PrdProductForm from './PrdProductForm';
import PrdProductDetail from './PrdProductDetail';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ prdproduct, loading }) => ({ prdproduct, loading: loading.models.prdproduct }))
@Form.create()
export default class PrdProductMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'prdproduct';
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

  // 重置from
  handleFormReset = () => {
    this.props.form.resetFields();
  };

  // 搜索
  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.showAddForm({ editForm: 'prdProductForm', editFormTitle: '添加产品' })}
            >
              添加
            </Button>
            <Divider type="vertical" />
            <Button icon="reload" onClick={() => this.handleReload()}>
              刷新
            </Button>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="产品名称">{getFieldDecorator('productName')(<Input placeholder="产品名称" />)}</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="上线状态">
              {getFieldDecorator('isEnabled', {
                initialValue: '1',
              })(
                <Select style={{ width: 120 }}>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              )}
            </FormItem>
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

  // 启用/禁用产品
  handleEnable(record) {
    this.props.dispatch({
      type: `prdproduct/enable`,
      payload: { id: record.id, isEnabled: !record.isEnabled },
      callback: () => {
        this.handleReload();
      },
    });
  }

  render() {
    const { prdproduct: { prdproduct }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const columns = [
      {
        title: '产品名称',
        dataIndex: 'productName',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        render: (text, record) => {
          return (
            <Fragment>
              <Switch
                checkedChildren="启用"
                unCheckedChildren="停用"
                checked={record.isEnabled}
                loading={loading}
                onChange={() => this.handleEnable(record)}
              />
            </Fragment>
          );
        },
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
        title: '操作人',
        dataIndex: 'opName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a
                onClick={() =>
                  this.showAddForm({
                    id: record.id,
                    editForm: 'prdProductDetail',
                    editFormRecord: record,
                    editFormTitle: '产品信息',
                  })
                }
              >
                查询
              </a>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  this.showAddForm({
                    id: record.id,
                    editForm: 'prdProductForm',
                    editFormRecord: record,
                    editFormTitle: '编辑产品信息',
                  })
                }
              >
                编辑
              </a>
            </Fragment>
          );
        },
      },
    ];

    let ps;
    if (prdproduct === undefined || prdproduct.pageSize === undefined) {
      ps = 5;
    } else {
      ps = prdproduct.pageSize;
    }
    let tl;
    if (prdproduct === undefined || prdproduct.total === undefined) {
      tl = 1;
    } else {
      tl = Number(prdproduct.total);
    }
    let prdproductData;
    if (prdproduct === undefined) {
      prdproductData = [];
    } else {
      prdproductData = prdproduct.list;
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };

    return (
      <PageHeaderLayout title="产品管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              pagination={paginationProps}
              onChange={this.handleTableChange}
              dataSource={prdproductData}
              columns={columns}
            />
          </div>
        </Card>，
        {editForm === 'prdProductForm' && (
          <PrdProductForm
            visible
            title={editFormTitle}
            width={1100}
            height={510}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            onFullScreen
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields =>
              this.handleSubmit({
                fields,
                moduleCode: 'prdproduct',
                saveMethodName: editFormTitle === '添加产品' ? 'add' : 'modify',
              })
            }
          />
        )},
        {editForm === 'prdProductDetail' && (
          <PrdProductDetail
            visible
            title={editFormTitle}
            width={1100}
            height={510}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            onFullScreen
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
