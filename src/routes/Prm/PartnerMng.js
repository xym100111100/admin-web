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
const { Search } = Input;
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


    selectPartner = (e) => {
        let paload = {};
        paload.partnerName = e;
        paload.pageNum = this.state.options.pageNum;
        paload.pageSize = this.state.options.pageSize;
        this.props.dispatch({
          type: `${this.moduleCode}/list`,
          payload: paload,
        });
      }

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
                    <Col md={10} sm={24}/>
                    <Col md={8} sm={24}>
                    <Search placeholder="伙伴名称"  onSearch={this.selectPartner}/>
                    </Col>
                </Row>
            </Form>
        );
    }

    // 是否启用
    handleEnable = record => {
        this.props.dispatch({
            type: `prmpartner/enable`,
            payload: { id: record.id, isEnabled: !record.isEnabled, orgId: record.orgId },
            callback: () => {
                this.handleReload();
            },
        });
    }

    render() {
        const { prmpartner: { prmpartner } } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

        const columns = [
            {
                title: '伙伴名称',
                dataIndex: 'partnerName',
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
                            <a
                                onClick={() =>
                                    this.showAddForm({
                                        id: record.id,
                                        editForm: 'partnerForm',
                                        editFormRecord: record,
                                        editFormTitle: '修改伙伴信息',
                                    })
                                }
                            >
                                修改
                            </a>
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
                                saveMethodName: editFormTitle === "添加伙伴" ? 'add' : 'modify',
                            })
                        }
                    />
                )}
            </PageHeaderLayout>
        );
    }
}
