import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Card, Switch, Divider, Row, Col, Table, Popover } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './SlrShopMng.less';
import SlrSellerForm from './SlrSellerForm';
import SlrShopForm from './SlrShopForm';
import SlrShopAccountForm from './SlrShopAccountForm';

const { Description } = DescriptionList;

@Form.create()
@connect(({ slrseller, slrshop, slrshopaccount, loading }) => ({ slrseller, slrshop, slrshopaccount, loading: loading.models.slrseller }))
export default class SlrSellerMng extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'slrseller';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
        };
    }

    state = {
        shopDetailData: undefined
    }

    // 刷新用户列表
    handleUserReload(selectedRows) {
        // 加载用户信息
        this.props.dispatch({
            type: 'slrseller/list',
            payload: {
                pageNum: 1,
                pageSize: 5,
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

    // 启用/禁用组织
    handleEnable(record) {
        this.props.dispatch({
            type: `slrseller/enable`,
            payload: { id: record.id, isEnabled: !record.isEnabled },
            callback: () => {
                this.handleReload();
            },
        });
    }

    /**
     * 获取卖家店铺
     * @param {*} record 
     */
    getSellerShop(record) {
        // 加载用户信息
        this.props.dispatch({
            type: 'slrshop/list',
            payload: {
                sellerId: record.id,
                pageNum: 1,
                pageSize: 5,
            },
            callback: (shopInfo) => {
                this.setState({ shopInfo });
            },
        });
    }

    /**
     * 店铺显示隐藏的回调
     * @param {*} record 
     */
    shopIsibleChange(record) {
        this.setState({
            shopDetailData: record
        });
    }

    showShopDetail(record) {
        return (
            <div>
                <DescriptionList className={styles.headerList} size="small" col="2">
                    <Description term="店铺id">{record.id}</Description>
                    <Description term="店铺名称">{record.shopName}</Description>
                    <Description term="店铺简称">{record.shopAbbre}</Description>
                    <Description term="店铺地址">{record.adderss}</Description>
                    <Description term="联系方式">{record.contact}</Description>
                    <Description term="是否已启用">
                        <Fragment>
                            <Switch
                                checkedChildren="已启用"
                                unCheckedChildren="未启用"
                                checked={record.isEnabled}
                            />
                        </Fragment>
                    </Description>
                    <Description term="经度">{record.longitude}</Description>
                    <Description term="纬度">{record.latitude}</Description>
                    <Description term="卖家名称">{record.orgName}</Description>
                    <Description term="创建时间">{record.createTime}</Description>
                </DescriptionList>
            </div>
        )
    }

    render() {
        const { slrseller: { slrseller }, loading } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord, shopInfo } = this.state;

        const content = (
            <div>
                {this.state.shopDetailData !== undefined && this.showShopDetail(this.state.shopDetailData)}
            </div>
        );

        const columns = [
            {
                title: '卖家名称',
                dataIndex: 'name',
            },
            {
                title: '卖家描述',
                dataIndex: 'remark',
            },
            {
                title: '联系方式',
                dataIndex: 'contact',
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
                            />
                        </Fragment>
                    );
                },
            },
            {
                title: '所属组织',
                dataIndex: 'orgName',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <a onClick={() => this.showEditForm({ id: record.id, editFormRecord: record, editForm: 'SlrSellerForm', editFormTitle: '编辑卖家信息' })}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a onClick={() => this.showAddForm({ editFormRecord: record, editForm: 'SlrShopForm', editFormTitle: '添加店铺' })}>
                            添加店铺
                        </a>
                    </Fragment>
                ),
            },
        ];

        // 获取body的宽度，用于调整popver的宽度
        let bodyWidth = document.body.clientWidth;

        const shopColumns = [
            {
                title: '店铺名称',
                dataIndex: 'shopName',
            },
            {
                title: '店铺简称',
                dataIndex: 'shopAbbre',
            },
            {
                title: '地址',
                dataIndex: 'adderss',
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
                title: '所属组织',
                dataIndex: 'orgName',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <a onClick={() => this.showEditForm({ id: record.id, editFormRecord: record, editForm: 'SlrShopForm', editFormTitle: '编辑店铺信息' })}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a
                            onClick={() =>
                                this.showEditForm({
                                    editFormRecord: record,
                                    id: record.id,
                                    moduleCode: 'slrshopaccount',
                                    getByIdMethodName: 'getShopAccountList',
                                    editForm: 'slrShopAccountForm',
                                    editFormTitle: '设置店铺的用户',
                                })
                            }
                        >
                            用户
                        </a>
                        <Divider type="vertical" />
                        <Popover
                            autoAdjustOverflow={true}
                            arrowPointAtCenter={true}
                            overlayStyle={{ width: bodyWidth - 500 }}
                            trigger='click'
                            placement='right'
                            onVisibleChange={(visible) => !visible || this.shopIsibleChange(record)}
                            content={content}
                            title="店铺详情"
                        >
                            <a>详情</a>
                        </Popover>
                    </Fragment>
                ),
            },
        ];

        let ps;
        if (slrseller === undefined || slrseller.pageSize === undefined) {
            ps = 5;
        } else {
            ps = slrseller.pageSize;
        }
        let tl;
        if (slrseller === undefined || slrseller.total === undefined) {
            tl = 1;
        } else {
            tl = Number(slrseller.total);
        }
        let slrSellerData;
        if (slrseller === undefined) {
            slrSellerData = [];
        } else {
            slrSellerData = slrseller.list;
        }

        // 分页
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: ps,
            total: tl,
            pageSizeOptions: ['5', '10'],
        };

        let shopData;
        if (shopInfo === undefined) {
            shopData = [];
        } else {
            shopData = shopInfo.list;
        }

        return (
            <Fragment>
                <PageHeaderLayout>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            <div className={styles.tableListOperator}>
                                <Button
                                    icon="plus"
                                    type="primary"
                                    onClick={() => this.showAddForm({ editForm: 'SlrSellerForm', editFormTitle: '添加新卖家' })}
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
                                loading={loading}
                                dataSource={slrSellerData}
                                columns={columns}
                                expandRowByClick={true}
                                onExpand={record => this.getSellerShop(record)}
                                expandedRowRender={record =>
                                    <Table rowKey="id"
                                        loading={loading}
                                        pagination={false}
                                        dataSource={shopData}
                                        columns={shopColumns}
                                        expandRowByClick={true}
                                    />
                                }
                            />
                        </div>
                    </Card>
                </PageHeaderLayout>,

                {editForm === 'SlrSellerForm' && (
                    <SlrSellerForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'slrseller', saveMethodName: editFormType === 'add' ? 'add' : 'modify' })}
                    />
                )}

                {editForm === 'SlrShopForm' && (
                    <SlrShopForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'slrshop', saveMethodName: editFormType === 'add' ? 'add' : 'modify' })}
                    />
                )}

                {editForm === 'slrShopAccountForm' && (
                    <SlrShopAccountForm
                        id={editFormRecord.id}
                        modelName="slrshopaccount" //
                        visible
                        title={editFormTitle}
                        record={editFormRecord}
                        width={815}
                        editFormType={editFormType}
                        closeModal={() => this.setState({ editForm: undefined })}
                    />
                )}
            </Fragment>
        );
    }
}
