import React, { Fragment, PureComponent } from 'react';
import { Form, Table, Input, Row, Col, Select } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import KdiCompany from 'components/Kdi/KdiCompany';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
// 添加与编辑的表单
@connect(({ kdisender, ordorder, user, loading }) => ({
    kdisender, user, ordorder,
    loading: loading.models.kdisender || loading.models.user || loading.models.ordorder
}))
@EditForm
export default class OrdSendForm extends PureComponent {

    state = {
        detailData: '',
        selectedRowKeys: [],
        receiverInfo: '',
        remarks: '',
        orderMessages: '',
        willBeliver: [],
        delivered: [],
    }
    //初始化
    componentDidMount() {
        const { user, record } = this.props;
        const orgId = user.currentUser.orgId;
        this.props.dispatch({
            type: `kdisender/list`,
            payload: { orgId: orgId },
        });
        this.setState({
            receiverInfo: record,
            orderMessages: record.orderMessages,
        })
        this.props.dispatch({
            type: `ordorder/detail`,
            payload: { orderId: record.id },
            callback: data => {
                let keys = [];
                let remarks = '';
                let willBeliver = [];
                let delivered = [];
                //设置买家留言
                if (this.state.orderMessages !== undefined) {
                    remarks += '买家留言:' + this.state.orderMessages + ' 。';
                }
                remarks += '卖家备注 : ';
                //设置已发货和未发货的表达数据

                for (let index = 0; index < data.length; index++) {
                    //这一行代码是为了默认全选的。
                    keys.push(data[index].id);

                    if (data[index].subjectType === 0) {
                        data[index].subjectType = '普通';
                    } else if (data[index].subjectType === 1) {
                        data[index].subjectType = '全返';
                    } else {
                        data[index].subjectType = '未知';
                    }

                    if (data[index].beliver == true) {
                        delivered.push(data[index])
                    } else {
                        willBeliver.push(data[index])
                        //这里是设置发货备注的,只有在没有发货的详情才会加进去备注中。
                        let count = data[index].buyCount - data[index].returnCount;
                        remarks += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;
                        if (index + 1 === data.length) {
                            remarks += ' 。 ';
                        } else {
                            remarks += ' ， ';
                        }
                    }
                }
                this.setState({
                    willBeliver,
                    delivered,
                    selectedRowKeys: keys,
                    remarks: remarks,
                })
            }
        });
    }


    setDetaileData = (count, data) => {
        const { form } = this.props;
        this.setState({
            detailData: data,
        })
        let rowKeys = [];
        let remarks = '';
        //设置买家留言
        if (this.state.orderMessages !== undefined) {
            remarks += '买家留言:' + this.state.orderMessages + ' 。';
        }
        remarks += '卖家备注 : ';
        for (let index = 0; index < data.length; index++) {
            //改变发货备注
            let count = data[index].buyCount - data[index].returnCount;
            remarks += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;
            if (index + 1 === data.length) {
                remarks += ' 。 ';
            } else {
                remarks += ' ， ';
            }
            //改变选中的项
            rowKeys.push(data[index].id);
        }
        this.setState({
            selectedRowKeys: rowKeys,
            remarks: remarks,
        })
        form.setFieldsValue({ orderTitle: remarks });
    }

    /**
     * 修改发货备注
     */
    textChange = (value) => {
        const { form } = this.props;
        this.setState({
            remarks: value.target.value,
        })
        form.setFieldsValue({ orderTitle: value.target.value });
    }

