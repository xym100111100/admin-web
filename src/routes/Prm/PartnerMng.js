import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
    Button, Card, Divider, Popconfirm, Select,
    Form, Table, Input, Row, Col, Switch,
    List, Menu, Dropdown, Icon,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './PartnerMng.less';
import PartnerForm from './PartnerForm';

const FormItem = Form.Item;
const Option = Select.Option;
const { Description } = DescriptionList;

@connect(({ prmpartner }) => ({ prmpartner }))
@Form.create()
export default class PartnerMng extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'prmpartner';
        this.state.options = {
            pageNum: 1,
            pageSize: 5,
        };
    }

    handleTableChange = pagination => {
        this.props.form.validateFields((err, values) => {
            this.handleReload({
                onlineTitle: values.onlineTitle,
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
            });
        });
    };

    // 重置from
    handleFormReset = () => {
        this.props.form.resetFields();
    };

    // 搜索
    renderSearchForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => this.showAddForm({ editForm: 'partnerForm', editFormTitle: '添加伙伴' })}
                        >
                            添加
                        </Button>
                        <Divider type="vertical" />
                        <Button icon="reload" onClick={() => this.handleReload()}>
                            刷新
                        </Button>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="上线标题">{getFieldDecorator('onlineTitle')(<Input placeholder="上线标题" />)}</FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="上线状态">
                            {getFieldDecorator('onlineState', {
                                initialValue: '1',
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value="1">已上线</Option>
                                    <Option value="0">已下线</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <span style={{ float: 'left', marginBottom: 24 }}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

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

    render() {
        const { prmpartner: { prmpartner } } = this.props;
        console.log(prmpartner)
        const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

        const columns = [
            {
                title: '伙伴名称',
                dataIndex: 'partnerName',
            },
            {
                title: '伙伴类型',
                dataIndex: 'partnerType',
            },
            {
                title: '是否启用',
                dataIndex: 'isEnabled',
                render: (text, record) => {
                    return (
                        <Fragment>
                            <Switch
                                checkedChildren="锁定"
                                unCheckedChildren="未锁"
                                checked={record.isEnabled}
                                onChange={() => this.handleEnable(record)}
                            />
                        </Fragment>
                    );
                },
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
            },
            {
                title: '操作',
                render: (text, record) => {
                    return (
                        <Fragment>
                            <Divider type="vertical" />
                            <List.Item
                                actions={[
                                    <Popconfirm title="是否要下线此商品？" onConfirm={() => this.tapeOut(record)}>
                                        <a>下线</a>
                                    </Popconfirm>,
                                ]}
                            />
                            <Divider type="vertical" />
                        </Fragment>
                    );
                },
            },
        ];

        let ps;
        if (prmpartner === undefined || prmpartner.pageSize === undefined) {
            ps = 5;
        } else {
            ps = prmpartner.pageSize;
        }
        let tl;
        if (prmpartner === undefined || prmpartner.total === undefined) {
            tl = 1;
        } else {
            tl = Number(prmpartner.total);
        }
        let prmpartnerData;
        if (prmpartner === undefined) {
            prmpartnerData = [];
        } else {
            prmpartnerData = prmpartner.list;
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
                            onChange={this.handleTableChange}
                            dataSource={prmpartnerData}
                            columns={columns}
                            expandRowByClick={true}
                            expandedRowRender={record => (
                                <DescriptionList className={styles.headerList} size="small" col="2">
                                    <Description term="公司地址">{record.companyAddress}</Description>
                                    <Description term="联系方式">{record.contact}</Description>
                                    <Description term="业务员">{record.salesmanName}</Description>
                                    <Description term="备注">{record.remark}</Description>
                                </DescriptionList>
                            )}
                        />
                    </div>
                </Card>
                {editForm === 'partnerForm' && (
                    <PartnerForm
                        visible
                        title={editFormTitle}
                        width={650}
                        height={490}
                        id={editFormRecord.id}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={fields =>
                            this.handleSubmit({
                                fields,
                                moduleCode: 'prmpartner',
                                saveMethodName: 'add',
                            })
                        }
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
                        width={1000}
                        height={490}
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
