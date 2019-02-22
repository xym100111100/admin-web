import React, { Fragment, PureComponent } from 'react';
import { Form, Button, List, Table, Input, Row, Col, Radio } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './OrdOrder.less';
import { connect } from 'dva';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
        orderMessages: '', //订单留言
        willDeliver: [], //将要发货的详情数据用于展示
        delivered: [], //已经发货的详情数据用于展示
        selectDetaile: [],//选中的详情，用于后台修改
        allDetaile: [],//所有未发货的详情，用于后台与选中的对比来觉得是否改订单状态
        step: '2',
        loading: false,
        hasMore: true,

        merge:true,
        mergeAllDetaile:[],//用于相同规格商品合并时候的展示

        kdicompany: [],//快递公司数据集合
        selectCompany: [],//选择的快递公司，用于提交

        sendData: [],//发件人数据集合
        selectSend: [],//选择的发件人,用于提交

    }

    componentDidMount() {
        this.initDetailData();
    }

    /**
     * 提交前事件
     */
    beforeSave = () => {
        const { form } = this.props;
        form.getFieldDecorator('selectDetaile');
        form.getFieldDecorator('allDetaile');
        form.getFieldDecorator('selectCompany');
        form.getFieldDecorator('selectSend');
        form.setFieldsValue({
            selectDetaile: this.state.selectDetaile,
            allDetaile: this.state.allDetaile,
            selectCompany: this.state.selectCompany,
            selectSend: this.state.selectSend,
        });
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
            receiverInfo: record,
            orderMessages: record.orderMessages,
        })
        //获取发件人
        this.props.dispatch({
            type: `kdisender/list`,
            payload: { orgId: orgId },
            callback: data => {
                for (let i = 0; i < data.length; i++) {
                    //设置默认发件人id和默认选中发件人以便后面修改
                    if (data[i].isDefault) {
                        this.setState({
                            selectSend: data[i],
                        })
                    }
                }
                this.setState({
                    sendData: data,
                })
            }
        });
        //获取快递公司
        this.props.dispatch({
            type: `kdicompany/list`,
            payload: { orgId: orgId },
            callback: data => {
                for (let i = 0; i < data.length; i++) {
                    //设置默认快递公司id以便后面修改
                    if (data[i].isDefault) {
                        this.setState({
                            selectCompany: data[i],
                        })
                    }
                }
                this.setState({
                    kdicompany: data,
                })
            }
        });
        //获取订单详情
        this.getOrderDetaile(record);
    }

    /**
     * 获取订单详情
     */
    getOrderDetaile = (record) => {
        this.props.dispatch({
            type: `ordorder/detailList`,
            payload: { orderId: record.id },
            callback: data => {
                let orderDetail = '';
                let keys = [];
                let delivered = [];
                let allDetaile = [];
                let allRowKeys = [];
                let willDeliver = [];
                let selectDetaile = [];

                //设置买家留言
                if (this.state.orderMessages !== undefined) {
                    orderDetail += '买家留言:' + this.state.orderMessages + ' 。';
                }
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
                            //设置要发货详情
                            selectDetaile.push(data[index]);
                            //设置所有未发货的详情Id
                            allDetaile.push(data[index]);
                        }

                    } else if (this.props.first === true) {
                        if (data[index].isDelivered == true && (data[index].returnState === 0 || data[index].returnState === 3)) {
                            //已经发货且不是退货状态的详情
                            delivered.push(data[index])
                        } else if (data[index].isDelivered == false && (data[index].returnState === 0 || data[index].returnState === 3)) {
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
                            //设置要发货详情
                            selectDetaile.push(data[index]);
                            //设置所有未发货的详情Id
                            allDetaile.push(data[index]);

                        }
                    }


                }
                this.setState({
                    willDeliver,
                    delivered,
                    selectedRowKeys: keys,
                    orderDetail: orderDetail,
                    selectDetaile,
                    allDetaile,
                    allRowKeys,
                })
                //根据上线id和上线规格id将相同的商品合并用于显示
                let mergeAllDetaile=[];
                for (let i = 0; i < allDetaile.length; i++) {
                    let is=false;
                  for (let j = 0; j < mergeAllDetaile.length; j++) {
                      if( allDetaile[i].onlineId === mergeAllDetaile[j].onlineId && allDetaile[i].onlineSpecId===mergeAllDetaile[j].onlineSpecId ){
                        mergeAllDetaile[j].buyCount +=1;
                        is=true
                      }
                  }
                  if(!is){
                    mergeAllDetaile.push(allDetaile[i]);
                  }
                }
                //设置合并后的详情
                this.setState({
                    mergeAllDetaile,
                })
            }
        });
    }


    /**
     * 根据传过来的i设置选择的快递公司或者发件人相关状态，且将步数修改为2
     */
    setDefultId = (item, i) => {
        if (i === 1) {
            this.setState({
                selectCompany: item,
                step:'2'
            })
        } else if (i === 2) {
            this.setState({
                selectSend: item,
                step:'2'
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
        let selectDetaile = [];
        //设置买家留言
        if (this.state.orderMessages !== undefined) {
            orderDetail += '买家留言:' + this.state.orderMessages + ' 。';
        }
        for (let index = 0; index < data.length; index++) {
            //改变发货备注
            let count = data[index].buyCount - data[index].returnCount;
            orderDetail += data[index].onlineTitle + '·' + data[index].specName + '·' + count + 'x' + data[index].buyPrice;
            if (index + 1 === data.length) {
                orderDetail += ' 。 ';
            } else {
                orderDetail += ' ， ';
            }
            //选择要发货详情
            selectDetaile.push(data[index]);
            //改变选中的项
            rowKeys.push(data[index].id);

        }
        this.setState({
            selectedRowKeys: rowKeys,
            orderDetail: orderDetail,
            selectDetaile,
        })
        form.setFieldsValue({ orderTitle: orderDetail });
    }

    /**
     * 如果用户选择的快递公司没有密码证明是要订阅轨迹,下面的else必须需要，否则将存在感觉不存在的logisticCode被校验
     * 导致无法提交。
     */
    showlogisticCode = () => {
        const { form } = this.props;
        if (this.props.record.onlineOrgId === this.props.record.deliverOrgId) {
            if (this.state.selectCompany.companyPwd === undefined || this.state.selectCompany.companyPwd === null || this.state.selectCompany.companyPwd === '') {
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
            } else {
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
                        })(<Input placeholder="请输入物流单号" type="hidden" />)}
                    </FormItem>
                )
            }
        } else {
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
        }

    }

    /**
     * 显示是否能将一个订单拆成多个包裹按钮
     */
    showSplit = () => {
        const { form } = this.props;
        if (this.state.selectCompany.companyPwd !== undefined && this.state.selectCompany.companyPwd !== null && this.state.selectCompany.companyPwd !== '') {
            return (
                <FormItem >
                    {form.getFieldDecorator('split', {
                        initialValue: true,
                    })(
                        <RadioGroup>
                            <Radio value={true}>选择的商品发一个包裹</Radio>
                            <Radio value={false}>选择的商品发{this.state.selectDetaile.length}个包裹</Radio>
                        </RadioGroup>
                    )}
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
     * 显示和提示用户去添加快递公司
     */
    showCompany = () => {
        if (this.state.selectCompany.companyName === undefined) {
            if (this.state.kdicompany.length === 0) {
                return (
                    <a href="#/kdi/kdi-cfg/kdi-company-cfg" style={{ fontSize: 16, paddingRight: 5, color: '#1890ff' }} >未有快递公司，前去添加？</a>
                )
            } else {
                return (
                    <a onClick={this.setStep} style={{ fontSize: 16, paddingRight: 5 }} >未选择任何快递公司</a>
                )
            }

        } else {
            return (
                <a onClick={this.setStep} style={{ fontSize: 16, paddingRight: 5 }} >{this.state.selectCompany.companyName}</a>
            )

        }
    }
    /**
     * 显示和提示用户去添加发件人
     */
    showSend = () => {
        if (this.state.selectSend.senderName === undefined) {
            if (this.state.sendData.length === 0) {
                return (
                    <a href="#/kdi/kdi-cfg/kdi-sender-cfg" style={{ fontSize: 16, paddingRight: 5, color: '#1890ff' }} >未有发件人，前去添加？</a>
                )
            } else {
                return (
                    <a onClick={this.setStep} style={{ fontSize: 16, paddingRight: 5 }} >未选择任何发件人</a>
                )
            }
        } else {
            return (
                <a onClick={this.setStep} style={{ fontSize: 16, paddingRight: 5 }} >{this.state.selectSend.senderName}</a>
            )

        }
    }
    /**
     * 设置窗口
     */
    setStep=()=>{
        if(this.state.step==='1'){
            this.setState({
                step:'2'
            })
        }else{
            this.setState({
                step:'1'
            })
        }
    }
    /**
     * 设置合并
     */
    setMerge=()=>{
        if(this.state.merge===true){
            this.setState({
                merge:false
            })
        }else{
            this.setState({
                merge:true
            })
        }
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

                                                />
                                                {this.state.selectCompany.id === item.id ? (
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
                                                    title={<a >{item.senderName + '·' + item.senderMobile}</a>}
                                                />
                                                {this.state.selectSend.id === item.id ? (
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
                <p>快递公司: {this.showCompany()}发件人: {this.showSend()}</p>
                <p style={{}} >买家收货信息: {this.state.receiverInfo.receiverProvince + this.state.receiverInfo.receiverCity + this.state.receiverInfo.receiverExpArea + this.state.receiverInfo.receiverAddress + '  ' + this.state.receiverInfo.receiverName + '·' + this.state.receiverInfo.receiverMobile}</p>
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
                {form.getFieldDecorator('receiverName')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverProvince')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderTitle')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverCity')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverExpArea')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverAddress')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverMobile')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverTel')(<Input type="hidden" />)}
                {form.getFieldDecorator('receiverPostCode')(<Input type="hidden" />)}
                {form.getFieldDecorator('senderPostCode', {
                    initialValue: '000000',
                })(<Input type="hidden" />)}
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
                    <Col md={17} sm={24}  >
                        <div  >
                            <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
                                <Col md={16} sm={24}  >
                                    <p style={{ marginBottom: -1 }} >请选择要发货的商品:</p>
                                </Col>
                                <Col md={8} sm={24} style={{ paddingBottom: 5 }} >
                                    <Button size="small" type="primary" onClick={() => this.setDefultId(item, 1)} >
                                        拆分订单发货
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={16} sm={24}  >
                        <div style={{ height: 450, overflow: scroll }} >
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
                        <p style={{ marginBottom: -1 }} >发货备注:</p>
                        <textarea onChange={(value) => this.textChange(value)} style={{ width: '100%', }} rows="6" value={this.state.orderDetail} >
                        </textarea>
                        {this.showlogisticCode()}
                        {this.showSplit()}
                        <Button size="small" type="primary" onClick={() => this.setDefultId(item, 1)} >
                            发货
                        </Button>
                    </Col>
                </Row>
            </Fragment>
        )
    }




    render() {
        const step1 = this.step1();
        const step2 = this.step2();
        if (this.state.step === '1') {
            return (step1)
        }
        if (this.state.step === '2') {
            return (step2);
        }
    }
}
