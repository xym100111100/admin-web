import React, { Fragment, PureComponent } from 'react';
import { Form, Button, List, Icon, Table, Input, Row, Col, Select } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './OrdOrder.less';
import { connect } from 'dva';
const FormItem = Form.Item;
// 添加与编辑的表单
@connect(({ kdisender, kdicompany, ordorder, user, loading }) => ({
    kdisender, user, ordorder, kdicompany,
    loading: loading.models.kdisender || loading.models.user || loading.models.ordorder || loading.models.kdicompany
}))
@EditForm
export default class OrdSendForm extends PureComponent {

    state = {
        selectedRowKeys: [], //被选中的key用于页面显示
        allRowKeys: [],
        receiverInfo: '', //收件人信息
        orderDetail: '详情备注',//包括订单留言
        deliverRemark: '发货备注',
        orderMessages: '', //订单留言
        willDeliver: [], //将要发货的详情数据用于展示
        delivered: [], //已经发货的详情数据用于展示
        selectDetailId: '',//选中的详情Id，用于后台修改
        allDetaileId: '',//所有未发货的详情Id，用于后台与选中的对比来觉得是否改订单状态
        step: '',
        loading: false,
        hasMore: true,
        kdicompany: [],//快递公司数据集合
        defaultCompanyId: 0,//默认快递公司Id
        defaultCompany: '',//默认快递公司，用于提交
        defaultCompanyInfo: {},//用于显示成功后
        sendData: [],//发件人数据集合
        defaultSend: '',//默认发件人,用于提交
        defaultSendId: 0,//默认发件人Id
        defaultSendInfo: {}//用于显示成功后
    }

    componentDidMount() {
        this.initDetailData();
    }

    /**
     * 这里只是为了页面不出现警告
     */
    handleInfiniteOnLoad = () => { };

