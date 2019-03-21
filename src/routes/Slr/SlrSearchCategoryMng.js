import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Card, Switch, Divider, Row, Col, Table, Popover, Tabs } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './SlrShopMng.less';
import SlrSearchCategoryForm from './SlrSearchCategoryForm';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@Form.create()
@connect(({ slrsearchcategory, slrshop, loading }) => ({ slrsearchcategory, slrshop, loading: loading.models.slrsearchcategory }))
export default class SlrSearchCategoryMng extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'slrsearchcategory';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
        };
    }

    componentDidMount() {
        // 刷新
        this.props.dispatch({
            type: `slrshop/shopList`,
            callback: () => {
                const { slrshop: { slrshop } } = this.props;
                this.handleReload({ shopId: slrshop[0].id });
            },
        });
    }

    // 刷新用户列表
    handleUserReload(selectedRows) {
        // 加载用户信息
        this.props.dispatch({
            type: 'slrsearchcategory/list',
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
            });
        });
    };

    /**
     * 切换店铺
     */
    switchShop = activeKey => {
        this.handleUserReload({ shopId: activeKey });
    }

    // 启用/禁用搜索分类
    handleEnable(record) {
        this.props.dispatch({
            type: `slrsearchcategory/enable`,
            payload: {
                sellerId: record.sellerId,
                shopId: record.shopId,
                code: record.code,
                isEnabled: !record.isEnabled
            },
            callback: () => {
                this.handleReload({ shopId: record.shopId });
            },
        });
    }

    render() {
        const { slrsearchcategory: { slrsearchcategory }, slrshop: { slrshop }, loading } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
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
                        return (<img alt="example" style={{ width: '100%' }} src={'/ise-svr/files' + text} />);
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
                        <a onClick={() => this.showEditForm({ id: record.id, editFormRecord: record, editForm: 'SlrSearchCategoryForm', editFormTitle: '编辑分类信息' })}>
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
        if (slrsearchcategory === undefined || slrsearchcategory.pageSize === undefined) {
            ps = 5;
        } else {
            ps = slrsearchcategory.pageSize;
        }
        let tl;
        if (slrsearchcategory === undefined || slrsearchcategory.total === undefined) {
            tl = 1;
        } else {
            tl = Number(slrsearchcategory.total);
        }
        let slrsearchcategoryData;
        if (slrsearchcategory === undefined) {
            slrsearchcategoryData = [];
        } else {
            slrsearchcategoryData = slrsearchcategory.list;
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
                                <Tabs onChange={this.switchShop}>{slrshop.map(shop => <TabPane tab={shop.shortName} key={shop.id} />)}</Tabs>
                                <Button icon="reload" onClick={() => this.handleReload()}>
                                    刷新
                                </Button>
                            </div>
                            <Table
                                rowKey="id"
                                pagination={paginationProps}
                                onChange={this.handleTableChange}
                                loading={loading}
                                dataSource={slrsearchcategoryData}
                                columns={columns}
                            />
                        </div>
                    </Card>
                </PageHeaderLayout>,

                {editForm === 'SlrSearchCategoryForm' && (
                    <SlrSearchCategoryForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'slrsearchcategory', saveMethodName: 'modify' })}
                    />
                )}

                {editForm === 'searchsonCategory' && (
                    <SlrSearchCategoryForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'slrsearchcategory', saveMethodName: 'add' })}
                    />
                )}
            </Fragment>
        );
    }
}
