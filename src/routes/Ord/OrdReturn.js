import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Divider, message, Col, Icon, Card, Form, Dropdown, Input, Select, Button, Menu, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OrdReturn.less';
import moment from 'moment';
const { RangePicker } = DatePicker;
import OrdReturnForm from './OrdReturnForm';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ ordreturn, loading }) => ({
    ordreturn,
    loading: loading.models.ordreturn
}))
@Form.create()
export default class OrdReturn extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'ordreturn';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
            returnState: 2,
        };
        this.state.returnCode = undefined;
        this.state.record = undefined;
    }

    //初始化
    componentDidMount() {
        this.state.payloads = {
            pageNum: this.state.options.pageNum,
            pageSize: this.state.options.pageSize,
            returnState: this.state.options.returnState,
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
    };

    //改变页数查询
    handleTableChange = pagination => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        const fieldsValue = {};
        fieldsValue.pageNum = pagination.current;
        fieldsValue.pageSize = pagination.pageSize;
        this.props.dispatch({
            type: `${this.moduleCode}/list`,
            payload: fieldsValue,
        });
    };

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
                            {getFieldDecorator('userName')(<Input placeholder="用户名/单号编号" />)}
                        </FormItem>
                    </Col>
                    <Col md={7} sm={24}>
                        <FormItem label="">
                            {getFieldDecorator('returnTime')(
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    placeholder={['申请开始日期', '申请结束日期']}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="">
                            {getFieldDecorator('returnState', {
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
                title: '订单号',
                dataIndex: 'orderId',
                width: 170,
            },
            {
                title: '上线标题',
                dataIndex: 'onlineTitle',
            },
            {
                title: '数量',
                dataIndex: 'returnCount',
            },
            {
                title: '金额',
                dataIndex: 'returnRental',
            },
            {
                title: '类型',
                dataIndex: 'returnType',
                render: (text, record) => {
                    if (record.returnType === 1) return '仅退款';
                    if (record.returnType === 2) return '退货并退款';
                },
            },
            {
                title: '状态',
                dataIndex: 'refundState',
                render: (text, record) => {
                    if (record.returnType === -1) return '已取消';
                    if (record.returnType === 1) return '待审核';
                    if (record.returnType === 2) return '退货中';
                    if (record.returnType === 3) return '已退货';
                    if (record.returnType === 4) return '已拒绝';
                },
            },

            {
                title: '申请时间',
                dataIndex: 'applicationTime',
            },
            {
                title: '操作',
                width: 100,
                render: (text, record) => {
                    return (
                        <Fragment>
                            <a
                                onClick={() =>
                                    this.showEditForm({ id: record.id, editForm: 'OrdReturn', editFormTitle: '同意退款' })
                                }
                            >同意退款</a>
                        </Fragment>
                    )

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
            </PageHeaderLayout>
        );
    }
}
