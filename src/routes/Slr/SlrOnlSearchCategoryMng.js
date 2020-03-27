import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Card, Switch, Divider, Table, Tabs } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SlrOnlSearchCategoryMng.less';
import SlrOnlSearchCategoryForm from './SlrOnlSearchCategoryForm';

const { TabPane } = Tabs;

@Form.create()
@connect(({ onlsearchcategory, user, slrshop, loading }) => ({ user, onlsearchcategory, slrshop, loading: loading.models.onlsearchcategory || loading.models.user }))
export default class SlrOnlSearchCategoryMng extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'onlsearchcategory';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
        };
        this.state.activeShopId = undefined;
    }

    componentDidMount() {
        // 刷新
        this.props.dispatch({
            type: `slrshop/shopList`,
            callback: () => {
                const { slrshop: { slrshop } } = this.props;
                this.handleReload({ shopId: slrshop[0].id });
                this.setState({
                    activeShopId:slrshop[0].id
                })
            },
        });
    }

    // 刷新搜索分类列表
    handleSearchReload(selectedRows) {
        // 加载搜索分类信息
        this.props.dispatch({
            type: 'onlsearchcategory/list',
            payload: {
                pageNum: 1,
                pageSize: 5,
                shopId: selectedRows.shopId,
            },
            callback: () => {
                this.setState({ selectedRows });
            },
        });
    }

    // 翻页
    handleTableChange = pagination => {
        this.props.form.validateFields((err, values) => {
            this.handleReload({
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                shopId:this.state.activeShopId,
            });
        });
    };

    /**
     * 添加分类
     */
    addSearchCategory=(fields,editFormType)=>{
        let mathod ='add'
        if(editFormType !== mathod){
            mathod='modify'
        }
        this.props.dispatch({
            type: 'onlsearchcategory/'+mathod,
            payload:fields,
            callback: () => {
                this.handleReload({ shopId: this.state.activeShopId });
                this.setState({
                    editForm:undefined
                })
            },
        });
    }

    /**
     * 切换店铺
     */
    switchShop = activeKey => {
        //设置选中的店铺id在添加分类的时候将该店铺id传过去
        this.setState({
            activeShopId: activeKey,
        })
        this.handleSearchReload({ shopId: activeKey });
    }

    // 启用/禁用搜索分类
    handleEnable(record) {
        this.props.dispatch({
            type: `onlsearchcategory/enable`,
            payload: {
                sellerId: record.sellerId,
                shopId: record.shopId,
                code: record.code,
                isEnabled: !record.isEnabled
            },
            callback: () => {
                this.handleReload({
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                    shopId:this.state.activeShopId,
                });
            },
        });
    }

    initShop = () => {
        const { slrshop: { slrshop }, loading } = this.props;
        if (slrshop !== undefined && slrshop.length > 0) {
            return (
                <Tabs onChange={this.switchShop}>{slrshop.map(shop => <TabPane tab={shop.shortName} key={shop.id} />)}</Tabs>
            )
        }

    }

    render() {
        const { user, onlsearchcategory: { onlsearchcategory }, slrshop: { slrshop }, loading } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
        editFormRecord.sellerId = user.currentUser.orgId;
        editFormRecord.shopId = this.state.activeShopId;
        const columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '分类编码',
                dataIndex: 'code',
            },
            {
                title: '图片',
                dataIndex: 'image',
                width: '7%',
                render: (text, record) => {
                    if (text !== undefined) {
                        return (<img alt="图片" style={{ width: '100%' }} src={'/ise-svr/files' + text} />);
                    }
                }
            },
            {
                title: '分类备注',
                dataIndex: 'remark',
            },
            {
                title: '是否启用',
                dataIndex: 'isEnabled',
                width: 110,
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
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <a onClick={() => this.showEditForm({ id: record.id, editFormRecord: record, editForm: 'OnlSearchCategoryForm', editFormTitle: '编辑分类信息' })}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a onClick={() => this.showAddForm({ editFormRecord: { shopId: record.shopId, sellerId: record.sellerId, code: record.code }, editForm: 'searchsonCategory', editFormTitle: '添加子分类' })}>
                            添加子分类
                        </a>
                    </Fragment>
                ),
            },
        ];

        let ps;
        if (onlsearchcategory === undefined || onlsearchcategory.pageSize === undefined) {
            ps = 5;
        } else {
            ps = onlsearchcategory.pageSize;
        }
        let tl;
        if (onlsearchcategory === undefined || onlsearchcategory.total === undefined) {
            tl = 1;
        } else {
            tl = Number(onlsearchcategory.total);
        }
        let onlsearchcategoryData;
        if (onlsearchcategory === undefined) {
            onlsearchcategoryData = [];
        } else {
            onlsearchcategoryData = onlsearchcategory.list;
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
                        <div className={styles.tableList}>
                            <div className={styles.tableListOperator}>
                                {this.initShop()}
                                <Button type="primary" htmlType="submit" onClick={() => this.showAddForm({  editForm: 'OnlSearchCategoryForm', editFormTitle: '添加分类' })}>
                                    添加分类
                                </Button>
                                <Button icon="reload" onClick={() => this.handleReload()}>
                                    刷新
                                </Button>
                            </div>
                            <Table
                                rowKey="id"
                                pagination={paginationProps}
                                onChange={this.handleTableChange}
                                loading={loading}
                                dataSource={onlsearchcategoryData}
                                columns={columns}
                            />
                        </div>
                    </Card>
                </PageHeaderLayout>

                {editForm === 'OnlSearchCategoryForm' && (
                    <SlrOnlSearchCategoryForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields =>this.addSearchCategory(fields,editFormType)}
                    />
                )}

                {editForm === 'searchsonCategory' && (
                    <SlrOnlSearchCategoryForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'onlsearchcategory', saveMethodName: 'add' })}
                    />
                )}
            </Fragment>
        );
    }
}
