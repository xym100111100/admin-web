import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Card, Switch, Divider, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SlrShopMng.less';
import SlrSellerForm from './SlrSellerForm';
import SlrShopForm from './SlrShopForm';


@Form.create()
@connect(({ slrseller, slrshop,user, slrshopaccount, loading }) => ({ slrseller, slrshop, user,slrshopaccount, loading: loading.models.slrseller,user }))
export default class SlrSellerMng extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'slrseller';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
        };
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

    render() {
        const {user, slrseller: { slrseller }, loading } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
        const userId = user.currentUser.userId;
        editFormRecord.accountId = userId;
        const columns = [
            {
                title: '卖家名称',
                dataIndex: 'name',
            },
            {
                title: '卖家简称',
                dataIndex: 'shortName',
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
                        <a onClick={() => this.showAddForm({ editFormRecord: {'sellerId':record.id}, editForm: 'SlrShopForm', editFormTitle: '添加店铺' })}>
                            添加店铺
                        </a>
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
            </Fragment>
        );
    }
}
