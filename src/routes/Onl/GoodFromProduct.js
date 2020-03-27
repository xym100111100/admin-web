import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, message, Col, Row, Input, Table, Form, Icon, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImportProduct.less';
import GoodFromProductForm from './GoodFromProductForm';

const FormItem = Form.Item;


@connect(({ onlonline, user, slrshop, prdproductspec, prdproductpic, goodFromProduct, prdproduct, loading, }) => ({
  onlonline, user, slrshop, goodFromProduct, prdproduct, prdproductspec, prdproductpic,
  loading: loading.models.prdproductspec || loading.models.prdproductpic || loading.models.onlonline || loading.models.user || loading.models.slrshop || loading.models.goodFromProduct || loading.models.prdproduct
}))

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


  //从产品中提交上线
  commodityOnline = (record) => {
    // 分类
    let classificationId = [];
    for (let i = 0; i < record.classifications.length; i++) {
      classificationId.push(record.classifications[i].key);
    }
    record.classificationId = classificationId;
    // 设置上线组织id
    record.onlineOrgId = this.props.user.currentUser.orgId,
      // 遍历规格id来设置产品规格id，因为规格id就是产品id
      record.onlineSpecs.map((item) => {
        item.productSpecId = item.id
      })

    //整理属性值
    if (record.tags.length > 1) {
      let attrValues = [];
      for (let i = 0; i < record.onlineSpecs.length; i++) {
        let attrValue = [];
        const onlineSpec = 'record.onlineSpecs[' + i + ']';
        for (let j = 0; j < record.tags.length; j++) {
          const index = j + 1;
          let spce = 'onlineSpec' + index;
          attrValue[j] = eval(onlineSpec + '.' + spce);
        }
        attrValues[i] = attrValue;
      }
      record.attrValues = attrValues;
      record.attrNames = record.tags;
    } else {
      if (record.tags.length !== 0) {
        record.attrNames = record.tags;
      }

      let attrValues = [];
      for (let i = 0; i < record.onlineSpecs.length; i++) {
        attrValues[i] = new Array(1);
        attrValues[i][0] = record.onlineSpecs[i].onlineSpec1;
      }
      record.attrValues = attrValues;
    }

    this.props.dispatch({
      type: `prdproduct/onlineFormProduct`,
      payload: record,
      callback: (data) => {
        this.setState({ editForm: undefined });
      },
    });

  }

  /**
   * 上线
   */
  onlineFromProduct = (record) => {
    // 先去查询该商品是否已经上过线
    let data = {
      productId: record.id,
      onlineOrgId: this.props.user.currentUser.orgId,
    }
    this.props.dispatch({
      type: `onlonline/getOne`,
      payload: data,
      callback: (result) => {
        console.log(result)
        if (result > 0) {
          message.success("该产品已经上过线,请在上线菜单重新上线即可");
          return
        } else {
          this.showEditForm({
            editForm: 'GoodFromProductForm',
            editFormRecord: record,
            editFormTitle: '上线产品',
          })
        }
      },
    });

  }



  render() {

    const { goodFromProduct: { goodFromProduct }, loading } = this.props;
    const { productData, editForm, editFormType, editFormTitle, editFormRecord } = this.state;


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
                onClick={
                  () => {
                    this.onlineFromProduct(record)
                  }
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