    /**
     * 初始化
     */
    initDetailData = () => {
        const { user, record } = this.props;
        const orgId = user.currentUser.orgId;
        this.setState({
            step: this.props.step,
        })
        this.props.dispatch({
            type: `kdisender/list`,
            payload: { orgId: orgId },
            callback: data => {
                for (let i = 0; i < data.length; i++) {
                    //设置默认发件人id和默认发件人以便后面修改
                    if (data[i].isDefault) {
                        this.setState({
                            defaultSendId: data[i].id,
                            defaultSend: data[i].senderName + '/' + data[i].senderMobile + '/'
                                + data[i].senderProvince + '/' + data[i].senderCity + '/' + data[i].senderExpArea + '/'
                                + data[i].senderPostCode + '/' + data[i].senderAddress,
                            defaultSendInfo: data[i],
                        })
                    }
                }
                this.setState({
                    sendData: data,
                })
            }
        });
        this.props.dispatch({
            type: `kdicompany/list`,
            payload: { orgId: orgId },
            callback: data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].payType === 1) {
                        data[i].payType = '现付';
                    } else if (data[i].payType === 2) {
                        data[i].payType = '到付';
                    } else if (data[i].payType === 3) {
                        data[i].payType = '月结';
                    } else if (data[i].payType === 4) {
                        data[i].payType = '第三方付';
                    }
                    //设置默认快递公司id以便后面修改
                    if (data[i].isDefault) {
                        this.setState({
                            defaultCompanyId: data[i].id,
                            defaultCompany: data[i].id + '/' + data[i].companyName + '/' + data[i].companyCode,
                            defaultCompanyInfo: data[i],
                        })
                    }
                }
                this.setState({
                    kdicompany: data,
                })
            }
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
                let orderDetail = '';
                let willDeliver = [];
                let delivered = [];
                let selectDetailId = '';
                let allDetaileId = '';
                let deliverRemark = '';
                let allRowKeys = [];
                //设置买家留言
                if (this.state.orderMessages !== undefined) {
                    orderDetail += '买家留言:' + this.state.orderMessages + ' 。';
                }
                orderDetail += '卖家备注 : ';
                //设置已发货和未发货的表达数据

                for (let index = 0; index < data.length; index++) {
                    if (data[index].subjectType === 0) {
                        data[index].subjectType = '普通';
                    } else if (data[index].subjectType === 1) {
                        data[index].subjectType = '全返';
                    } else {
                        data[index].subjectType = '未知';
                    }

                    if (this.props.first === false) {
                        if (data[index].returnState === 0 || data[index].returnState === 3) {
                            //所有没有发货的详情Id，不在其他修改，用于后面成功后对比
                            allRowKeys.push(data[index])
                            //所有不是退货的详情
                            willDeliver.push(data[index])
                            //这一行代码是为了默认全选的。
                            keys.push(data[index].id);
                            //这里是设置发货备注的,只有在没有发货的详情才会加进去备注中。
                            let count = data[index].buyCount - data[index].returnCount;
                            orderDetail += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;
                            if (index + 1 === data.length) {
                                orderDetail += ' 。 ';
                            } else {
                                orderDetail += ' ， ';
                            }
                            //设置要发货详情id
                            selectDetailId += data[index].id + '/';
                            //设置所有未发货的详情Id
                            allDetaileId += data[index].id + '/';
                            //设置发货成功的备注
                            deliverRemark += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;
                        }

                    } else if (this.props.first === true) {
                        if (data[index].isDeliver == true && (data[index].returnState === 0 || data[index].returnState === 3)) {
                            //已经发货且不是退货状态的详情
                            delivered.push(data[index])
                        } else if (data[index].isDeliver == false && (data[index].returnState === 0 || data[index].returnState === 3)) {
                            //所有没有发货的详情Id，不在其他修改，用于后面成功后对比
                            allRowKeys.push(data[index])
                            //没有发货且待要发货的详情及各种数据
                            willDeliver.push(data[index])
                            //这一行代码是为了默认全选的。
                            keys.push(data[index].id);
                            //这里是设置发货备注的,只有在没有发货的详情才会加进去备注中。
                            let count = data[index].buyCount - data[index].returnCount;
                            orderDetail += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;
                            if (index + 1 === data.length) {
                                orderDetail += ' 。 ';
                            } else {
                                orderDetail += ' ， ';
                            }
                            //设置要发货详情id
                            selectDetailId += data[index].id + '/';
                            //设置所有未发货的详情Id
                            allDetaileId += data[index].id + '/';
                            //设置发货成功的备注
                            deliverRemark += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;

                        }
                    }


                }
                this.setState({
                    willDeliver,
                    delivered,
                    selectedRowKeys: keys,
                    orderDetail: orderDetail,
                    selectDetailId,
                    allDetaileId,
                    deliverRemark,
                    allRowKeys,
                })
            }
        });

    }

    /**
     * 再发货一次
     */
    deliverAgina = () => {
        this.setState({
            step: '2'
        })
    }




    /**
     * 根据传过来的i设置选择的快递公司或者发件人相关状态。
     */
    setDefultId = (item, i) => {
        if (i === 1) {
            this.setState({
                defaultCompanyId: item.id,
                defaultCompany: item.id + '/' + item.companyName + '/' + item.companyCode,
                defaultCompanyInfo: item,
            })
        } else if (i === 2) {
            this.setState({
                defaultSendId: item.id,
                defaultSend: item.senderName + '/' + item.senderMobile + '/'
                    + item.senderProvince + '/' + item.senderCity + '/' + item.senderExpArea + '/'
                    + item.senderPostCode + '/' + item.senderAddress,
                defaultSendInfo: item,
            })
        }
    }

    /**
     * 打勾要选择的发货详情时触发。
     */
    setDetaileData = (count, data) => {
        const { form } = this.props;
        let rowKeys = [];
        let orderDetail = '';
        let selectDetailId = '';
        let deliverRemark = '';
        //设置买家留言
        if (this.state.orderMessages !== undefined) {
            orderDetail += '买家留言:' + this.state.orderMessages + ' 。';
        }
        orderDetail += '卖家备注 : ';
        for (let index = 0; index < data.length; index++) {
            //改变发货备注
            let count = data[index].buyCount - data[index].returnCount;
            orderDetail += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;
            if (index + 1 === data.length) {
                orderDetail += ' 。 ';
            } else {
                orderDetail += ' ， ';
            }
            //选择要发货详情id
            selectDetailId += data[index].id + '/';
            //改变选中的项
            rowKeys.push(data[index].id);
            //设置发货成功的备注
            deliverRemark += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;

        }
        this.setState({
            selectedRowKeys: rowKeys,
            orderDetail: orderDetail,
            selectDetailId,
            deliverRemark,
        })
        form.setFieldsValue({ orderTitle: orderDetail });
    }

    /**
     * 如果用户选择的快递公司没有密码证明是要订阅轨迹,下面的else必须需要，否则将存在感觉不存在的logisticCode被校验
     * 导致无法提交。
     */
    showlogisticCode = () => {
        const { form } = this.props;
        if (this.state.defaultCompanyInfo.companyPwd ===undefined) {
            return (
                <FormItem label="物流单号" >
                    {form.getFieldDecorator('logisticCode', {
                        rules: [
                            {
                                required: true,
                                pattern: /^[0-9]*$/,
                                message: '请输入全部为数字的物流单号',
                            },
                        ],
                    })(<Input placeholder="请输入物流单号" />)}
                </FormItem>
            )
        }else{
            return (
                <FormItem  >
                    {form.getFieldDecorator('logisticCode', {
                        rules: [
                            {
                                required: false,
                                pattern: /^[0-9]*$/,
                                message: '请输入全部为数字的物流单号',
                            },
                        ],
                    })(<Input placeholder="请输入物流单号" type="hidden"  />)}
                </FormItem>
            )
        }
    }

    /**
     * 修改发货备注
     */
    textChange = (value) => {
        const { form } = this.props;
        this.setState({
            orderDetail: value.target.value,
        })
        form.setFieldsValue({ orderTitle: value.target.value });
    }
    /**
     * 步骤1
     */
    step1 = () => {
        const { form } = this.props;
        const data = this.state.kdicompany;
        const data2 = this.state.sendData;
        return (
            <Fragment>
                <Form layout="inline">
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col md={9} sm={24} >
                            <p>请选择快递公司</p>
                            <div className={styles.ordSendForm}>
                                <InfiniteScroll
                                    loadMore={this.handleInfiniteOnLoad}
                                    initialLoad={false}
                                    pageStart={0}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={<a href="https://ant.design">{item.companyName}</a>}
                                                    description={'支付方式 : ' + item.payType}
                                                />
                                                {this.state.defaultCompanyId === item.id ? (
                                                    <a style={{ float: 'right', marginTop: -15, }} >已选择</a>
                                                ) : (
                                                        <Button size="small" onClick={() => this.setDefultId(item, 1)} >
                                                            选择
                                                    </Button>
                                                    )}
                                            </List.Item>
                                        )}
                                    />
                                </InfiniteScroll>
                            </div>
                        </Col>
                        <Col md={15} sm={24} >
                            <p>请选择发件人</p>
                            <div className={styles.ordSendForm}>
                                <InfiniteScroll
                                    loadMore={this.handleInfiniteOnLoad}
                                    initialLoad={false}
                                    pageStart={0}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data2}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={<a href="https://ant.design">{item.senderName + '·' + item.senderMobile}</a>}
                                                    description={item.senderaddr}
                                                />
                                                {this.state.defaultSendId === item.id ? (
                                                    <a style={{ float: 'right', marginTop: -15, }} >已选择</a>
                                                ) : (
                                                        <Button size="small" onClick={() => this.setDefultId(item, 2)} >
                                                            选择
                                                    </Button>
                                                    )}
                                            </List.Item>
                                        )}
                                    />
                                </InfiniteScroll>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        )
    }
    /**
     * 步骤2
     */
    step2 = () => {
        const { form } = this.props;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setDetaileData(selectedRowKeys, selectedRows);
            },
            selectedRowKeys: this.state.selectedRowKeys,
        };
        //这个是已经发货的规则只是为了不能被选中，基本没有作用
        const rowSelection2 = {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            getCheckboxProps: record => ({
                disabled: record.id !== 'Disabled', // 这里是随便定义的字符串，是为了id永远不等于Disabled字符串，这样就不能选择已经发货的。
                name: record.id,
            }),
        };

        const detailData = this.state.willDeliver;
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
        return (

            <Fragment>
                <p style={{ marginTop: -20 }} >买家收货信息: {this.state.receiverInfo.receiverProvince + this.state.receiverInfo.receiverCity + this.state.receiverInfo.receiverExpArea + this.state.receiverInfo.receiverAddress + '  ' + this.state.receiverInfo.receiverName + '·' + this.state.receiverInfo.receiverMobile}</p>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderCode')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderState')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderDetail', {
                    rules: [
                        {
                            required: true,
                            message: '订单备注',
                        },
                    ],
                    initialValue: this.state.orderDetail,

                })(<Input type="hidden" />)}
                {form.getFieldDecorator('senderInfo', {
                    rules: [
                        {
                            required: true,
                            message: '发件人',
                        },
                    ],
                    initialValue: this.state.defaultSend,

                })(<Input type="hidden" />)}
                {form.getFieldDecorator('shipperInfo', {
                    rules: [
                        {
                            required: true,
                            message: '快递公司',
                        },
                    ],
                    initialValue: this.state.defaultCompany,

                })(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverName')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverProvince')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderTitle')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverCity')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverExpArea')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverAddress')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverMobile')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverTel')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverPostCode')(<Input type="hidden" />)}
                {form.getFieldDecorator('senderInfo')(<Input type="hidden" />)}
                {form.getFieldDecorator('shipperInfo')(<Input type="hidden" />)}
                {form.getFieldDecorator('selectDetailId', { initialValue: this.state.selectDetailId, })(<Input type="hidden" />)}
                {form.getFieldDecorator('allDetaileId', { initialValue: this.state.allDetaileId, })(<Input type="hidden" />)}
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
                        <textarea onChange={(value) => this.textChange(value)} style={{ width: '100%', }} rows="6" value={this.state.orderDetail} >
                        </textarea>
                        {this.showlogisticCode()}
                    </Col>
                </Row>
            </Fragment>
        )
    }

    /**
     * 步骤3
     */
    step3 = () => {
        return (
            <Fragment>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
                    <Col md={24} sm={24} style={{ textAlign: 'center' }}  >
                        <Icon type="check-circle" style={{ color: '#52c41a', fontSize: 60, }} />
                        <p style={{ fontSize: 20 }} >发货成功</p>
                    </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
                    <Col md={16} sm={24} push={4} style={{ background: '#fafafa' }} >
                        <p><span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >买家地址 :</span>{this.state.receiverInfo.receiverProvince + this.state.receiverInfo.receiverCity + this.state.receiverInfo.receiverExpArea + this.state.receiverInfo.receiverAddress + '  ' + this.state.receiverInfo.receiverName + '·' + this.state.receiverInfo.receiverMobile}</p>
                        <p><span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >买家留言 :</span>{this.state.orderMessages}</p>
                        <p><span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >发货备注 :</span>{this.state.deliverRemark}</p>
                        <p><span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >发货地址 :</span>{this.state.defaultSendInfo.senderProvince + this.state.defaultSendInfo.senderCity + this.state.defaultSendInfo.senderExpArea + this.state.defaultSendInfo.senderAddress + '  ' + this.state.defaultSendInfo.senderName + '·' + this.state.defaultSendInfo.senderMobile}</p>
                        <p><span style={{ paddingRight: 8, color: 'rgba(0, 0, 0, 0.85)' }} >快递公司 :</span>{this.state.defaultCompanyInfo.companyName}</p>
                    </Col>
                </Row>
                {/* <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
                    <Col md={24} sm={24} style={{ textAlign: 'center' }}  >
                        <p style={{ color: '#1890ff' }} >您还有{this.state.allRowKeys.length + ':' + this.state.selectedRowKeys.length}个详情没有发货，您是想?</p>
                        <Button type="primary" htmlType="submit" onClick={() => this.deliverAgina()} >
                            再发一次
                    </Button>
                        <Button style={{ marginLeft: 5 }} type="primary" htmlType="submit">
                            拆分订单
                    </Button>
                    </Col>
                </Row> */}
            </Fragment>

        )
    }


    render() {
        const step1 = this.step1();
        const step2 = this.step2();
        const step3 = this.step3();
        if (this.props.step === '1') {
            return (step1)
        }
        if (this.props.step === '2') {
            return (step2);
        }
        if (this.props.step === '3') {
            return (step3);
        }
    }
}