    render() {
        const { form, kdisender } = this.props;
        const sender = kdisender.kdisender;
        const { ...props } = this.props;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setDetaileData(selectedRowKeys, selectedRows);
            },
            selectedRowKeys: this.state.selectedRowKeys,
        };
        //这个是已经发货的规则
        const rowSelection2 = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.id !== 'Disabled User', // Column configuration not to be checked
                name: record.id,
            }),
        };

        let defaultItems;
        if (sender === undefined || sender.length === 0 || sender.length === undefined) {
            return <Select placeholder="请选择发件人" />;
        }
        const listItems = sender.map(items => {
            if (items.isDefault === true) {
                defaultItems =
                    items.senderName + '/'
                    + items.senderMobile + '/'
                    + items.senderProvince + '/'
                    + items.senderCity + '/'
                    + items.senderExpArea + '/'
                    + items.senderPostCode + '/'
                    + items.senderAddress + '/';
                return (
                    <Option value={
                        items.senderName + '/'
                        + items.senderMobile + '/'
                        + items.senderProvince + '/'
                        + items.senderCity + '/'
                        + items.senderExpArea + '/'
                        + items.senderPostCode + '/'
                        + items.senderAddress + '/'
                    }
                        key={items.id.toString()}>
                        {items.senderName}
                    </Option>
                );
            } else {
                return (
                    <Option value={
                        items.senderName + '/'
                        + items.senderMobile + '/'
                        + items.senderProvince + '/'
                        + items.senderCity + '/'
                        + items.senderExpArea + '/'
                        + items.senderPostCode + '/'
                        + items.senderAddress + '/'
                    } key={items.id.toString()}>
                        {items.senderName}
                    </Option>
                );
            }
        });
        const detailData = this.state.willBeliver;
        const columns = [
            {
                title: '未发货商品',
                dataIndex: 'onlineTitle',
                render: (text, record) => {
                    return (
                        <div>
                            <span>商品名称 : {record.onlineTitle}</span>
                            <br />
                            <span>规格 : {record.specName}</span>
                            <br />
                            <span>类型 : {record.subjectType}</span>
                            <br />
                            <span>数量 : {record.buyCount - record.returnCount + 'x' + record.buyPrice}</span>
                        </div>
                    )

                }
            },
        ]


        const detailData2 = this.state.delivered;

        const columns2 = [
            {
                title: '已经发货商品',
                dataIndex: 'onlineTitle',
                render: (text, record) => {
                    return (
                        <div>
                            <span>商品名称 : {record.onlineTitle}</span>
                            <br />
                            <span>规格 : {record.specName}</span>
                            <br />
                            <span>类型 : {record.subjectType}</span>
                            <br />
                            <span>数量 : {record.buyCount - record.returnCount + 'x' + record.buyPrice}</span>
                        </div>
                    )

                }
            },
        ]





        if (this.props.step === '2') {
            return (
                <Fragment>
                    <p style={{ marginTop: -20 }} >买家收货信息: {this.state.receiverInfo.receiverProvince + this.state.receiverInfo.receiverCity + this.state.receiverInfo.receiverExpArea + this.state.receiverInfo.receiverAddress + '  ' + this.state.receiverInfo.receiverName + '·' + this.state.receiverInfo.receiverMobile}</p>
                    {form.getFieldDecorator('id')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderCode')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderState')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderRemarks', {
                        rules: [
                            {
                                required: true,
                                message: '订单备注',
                            },
                        ],
                        initialValue: this.state.remarks,

                    })(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverName')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverProvince')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverCity')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverExpArea')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverAddress')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverMobile')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverTel')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverPostCode')(<Input type="hidden" />)}
                    {form.getFieldDecorator('senderInfo')(<Input type="hidden" />)}
                    {form.getFieldDecorator('shipperInfo')(<Input type="hidden" />)}
                    {form.getFieldDecorator('senderPostCode', {
                        rules: [
                            {
                                required: true,
                                message: '请输入选择发件人发件地编码',
                            },
                        ],
                        initialValue: '000000',

                    })(<Input type="hidden" />)}

                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col md={17} sm={24}  >
                            <p style={{ marginBottom: -1 }} >请选择要发货的详情:</p>
                        </Col>
                        <Col md={16} sm={24}  >
                            <div >
                                <Table
                                    rowKey="id"
                                    dataSource={detailData}
                                    columns={columns}
                                    pagination={false}
                                    rowSelection={rowSelection}

                                />
                                <Table
                                    rowKey="id"
                                    dataSource={detailData2}
                                    columns={columns2}
                                    pagination={false}
                                    rowSelection={rowSelection2}

                                />
                            </div>
                        </Col>
                        <Col md={8} sm={24}  >
                            <p style={{ marginBottom: -1 }} >买家留言与商家发货备注:</p>
                            <textarea onChange={(value) => this.textChange(value)} style={{ width: '100%', }} rows="6" value={this.state.remarks} >
                            </textarea>
                        </Col>
                    </Row>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    {form.getFieldDecorator('id')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderCode')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderState')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderRemarks', {
                        rules: [
                            {
                                required: true,
                                message: '订单备注',
                            },
                        ],
                        initialValue: this.state.remarks,

                    })(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverName')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverProvince')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverCity')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverExpArea')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverAddress')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverMobile')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverTel')(<Input type="hidden" />)}
                    {form.getFieldDecorator('receiverPostCode')(<Input type="hidden" />)}
                    {form.getFieldDecorator('senderPostCode', {
                        rules: [
                            {
                                required: true,
                                message: '请输入选择发件人发件地编码',
                            },
                        ],
                        initialValue: '000000',

                    })(<Input type="hidden" />)}

                    <Form layout="inline">
                        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                            <Col md={10} sm={24} >
                                <KdiCompany SelectStyle={{ width: 170 }} form={form} />
                            </Col>
                            <Col md={10} sm={24}  >
                                <FormItem style={{ marginLeft: 15 }} label="发件人" >
                                    {form.getFieldDecorator('senderInfo', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入选择发件人',
                                            },
                                        ],
                                        initialValue: defaultItems,
                                    })(
                                        <Select {...props} placeholder="请选择发件人" style={{ width: 170 }} >
                                            {listItems}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Fragment>
            );
        }


    }
}
