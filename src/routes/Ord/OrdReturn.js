import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, message, Col, Card, Divider, Form, Input, Select, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrdReturn.less';
import moment from 'moment';
const { RangePicker } = DatePicker;
import OrdReturnForm from './OrdReturnForm';
import OrdRejectForm from './OrdRejectForm';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ ordreturn, user, loading }) => ({
    ordreturn, user,
    loading: loading.models.ordreturn || loading.models.user
}))
@Form.create()
export default class OrdReturn extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'ordreturn';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
            applicationState: 1,
        };
        this.state.returnCode = undefined;
        this.state.record = undefined;
        this.state.expand = {
            expand: '',
            orderId: 0
        }
    }

    //初始化
    componentDidMount() {
        this.state.payloads = {
            pageNum: this.state.options.pageNum,
            pageSize: this.state.options.pageSize,
            applicationState: this.state.options.applicationState,
        };
        this.props.dispatch({
            type: `${this.moduleCode}/list`,
            payload: this.state.payloads,
        });

    }



    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.dispatch({
            type: `${this.moduleCode}/list`,
            payload: this.state.payloads,
        });
    };

    //点击submit查询
    list = () => {
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            fieldsValue.pageNum = this.state.options.pageNum;
            fieldsValue.pageSize = this.state.options.pageSize;
            let info = fieldsValue.userName;
            this.setState({
                options: {
                    pageNum: fieldsValue.pageNum,
                    pageSize: fieldsValue.pageSize,
                    applicationState: fieldsValue.applicationState
                },
            });
            if (info !== undefined) {
                if (/^[0-9]+$/.test(info)) {
                    fieldsValue.orderCode = info;
                    fieldsValue.userName = undefined;
                } else {
                    fieldsValue.orderCode = undefined;
                    fieldsValue.userName = info;
                }
            }
            this.props.dispatch({
                type: `${this.moduleCode}/list`,
                payload: fieldsValue,
            });
        })

    };

    //改变页数查询
    handleTableChange = pagination => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({
                options: {
                    pageNum: pagination.current,
                    pageSize: pagination.pageSize,
                    applicationState: fieldsValue.applicationState
                },
            });
            fieldsValue.pageNum = pagination.current;
            fieldsValue.pageSize = pagination.pageSize;
            let info = fieldsValue.userName;
            if (info !== undefined) {
                if (/^[0-9]+$/.test(info)) {
                    fieldsValue.orderCode = info;
                    fieldsValue.userName = undefined;
                } else {
                    fieldsValue.orderCode = undefined;
                    fieldsValue.userName = info;
                }
            }
            this.props.dispatch({
                type: `${this.moduleCode}/list`,
                payload: fieldsValue,
            });
        })

    };
    /**
 * 获取订单详情和购买关系
 */
    expand = (expanded, record) => {
        if (expanded) {
            this.props.dispatch({
                type: `${this.moduleCode}/detail`,
                payload: { orderId: record.orderId },
                callback: data => {
                    if (data !== undefined && data.length !== 0) {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].downlineRelationSource1 === 0) data[i].downlineRelationSource1 = '未知来源';
                            if (data[i].downlineRelationSource1 === 1) data[i].downlineRelationSource1 = '自己匹配自己';
                            if (data[i].downlineRelationSource1 === 2) data[i].downlineRelationSource1 = '购买关系';
                            if (data[i].downlineRelationSource1 === 3) data[i].downlineRelationSource1 = '邀请关系';
                            if (data[i].downlineRelationSource1 === 4) data[i].downlineRelationSource1 = '差一人且邀请一人';
                            if (data[i].downlineRelationSource1 === 5) data[i].downlineRelationSource1 = '差两人';
                            if (data[i].downlineRelationSource1 === 6) data[i].downlineRelationSource1 = '差一人';
                            if (data[i].downlineRelationSource2 === 0) data[i].downlineRelationSource2 = '未知来源';
                            if (data[i].downlineRelationSource2 === 1) data[i].downlineRelationSource2 = '自己匹配自己';
                            if (data[i].downlineRelationSource2 === 2) data[i].downlineRelationSource2 = '购买关系';
                            if (data[i].downlineRelationSource2 === 3) data[i].downlineRelationSource2 = '邀请关系';
                            if (data[i].downlineRelationSource2 === 4) data[i].downlineRelationSource2 = '差一人且邀请一人';
                            if (data[i].downlineRelationSource2 === 5) data[i].downlineRelationSource2 = '差两人';
                            if (data[i].downlineRelationSource2 === 6) data[i].downlineRelationSource2 = '差一人';
                            if (data[i].uplineRelationSource === 0) data[i].uplineRelationSource = '未知来源';
                            if (data[i].uplineRelationSource === 1) data[i].uplineRelationSource = '自己匹配自己';
                            if (data[i].uplineRelationSource === 2) data[i].uplineRelationSource = '购买关系';
                            if (data[i].uplineRelationSource === 3) data[i].uplineRelationSource = '邀请关系';
                            if (data[i].uplineRelationSource === 4) data[i].uplineRelationSource = '差一人且邀请一人';
                            if (data[i].uplineRelationSource === 5) data[i].uplineRelationSource = '差两人';
                            if (data[i].uplineRelationSource === 6) data[i].uplineRelationSource = '差一人';
                        }
                        this.setState({
                            expand: {
                                expand: data,
                                orderId: data[0].orderId
                            }
                        })
                    }
                }
            });
        }
    }

    showExpand = (record) => {  
       if(record.orderState===-1)record.orderState='作废';
       if(record.orderState===1)record.orderState='已下单';
       if(record.orderState===2)record.orderState='已支付';
       if(record.orderState===3)record.orderState='已发货';
       if(record.orderState===4)record.orderState='已签收';
       if(record.orderState===5)record.orderState='已结算';
        return (
            <div >
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
                    <Col md={5} sm={24}>
                         <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >订单状态 :</span>{record.orderState}
                    </Col>
                    <Col md={8} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >完成时间 :</span>{record.finishTime}
                    </Col>
                </Row>
            </div>
        )
    }

    //禁止选择当前日期后的
    disabledDate = current => {
        return current && current > moment().endOf('day');
    };

    showInput = (record) => {
        if (record.returnState !== 1) {
            message.success('非已下单状态不能修改实际金额');
            return;
        }
        this.setState({
            returnCode: record.returnCode,
        })
    }




    renderSearchForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.list} layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="">
                            {getFieldDecorator('userName')(<Input placeholder="用户名/订单编号" />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="">
                            {getFieldDecorator('applicationState', {
                                initialValue: '1'
                            })(
                                <Select placeholder="申请状态" style={{ width: '100%' }}>
                                    <Option value="1">待审核</Option>
                                    <Option value="2">退货中</Option>
                                    <Option value="3">已退货</Option>
                                    <Option value="4">已拒绝</Option>
                                    <Option value="-1">已取消</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <span>
                            <Button type="primary" htmlType="submit">
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


    render() {

        const { ordreturn: { ordreturn }, loading, } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
        const { user } = this.props;
        editFormRecord.rejectOpId = user.currentUser.userId;
        let ps;
        if (ordreturn === undefined || ordreturn.pageSize === undefined) {
            ps = 5;
        } else {
            ps = ordreturn.pageSize;
        }
        let tl;
        if (ordreturn === undefined || ordreturn.total === undefined) {
            tl = 1;
        } else {
            tl = Number(ordreturn.total);
        }
        let kdilogisticData;
        if (ordreturn === undefined) {
            kdilogisticData = [];
        } else {
            kdilogisticData = ordreturn.list;
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
                title: '用户名',
                dataIndex: 'userName',
                width: 100,
                key: 'userName',
            },
            {
                title: '订单编号',
                dataIndex: 'orderCode',
                key: 'orderCode',
            },
            {
                title: '商品',
                dataIndex: 'onlineTitle',
                key: 'onlineTitle',
                render: (text, record) => {
                    return (record.onlineTitle + "(" + record.specName + ")");
                },
            },
            {
                title: '数量',
                dataIndex: 'returnCount',
                key: 'returnCount',
            },

            {
                title: '金额',
                dataIndex: 'returnRental',
                key: 'returnRental',
            },
            {
                title: '类型',
                dataIndex: 'returnType',
                key: 'returnType',
                render: (text, record) => {
                    if (record.returnType === 1) return '仅退款';
                    if (record.returnType === 2) return '退货并退款';
                },
            },
            {
                title: '状态',
                dataIndex: 'applicationState',
                key: 'applicationState',
                render: (text, record) => {
                    if (record.applicationState === -1) return '已取消';
                    if (record.applicationState === 1) return '待审核';
                    if (record.applicationState === 2) return '退货中';
                    if (record.applicationState === 3) return '已退货';
                    if (record.applicationState === 4) return '已拒绝';
                },
            },
            {
                title: '申请时间',
                dataIndex: 'applicationTime',
                key: 'applicationTime',
            },
            {
                title: '操作',
                width: 100,
                render: (text, record) => {
                    if (record.applicationState !== 1) {
                        return (
                            <Fragment>
                                <a style={{ color: '#C0C0C0' }} >同意退款</a>
                                <a style={{ color: '#C0C0C0' }} >拒绝退款</a>
                            </Fragment>
                        )
                    } else {
                        return (
                            <Fragment>
                                <a
                                    onClick={() =>
                                        this.showEditForm({ id: record.id, editForm: 'OrdReturn', editFormTitle: '同意退款' })
                                    }
                                >同意退款</a>
                                <a
                                    onClick={() =>
                                        this.showEditForm({ id: record.id, editForm: 'OrdReject', editFormTitle: '拒绝退款' })
                                    }
                                >拒绝退款</a>
                            </Fragment>
                        )
                    }
                },
            },
        ];

        return (
            <PageHeaderLayout title="快递订单管理">
                <Card >
                    <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                    <div className={styles.tableList}>
                        <Table
                            rowKey="id"
                            pagination={paginationProps}
                            loading={loading}
                            onChange={this.handleTableChange}
                            dataSource={kdilogisticData}
                            columns={columns}
                            onExpand={this.expand}
                            expandedRowRender={record => this.showExpand(record)}
                        />
                    </div>
                </Card>
                {editForm === 'OrdReturn' && (
                    <OrdReturnForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => {
                            this.handleSubmit({
                                fields,
                            });
                        }}
                    />
                )}
                {editForm === 'OrdReject' && (
                    <OrdRejectForm
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields => {
                            this.handleSubmit({
                                fields,
                                saveMethodName: 'reject',
                            });
                        }}
                    />
                )}
            </PageHeaderLayout>
        );
    }
}
