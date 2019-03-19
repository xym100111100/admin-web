import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Card, Switch, Divider, Popconfirm, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import SlrShopForm from './SlrShopForm';
import SlrShopAccountForm from './SlrShopAccountForm';
import SlrSearchCategoryForm from './SlrSearchCategoryForm';
import styles from './SlrShopMng.less';

const { Description } = DescriptionList;

@Form.create()
@connect(({ slrshop, slrshopaccount, loading }) => ({ slrshop, slrshopaccount, loading: loading.models.shpshop }))
export default class SlrShopMng extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'slrshop';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
        };
    }

    // 刷新用户列表
    handleUserReload(selectedRows) {
        // 加载店铺信息
        this.props.dispatch({
            type: 'slrshop/list',
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

    // 启用/禁用店铺
    handleEnable(record) {
        this.props.dispatch({
            type: `slrshop/enable`,
            payload: { id: record.id, isEnabled: !record.isEnabled },
            callback: () => {
                this.handleReload();
            },
        });
    }

    render() {
        const { slrshop: { slrshop }, loading } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

        const columns = [
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
                        <a onClick={() => this.showAddForm({ editFormRecord: record, editForm: 'SlrSearchCategoryForm', editFormTitle: '添加分类' })}>
                            添加分类
                        </a>
                    </Fragment>
                ),
            },
        ];

        let ps;
        if (slrshop === undefined || slrshop.pageSize === undefined) {
            ps = 5;
        } else {
            ps = slrshop.pageSize;
        }
        let tl;
        if (slrshop === undefined || slrshop.total === undefined) {
            tl = 1;
        } else {
            tl = Number(slrshop.total);
        }
        let slrShopData;
        if (slrshop === undefined) {
            slrShopData = [];
        } else {
            slrShopData = slrshop.list;
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
                                <Button icon="reload" onClick={() => this.handleReload()}>
                                    刷新
                                </Button>
                            </div>
                            <Table
                                rowKey="id"
                                pagination={paginationProps}
                                onChange={this.handleTableChange}
                                loading={loading}
                                dataSource={slrShopData}
                                columns={columns}
                                expandRowByClick={true}
                                expandedRowRender={record => (
                                    <DescriptionList className={styles.headerList} size="small" col="2">
                                        <Description term="店铺id">{record.id}</Description>
                                        <Description term="详细地址">{record.adderss}</Description>
                                        <Description term="经度">{record.longitude}</Description>
                                        <Description term="纬度">{record.latitude}</Description>
                                        <Description term="创建时间">{record.createTime}</Description>
                                    </DescriptionList>
                                )}
                            />
                        </div>
                    </Card>
                </PageHeaderLayout>,
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

                {editForm === 'SlrSearchCategoryForm' && (
                    <SlrSearchCategoryForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => this.handleSubmit({ fields, moduleCode: 'slrsearchcategory', saveMethodName: editFormType === 'add' ? 'add' : 'modify' })}
                    />
                )}
            </Fragment>
        );
    }
}
