import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Radio,
  Card,
  Divider,
  Popconfirm,
  Select,
  Form,
  Table,
  Input,
  Row,
  Col,
  List,
  Menu,
  Dropdown,
  Icon,
  message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OnlineForm from './OnlineForm';
import styles from './OnlineMng.less';
import OnlOnlinePromotionForm from './OnlOnlinePromotionForm';
import OnlOnlineSpecForm from './OnlOnlineSpecForm';
import OnlOnlineNumberForm from './OnlOnlineNumberForm';
import { push } from 'react-router-redux';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@connect(({ onlonline, user, slrshop, loading, }) => ({
  onlonline, user, slrshop,
  loading: loading.models.onlonline || loading.models.user || loading.models.slrshop
}))
@Form.create()
export default class OnlineMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'onlonline';
    this.state.shopData = [];
  }


  //初始化
  componentDidMount() {
    //获取上线信息
    this.handleReload();
    //获取店铺信息
    this.props.dispatch({
      type: `onlonline/shopList`,
      callback: (data) => {
        if (data.length > 0) {
          this.setState({
            shopData: data
          })
        }
      },
    });
  }

  handleReload = () => {
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: {
        pageNum: 1,
        pageSize: 5,
        onlineState: -1,
        thisOrgId: this.props.user.currentUser.orgId,
      },
    })
  }

  handleSearch = (pagination) => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: {
          pageNum: pagination.current === undefined ? 1 : pagination.current,
          pageSize: pagination.current === undefined ? 5 : pagination.pageSize,
          onlineState: values.onlineState,
          thisOrgId: this.props.user.currentUser.orgId,
          shopName: values.shopName === '所有店铺' ? undefined : values.shopName,
          onlineTitle: values.onlineTitle,
          onlineState: values.onlineState,
        },
      })

    })

  }

  /**
   * 初始化店铺
   */
  initShop = () => {
    if (this.state.shopData.length !== 0) {
      let i = 0;
      const listItems = this.state.shopData.map(items => {
        return (
          <Option value={items.shopName} key={items.id.toString()}>
            {items.shopName}
          </Option>
        );
      });
      return listItems;
    }

  }
  // 重置from
  handleFormReset = () => {
    this.props.form.resetFields();
    this.handleReload();
  };

  // 搜索
  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" style={{ marginBottom: 14 }} >
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="店铺名称">
              {getFieldDecorator('shopName', {
                initialValue: '所有店铺'
              })(
                <Select style={{ width: 120 }}>
                  <Option value="所有店铺" key={0}>
                    所有店铺
                  </Option>
                  {this.initShop()}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="上线标题">{getFieldDecorator('onlineTitle')(<Input placeholder="上线标题" />)}</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem >
              {getFieldDecorator('onlineState', {
                initialValue: '-1',
              })(
                <RadioGroup style={{ width: 280 }} >
                  <RadioButton value='-1'  >
                    全部
                   </RadioButton>
                  <RadioButton value='1'  >
                    已上线
                   </RadioButton>
                  <RadioButton value='0'  >
                    已下线
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button onClick={this.handleSearch} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
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

  //上线或重新上线
  commodityOnline = (record) => {
    //console.log('aa',record)
    if (record.tags === undefined) {
      record.tags = [];
    }
    if (record.onlineSpecs === undefined) {
      record.onlineSpecs = [];
    }
    if (record.tags.length > 1) {
      //整理属性值
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
    let classificationId = [];
    for(let i=0;i<record.classifications.length;i++){
      classificationId.push(record.classifications[i].key);
    }
    record.classificationId=classificationId;
    //console.log('record',record);
    if (this.state.editFormTitle !== '重新上线') {
      this.props.dispatch({
        type: `onlonline/add`,
        payload: record,
        callback: () => {
          this.handleReload();
          this.setState({ editForm: undefined });
        },
      });
    } else {
      this.props.dispatch({
        type: `onlonline/reOnline`,
        payload: record,
        callback: () => {
          this.handleReload();
          this.setState({ editForm: undefined });
        },
      });
    }
  }

  render() {
    const { onlonline: { onlonline } } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    const MoreBtn = props => {
      const { record } = props;
      const menu = (
        <Menu>
          {record.id === record.onlineId ? (
            <Menu.Item>
              <Popconfirm title="是否要取消此商品的推广？" onConfirm={() => this.cancelPromotion(record)}>
                <a>取消推广</a>
              </Popconfirm>
            </Menu.Item>
          ) : (
              <Menu.Item>
                <a
                  onClick={() =>
                    this.showAddForm({
                      id: record.id,
                      editForm: 'onlOnlinePromotionForm',
                      editFormRecord: record,
                      editFormTitle: '商品推广',
                    })
                  }
                >
                  商品推广
              </a>
              </Menu.Item>
            )}
          <Menu.Item>
            <a
              onClick={() =>
                this.showAddForm({
                  id: record.id,
                  editForm: 'onlOnlineSpecForm',
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
        title: '供应商名称',
        dataIndex: 'supplierName',
      },
      {
        title: '发货组织',
        dataIndex: 'deliverOrgName',
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
                      editForm: 'onlOnlineSpecForm',
                      editFormRecord: record,
                      editFormTitle: '规格信息',
                    })
                  }
                >
                  查询规格信息
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() =>
                    this.showEditForm({
                      editForm: 'onlineForm',
                      editFormRecord: record,
                      editFormTitle: '重新上线',
                    })
                  }
                >
                  重新上线
                </a>
              </Fragment>
            );
          }
        },
      },
    ];

    let ps;
    if (onlonline === undefined || onlonline.pageSize === undefined) {
      ps = 5;
    } else {
      ps = onlonline.pageSize;
    }
    let tl;
    if (onlonline === undefined || onlonline.total === undefined) {
      tl = 1;
    } else {
      tl = Number(onlonline.total);
    }
    let onlonlineData;
    if (onlonline === undefined) {
      onlonlineData = [];
    } else {
      onlonlineData = onlonline.list;
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };

    return (
      <PageHeaderLayout title="系统信息管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              pagination={paginationProps}
              onChange={this.handleSearch}
              dataSource={onlonlineData}
              columns={columns}
              expandRowByClick={true}
            />
          </div>
        </Card>
        {editForm === 'onlineForm' && (
          <OnlineForm
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
        {editForm === 'onlOnlinePromotionForm' && (
          <OnlOnlinePromotionForm
            visible
            title={editFormTitle}
            width={700}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields =>
              this.handleSubmit({
                fields: { onlineId: editFormRecord.id, promotionType: fields.promotionType },
                moduleCode: 'onlonlineporomotion',
              })
            }
          />
        )}
        {editForm === 'onlOnlineSpecForm' && (
          <OnlOnlineSpecForm
            visible
            title={editFormTitle}
            width={'85vw'}
            height={600}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
        {editForm === 'onlOnlineNumberForm' && (
          <OnlOnlineNumberForm
            visible
            title={editFormTitle}
            width={700}
            height={490}
            id={editFormRecord.id}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields =>
              this.handleSubmit({
                fields: { onlineId: editFormRecord.id, appends: fields },
                moduleCode: 'onlonline',
                saveMethodName: 'append',
              })
            }
          />
        )}
      </PageHeaderLayout>
    );
  }
}
