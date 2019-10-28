import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Card, Switch, Divider, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PrdCategoryMng.less';
import PrdCategoryForm from './PrdCategoryForm';


@Form.create()
@connect(({ prdproductcategory, user, slrshop, loading }) => ({ user, prdproductcategory, slrshop, loading: loading.models.prdproductcategory || loading.models.user }))
export default class PrdCategoryMng extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'prdproductcategory';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
        };
    }

    componentDidMount() {
        // 刷新
        this.handleSearchReload();
    }

    // 刷新搜索分类列表
    handleSearchReload(selectedRows) {
        // 加载搜索分类信息
        this.props.dispatch({
            type: 'prdproductcategory/list',
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
        this.setState({
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        });
        this.props.form.validateFields((err, values) => {
            this.handleReload({
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
            });
        });
    };

    /**
     * 添加分类
     */
    addSearchCategory = (fields, editFormType) => {
        const {user} =this.props;
        let mathod = 'add'
        if (editFormType !== mathod) {
            mathod = 'modify'
        }
        console.log('xx',user);
        fields.opId=user.currentUser.userId;
        this.props.dispatch({
            type: 'prdproductcategory/' + mathod,
            payload: fields,
            callback: () => {
                this.handleReload();
                this.setState({
                    editForm: undefined
                })
            },
        });
    }


    // 启用/禁用搜索分类
    handleEnable(record) {
        this.props.dispatch({
            type: `prdproductcategory/enable`,
            payload: {
                code: record.code,
                isEnabled: !record.isEnabled
            },
            callback: () => {
                const { pageNum,pageSize } = this.state;
                this.handleReload({
                    pageNum: pageNum,
                    pageSize: pageSize,
                });
            },
        });
    }

    render() {
        const { prdproductcategory: { prdproductcategory }, loading,user } = this.props;
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
                title: '分类全称',
                dataIndex: 'fullName',
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
                        <a onClick={() => this.showEditForm({ editFormRecord: record, editForm: 'PrdCategoryForm', editFormTitle: '编辑分类信息' })}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a onClick={() => this.showAddForm({ editFormRecord: { code: record.code,opId:user.currentUser.userId }, editForm: 'searchsonCategory', editFormTitle: '添加子分类' })}>
                            添加子分类
                        </a>
                    </Fragment>
                ),
            },
        ];

        let ps;
        if (prdproductcategory === undefined || prdproductcategory.pageSize === undefined) {
            ps = 5;
        } else {
            ps = prdproductcategory.pageSize;
        }
        let tl;
        if (prdproductcategory === undefined || prdproductcategory.total === undefined) {
            tl = 1;
        } else {
            tl = Number(prdproductcategory.total);
        }
        let prdproductcategoryData;
        if (prdproductcategory === undefined) {
            onlsearchcategoryData = [];
        } else {
            prdproductcategoryData = prdproductcategory.list;
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
                                <Button type="primary" htmlType="submit" onClick={() => this.showAddForm({ editForm: 'PrdCategoryForm', editFormTitle: '添加分类' })}>
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
                                dataSource={prdproductcategoryData}
                                columns={columns}
                            />
                        </div>
                    </Card>
                </PageHeaderLayout>

                {editForm === 'PrdCategoryForm' && (
                    <PrdCategoryForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => this.addSearchCategory(fields, editFormType)}
                    />
                )}

                {editForm === 'searchsonCategory' && (
                    <PrdCategoryForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => {this.handleSubmit({ fields, moduleCode: 'prdproductcategory', saveMethodName: 'add' })}}
                    />
                )}
            </Fragment>
        );
    }
}
