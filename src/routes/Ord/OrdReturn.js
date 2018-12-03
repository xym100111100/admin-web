import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Popover, Row, message, Radio, Col, Card, Popconfirm, Form, Input, Select, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrdReturn.less';
import moment from 'moment';
import OrdReturnForm from './OrdReturnForm';
import OrdRejectForm from './OrdRejectForm';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
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
            returnType: '',
        };
        this.state.returnCode = undefined;
        this.state.record = undefined;
    }

    //初始化
    componentDidMount() {
        this.state.payloads = {
            pageNum: this.state.options.pageNum,
            pageSize: this.state.options.pageSize,
            applicationState: this.state.options.applicationState,
            returnType: this.state.options.returnType,
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
                    applicationState: fieldsValue.applicationState,
                    returnType: this.state.options.returnType,
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
                    applicationState: fieldsValue.applicationState,
                    returnType: this.state.options.returnType,
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

    showExpand = (record) => {


        if (record.orderState === -1) record.orderState = '作废';
        if (record.orderState === 1) record.orderState = '已下单';
        if (record.orderState === 2) record.orderState = '已支付';
        if (record.orderState === 3) record.orderState = '已发货';
        if (record.orderState === 4) record.orderState = '已签收';
        if (record.orderState === 5) record.orderState = '已结算';
        if (record.subjectType === 0) record.subjectType = '普通';
        if (record.subjectType === 1) record.subjectType = '全返';
        if (record.commissionState === 0) record.commissionState = '匹配中';
        if (record.commissionState === 1) record.commissionState = '待返';
        if (record.commissionState === 2) record.commissionState = '已返';
        return (
            <div >
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
                    <Col md={12} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >退货原因 :</span>{record.returnReason}
                    </Col>
                    {this.showFinishTime(record)}
                    {this.showRejectReason(record)}
                    <Col md={6} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >订单状态 :</span>{record.orderState}
                    </Col>
                    {this.showAmount(record)}
                    <Col md={6} sm={24}>
                        <Col md={9} sm={24}>
                            <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >退货图片 :</span>
                        </Col>
                        {this.showReturnPci(record)}
                    </Col>
                    <Col md={24} sm={24}>
                        <h4 style={{ paddingTop: 8 }} >订单详情信息</h4>
                    </Col>
                    <Col md={6} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >购买价格 :</span>{record.buyPrice}
                    </Col>
                    <Col md={6} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >购买数量 :</span>{record.buyCount}
                    </Col>
                    <Col md={6} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >购买总价 :</span>{record.buyCount * record.buyPrice}
                    </Col>
                    <Col md={6} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >版块类型 :</span>{record.subjectType}
                    </Col>
                    <Col md={6} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >返佣金名额 :</span>{record.commissionSlot}
                    </Col>
                    <Col md={6} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >返佣金状态 :</span>{record.commissionState}
                    </Col>
                </Row>
            </div>
        )
    }
    /**
     * 显示退货图片
     */
    showReturnPci = (record) => {
        let content1 = '';
        if (record.picList[0] !== undefined) {
            content1 = (
                <img
                    alt="退货图片1"
                    style={{ height: 300, width: 300 }}
                    src={'/ise-svr/files' + record.picList[0].picPath}
                />
            );
        }
        let content2 = '';
        if (record.picList[1] !== undefined) {
            content2 = (
                <img
                    alt="退货图片2"
                    style={{ height: 300, width: 300 }}
                    src={'/ise-svr/files' + record.picList[1].picPath}
                />
            );
        }
        let content3 = '';
        if (record.picList[2] !== undefined) {
            content3 = (
                <img
                    alt="退货图片3"
                    style={{ height: 300, width: 300 }}
                    src={'/ise-svr/files' + record.picList[2].picPath}
                />
            );
        }
        return (
            <Col md={15} sm={24}>
                {record.picList[0] !== undefined && (
                    <Col md={8} sm={24}>
                        <Popover content={content1} placement={'left'} >
                            <div style={{ cursor: 'hand', cursor: 'pointer', width: 20, height: 20, backgroundImage: 'url(/ise-svr/files' + record.picList[0].picPath + ')' }} ></div>
                        </Popover>
                    </Col>
                )}
                {record.picList[1] !== undefined && (
                    <Col md={8} sm={24}>
                        <Popover content={content2} placement={'left'} >
                            <div style={{ cursor: 'hand', cursor: 'pointer', width: 20, height: 20, backgroundImage: 'url(/ise-svr/files' + record.picList[1].picPath + ')' }} ></div>
                        </Popover>
                    </Col>
                )}
                {record.picList[2] !== undefined && (
                    <Popover content={content3} placement={'left'} >
                        <Col md={8} sm={24}>
                            <div style={{ cursor: 'hand', cursor: 'pointer', width: 20, height: 20, backgroundImage: 'url(/ise-svr/files' + record.picList[2].picPath + ')' }} ></div>
                        </Col>
                    </Popover>
                )}
            </Col>
        )
    }
    /**
     * 根据是否有退款金额来决定显示退款金额
     */
    showAmount = (record) => {
        if (record.returnAmount1 === undefined) {
            return
        } else {
            return (
                <Col md={12} sm={24}>
                    <Col md={12} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >退货余额 :</span>{record.returnAmount1}
                    </Col>
                    <Col md={12} sm={24}>
                        <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >退货返现金 :</span>{record.returnAmount2}
                    </Col>
                </Col>
            )
        }
    }

    /**
     * 根据是否有退货原因来决定是否显示退货原因
     */
    showRejectReason = (record) => {
        if (record.rejectReason === undefined) {
            return
        } else {
            return (
                <Col md={12} sm={24}>
                    <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >拒绝原因 :</span>{record.rejectReason}
                </Col>
            )
        }
    }
    /**
     * 根据是否有完成时间来决定是否显示完成时间
     */
    showFinishTime = (record) => {
        if (record.finishTime === undefined) {
            return
        } else {
            return (
                <Col md={12} sm={24}>
                    <span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >完成时间 :</span>{record.finishTime}
                </Col>
            )
        }
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

    // 同意退货
    agreeReturn = id => {
        this.props.dispatch({
            type: `${this.moduleCode}/agreeReturn`,
            payload: { id: id },
            callback: () => {
                this.handleReload();
            },
        });
    }

    
    setReturnType=(value)=>{
        this.setState({
            returnState:value,
        })
    }

    // 搜索
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
                    <Col md={8} sm={24}>
                        <FormItem   >
                            {getFieldDecorator('returnType', {
                                initialValue: '',
                            })(
                                <RadioGroup style={{ width: 280 }} >
                                    <RadioButton onClick={() => this.setReturnType('')} value="">
                                        全部
                                    </RadioButton>
                                    <RadioButton onClick={() => this.setReturnType(1)} value="1">
                                         仅退款
                                    </RadioButton>
                                    <RadioButton onClick={() => this.setReturnType(2)} value="2">
                                         退货并退款
                                    </RadioButton>
                                </RadioGroup>
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
                width: 150,
            },
            {
                title: '商品',
                dataIndex: 'onlineTitle',
                key: 'onlineTitle',
            },
            {
                title: '数量',
                dataIndex: 'returnCount',
                key: 'returnCount',
                width: 80,
            },

            {
                title: '金额',
                dataIndex: 'returnRental',
                key: 'returnRental',
                width: 70,
                render: (text, record) => {
                    if (record.refundTotal !== undefined) {
                        return record.refundTotal;
                    } else {
                        return record.returnRental;
                    }
                }
            },
            {
                title: '类型',
                dataIndex: 'returnType',
                key: 'returnType',
                width: 80,
                render: (text, record) => {
                    if (record.returnType === 1) return '仅退款';
                    if (record.returnType === 2) return '退货并退款';
                },
            },
            {
                title: '状态',
                dataIndex: 'applicationState',
                key: 'applicationState',
                width: 80,
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
                width: 100,
            },
            {
                title: '操作',
                width: 100,
                render: (text, record) => {
                    if (record.applicationState !== 1 && record.applicationState !== 2) {
                        return (
                            <Fragment>
                                <a style={{ color: '#C0C0C0' }} >同意退款</a>
                                <a style={{ color: '#C0C0C0' }} >拒绝退款</a>
                            </Fragment>
                        )
                    } else {
                        if (record.applicationState === 1) {
                            if (record.returnType === 1) {
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
                            } else {
                                return (
                                    <Fragment>
                                        <Popconfirm title="订单已发货，确认已经收到用户退货？" onConfirm={() => this.agreeReturn(record.id)}>
                                            <a>同意退货</a>
                                        </Popconfirm>
                                        <a
                                            onClick={() =>
                                                this.showEditForm({ id: record.id, editForm: 'OrdReject', editFormTitle: '拒绝退款' })
                                            }
                                        >拒绝退货</a>
                                    </Fragment>
                                )
                            }
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
                                saveMethodName: 'refund',
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