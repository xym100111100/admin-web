import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, message, Col, Row, Input, Table, Form, Icon, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImportProduct.less';
import GoodFromProductForm from './GoodFromProductForm';

const FormItem = Form.Item;


@connect(({ goodFromProduct, prdproduct, loading }) => ({ goodFromProduct, prdproduct, loading: loading.models.goodFromProduct || loading.models.prdproduct }))
@Form.create()
export default class GoodFromProduct extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'goodFromProduct';
    this.state.productData = []
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
  }

  componentWillMount() {
    //获取产品信息
    this.props.dispatch({
      type: `prdproduct/list`,
      callback: (data) => {
        if (data.list.length > 0) {
          this.setState({
            productData: data
          })
        }
      },
    });
  }


  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('productName')(<Input placeholder="产品名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span>
              <Button onClick={this.listProdust} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>

      </Form>
    );
  }


  handleFormReset = () => {
    this.setState({
      options: {
        pageNum: 1,
        pageSize: 5,
      }
    })
    const { form } = this.props;
    form.resetFields();

    this.props.dispatch({
      type: `prdproduct/list`,
      payload: this.state.options,
      callback: (data) => {
        if (data.list.length > 0) {
          this.setState({
            productData: data
          })
        }
      },
    });
  };


  listProdust = () => {
    const { form } = this.props;
    this.setState({
      options: {
        pageNum: 1,
        pageSize: 5,
      }
    })
    form.validateFields((err, fieldsValue) => {
      fieldsValue.pageNum = 1;
      fieldsValue.pageSize = 5;
      if (err) return;
      this.props.dispatch({
        type: `prdproduct/list`,
        payload: fieldsValue,
        callback: (data) => {
          if (data.list.length > 0) {
            this.setState({
              productData: data
            })
          }
        },
      });
    });

  }




  //改变页数查询
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
        },
      });
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;


      this.props.dispatch({
        type: `prdproduct/list`,
        payload: fieldsValue,
        callback: (data) => {
          if (data.list.length > 0) {
            this.setState({
              productData: data
            })
          }
        },
      });

    });
  };




  render() {

    const { goodFromProduct: { goodFromProduct }, loading } = this.props;
    const {productData, editForm, editFormType, editFormTitle, editFormRecord } = this.state;


    let ps;
    if (productData === undefined || productData.pageSize === undefined) {
      ps = 5;
    } else {
      ps = productData.pageSize;
    }
    let tl;
    if (productData === undefined || productData.total === undefined) {
      tl = 1;
    } else {
      tl = Number(productData.total);
    }
    let listData;
    if (productData === undefined) {
      listData = [];
    } else {
      listData = productData.list;
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
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
                    editForm: 'GoodFromProductForm',
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
              <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
              <div className={styles.tableListOperator}>
              </div>
              <Table rowKey="id"
                pagination={paginationProps}
                loading={loading}
                dataSource={listData}
                columns={columns}
                onChange={this.handleTableChange}
              />
            </div>
          </Card>
          {editForm === 'GoodFromProductForm' && (
          <GoodFromProductForm
            visible
            title={editFormTitle}
            width={'99vw'}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            onFullScreen
            centered={false}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={(fields) => this.commodityOnline(fields)}
          />
        )}
        </PageHeaderLayout>,

      </Fragment>
    );
  }
}
