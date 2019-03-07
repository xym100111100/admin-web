import React, { Fragment, PureComponent } from 'react';
import { Form, Button, Tooltip, List, Table, Input, message, Row, Col, Radio, Collapse } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './SupOrder.less';
import { connect } from 'dva';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
// 添加与编辑的表单
@connect(({ kdisender, kdicompany, ordorder, user, loading }) => ({
    kdisender, user, ordorder, kdicompany,
    loading: loading.models.kdisender || loading.models.user || loading.models.ordorder || loading.models.kdicompany
}))
@EditForm
export default class SupSendForm extends PureComponent {

    state = {

        PackageData:[],

        receiverInfo: '', //收件人信息
        logisticCodeArr: [''],//物流id集合，应和要发的包裹数量一致

        allRowKeys: [],//所有被选中的key用于页面显示
        selectedRowKeys: [], //被选中的key用于页面显示
        willDeliver: [], //将要发货的详情数据用于展示
        delivered: [], //已经发货的详情数据用于展示
        selectDetaile: [],//选中的详情，用于后台修改
        allDetaile: [],//所有未发货的详情，用于后台与选中的对比来觉得是否改订单状态
        step: '2',
        loading: false,
        hasMore: true,
        split: false,

        orderDetail: '详情备注',//包括订单留言
        orderMessages: '', //订单留言

        allmergeselectedRowKeys: [], //所有合并时候被选中的key用于页面显示
        mergeselectedRowKeys: [], //合并时候被选中的key用于页面显示
        mergeMsg: '拆分订单',
        merge: true,
        mergeSelectDetaile: [],//用于相同规格商品合并时发货
        allMergeSelectDetaile: [],//用于相同规格商品合并时候的展示
        mergeOrderDetail: '详情备注',//用于在相同规格合并时候发货详情展示和提交

        kdicompany: [],//快递公司数据集合
        selectCompany: [],//选择的快递公司，用于提交

        sendData: [],//发件人数据集合
        selectSend: [],//选择的发件人,用于提交

    }

    componentDidMount() {
        this.initDetailData();
    }

    /**
     * 发货
     * 第一种发货方式（默认）：
     * merge=true split=false
     * 需要上线id，上线规格id，将该订单下上线id和规格id等于传过去的发一个包裹。
     * 
     * 第二种发货方式
     * merge=true split=true
     * 需要上线id，上线规格id，有多少个详情传过去就发多少个包裹。
     * 
     * 第三种发货方式
     * merge=false  split=false
     * 需要详情，将选择的详情发一个包裹
     * 
     * 第四种发货方式
     * merge=false split=true
     * 需要详情，将选择的详情分别发一个包裹。
     */
    deliver = (fieldsValue) => {
        const { hiddenForm } = this.props;
        if (this.state.merge === true) {
            if (this.state.mergeSelectDetaile.length === 0) {
                message.error('未选择任何详情，不能提交');
                return;
            }
            fieldsValue.selectDetaile = this.state.mergeSelectDetaile
            fieldsValue.allDetaile = this.state.allMergeSelectDetaile
            fieldsValue.orderDetail = this.state.mergeOrderDetail;
        }
        if (this.state.merge === false) {
            fieldsValue.selectDetaile = this.state.selectDetaile;
            fieldsValue.allDetaile = this.state.allDetaile
            fieldsValue.orderDetail = this.state.orderDetail;
        }
        //将板块类型修改回来byte类型，否则后台会报错。
        for (let index = 0; index < fieldsValue.selectDetaile.length; index++) {
            fieldsValue.selectDetaile[index].subjectType === '普通' ? fieldsValue.selectDetaile[index].subjectType = 0 : fieldsValue.selectDetaile[index].subjectType = 1;

        }
        for (let index = 0; index < fieldsValue.allDetaile.length; index++) {
            fieldsValue.allDetaile[index].subjectType === '普通' ? fieldsValue.allDetaile[index].subjectType = 0 : fieldsValue.allDetaile[index].subjectType = 1;

        }
        let printWindow
        this.props.dispatch({
            type: `suporder/deliver`,
            payload: fieldsValue,
            callback: data => {
              //  如何选择完详情就关闭窗口，否则刷新窗口。
                if (fieldsValue.selectDetaile.length === fieldsValue.allDetaile.length) {
                    hiddenForm();
                } else {
                    this.getOrderDetaile(this.props.record);
                    this.getPackage(this.props.record)
               }
                const printPage = data.printPage;
                printWindow = window.open('', '_blank');
                printWindow.document.body.innerHTML = printPage;
                printWindow.print();
                printWindow.close();
            }
        })

    }

    /**
     * 订阅
     * 第一种订阅方式（默认）：
     * merge=true split=false
     * 需要上线id，上线规格id，将该订单下上线id和规格id等于传过去的发一个包裹。
     * 
     * 第二种订阅方式
     * merge=true split=true
     * 需要上线id，上线规格id，有多少个详情传过去就发多少个包裹。
     * 
     * 第三种订阅方式
     * merge=false  split=false
     * 需要详情，将选择的详情发一个包裹
     * 
     * 第四种订阅方式
     * merge=false split=true
     * 需要详情，将选择的详情分别发一个包裹。
     */
    deliverAndGetTrace = (fieldsValue) => {
        const { hiddenForm } = this.props;
        //设置物流单号
        if (this.state.logisticCodeArr[0] === '') {
            message.error('未输入任何单号或与上次订单号重复，不能提交');
            return;
        } else {
            fieldsValue.logisticCodeArr = this.state.logisticCodeArr;
        }

        if (this.state.merge === true) {
            if (this.state.mergeSelectDetaile.length === 0) {
                message.error('未选择任何详情，不能提交');
                return;
            }
            fieldsValue.selectDetaile = this.state.mergeSelectDetaile
            fieldsValue.allDetaile = this.state.allMergeSelectDetaile
            fieldsValue.orderDetail = this.state.mergeOrderDetail;
        }
        if (this.state.merge === false) {
            fieldsValue.selectDetaile = this.state.selectDetaile;
            fieldsValue.allDetaile = this.state.allDetaile
            fieldsValue.orderDetail = this.state.orderDetail;
        }
        //将板块类型修改回来byte类型，否则后台会报错。
        for (let index = 0; index < fieldsValue.selectDetaile.length; index++) {
            fieldsValue.selectDetaile[index].subjectType === '普通' ? fieldsValue.selectDetaile[index].subjectType = 0 : fieldsValue.selectDetaile[index].subjectType = 1;

        }
        for (let index = 0; index < fieldsValue.allDetaile.length; index++) {
            fieldsValue.allDetaile[index].subjectType === '普通' ? fieldsValue.allDetaile[index].subjectType = 0 : fieldsValue.allDetaile[index].subjectType = 1;

        }
        //判断单号是否和要发的包裹对应上
        if (this.state.split) {
            if (fieldsValue.logisticCodeArr.length !== fieldsValue.selectDetaile.length) {
                message.error('单号的数量和包裹对应不上,单号的数量是' + fieldsValue.logisticCodeArr.length);
                return;
            }
        } else {
            if (fieldsValue.logisticCodeArr.length > 1) {
                message.error('单号的数量和包裹对应不上,单号的数量是' + fieldsValue.logisticCodeArr.length);
                return;
            }
        }
        this.props.dispatch({
            type: `suporder/getTraceAndDeliver`,
            payload: fieldsValue,
            callback: data => {
              //  如何选择完详情就关闭窗口，否则刷新窗口,且将物流编号设置为空
                if (fieldsValue.selectDetaile.length === fieldsValue.allDetaile.length) {
                    hiddenForm();
                } else {
                    this.getOrderDetaile(this.props.record);
                    this.getPackage(this.props.record)
                    this.setState({
                        logisticCodeArr: [''],
                    })
               }
            }
        })


    }

    /**
     * 根据快递公司帐号密码显示发货备注
     */
    showRemark = (orderDetail) => {
        if (this.props.record.onlineOrgId === this.props.record.deliverOrgId) {
            if (this.state.selectCompany.companyPwd !== undefined && this.state.selectCompany.companyPwd !== null && this.state.selectCompany.companyPwd !== '') {
                return (
                    <div>
                        <p style={{ marginBottom: -1 }} >发货备注:</p>
                        <textarea onChange={(value) => this.textChange(value)} style={{ width: '100%', }} rows="6" value={orderDetail} >
                        </textarea>
                    </div>
                )
            }
        } else {
            if (this.state.selectCompany.companyPwd !== undefined && this.state.selectCompany.companyPwd !== null && this.state.selectCompany.companyPwd !== '') {
                return (
                    <div>
                        <p style={{ marginBottom: -1 }} >发货备注:</p>
                        <textarea onChange={(value) => this.textChange(value)} style={{ width: '100%', }} rows="6" value={orderDetail} >
                        </textarea>
                    </div>
                )
            }
        }

    }

    /**
     * 发货
     */
    willDeliver = () => {
        //根据是否有logisticCode来选择是发货还是订阅物流轨迹
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const { user } = this.props;
            fieldsValue.orgId = user.currentUser.orgId;
            fieldsValue.sendOpId = user.currentUser.userId;
            fieldsValue.merge = this.state.merge;
            fieldsValue.split = this.state.split;
            fieldsValue.first = this.props.first;
            //判断是否选择了发件人和整理发件人
            if (this.state.selectSend === undefined) {
                message.error('未选择发件人，不能提交');
                return;
            } else {
                fieldsValue.senderName = this.state.selectSend.senderName;
                fieldsValue.senderMobile = this.state.selectSend.senderMobile;
                fieldsValue.senderProvince = this.state.selectSend.senderProvince;
                fieldsValue.senderCity = this.state.selectSend.senderCity;
                fieldsValue.senderExpArea = this.state.selectSend.senderExpArea;
                fieldsValue.senderPostCode = this.state.selectSend.senderPostCode;
                fieldsValue.senderAddress = this.state.selectSend.senderAddress;
            }
            //判断是否选择了快递公司和整理快递公司
            if (this.state.selectCompany === undefined) {
                message.error('未选择快递公司，不能提交');
                return;
            } else {
                fieldsValue.shipperId = this.state.selectCompany.id;
                fieldsValue.shipperName = this.state.selectCompany.companyName;
                fieldsValue.shipperCode = this.state.selectCompany.companyCode;
            }
            //根据组织id和快递公司密码选择方法
            if (this.props.record.onlineOrgId === this.props.record.deliverOrgId) {
                if (this.state.selectCompany.companyPwd === undefined || this.state.selectCompany.companyPwd === null || this.state.selectCompany.companyPwd === '') {
                    this.deliverAndGetTrace(fieldsValue);
                } else {
                    this.deliver(fieldsValue);
                }
            } else {
                if (this.state.selectCompany.companyPwd === undefined || this.state.selectCompany.companyPwd === null || this.state.selectCompany.companyPwd === '') {
                    this.deliverAndGetTrace(fieldsValue);
                } else {
                    this.deliver(fieldsValue);
                }
            }


        })


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
        //获取包裹
        this.getPackage(record);
    }

    /**
     * 获取包裹
     */
    getPackage=(record)=>{
        this.props.dispatch({
            type: `suporder/listOrderdetaildeliver`,
            payload: { orderId: record.id },
            callback: data => {
                this.setState({
                    PackageData:data
                })
            }
        })
    }   

    /**
     * 获取订单详情
     */
    getOrderDetaile = (record) => {
        this.props.dispatch({
            type: `suporder/detailList`,
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
                            allRowKeys.push(Object.assign({}, data[index]));
                            //所有不是退货的详情
                            willDeliver.push(Object.assign({}, data[index]));
                            //这一行代码是为了默认全选的。
                            keys.push(data[index].id);
                            //这里是设置发货备注的,只有在没有发货的详情才会加进去备注中。
                            let count = data[index].buyCount - data[index].returnCount;
                            orderDetail += data[index].onlineTitle + '·' + data[index].specName + 'x' + count;
                            if (index + 1 === data.length) {
                                orderDetail += ' 。 ';
                            } else {
                                orderDetail += ' ， ';
                            }
                            //设置要发货详情
                            selectDetaile.push(Object.assign({}, data[index]));
                            //设置所有未发货的详情Id
                            allDetaile.push(Object.assign({}, data[index]));
                             //已经发货且不是退货状态的详情
                            delivered.push(Object.assign({}, data[index]))
                        }

                    } else if (this.props.first === true) {
                        if (data[index].isDelivered == true && (data[index].returnState === 0 || data[index].returnState === 3)) {
                            //已经发货且不是退货状态的详情
                            delivered.push(Object.assign({}, data[index]))
                        } else if (data[index].isDelivered == false && (data[index].returnState === 0 || data[index].returnState === 3)) {
                            //所有没有发货的详情Id，不在其他修改，用于后面成功后对比
                            allRowKeys.push(Object.assign({}, data[index]))
                            //没有发货且待要发货的详情及各种数据
                            willDeliver.push(Object.assign({}, data[index]))
                            //这一行代码是为了默认全选的。
                            keys.push(data[index].id);
                            //这里是设置发货备注的,只有在没有发货的详情才会加进去备注中。
                            let count = data[index].buyCount - data[index].returnCount;
                            orderDetail += data[index].onlineTitle + '·' + data[index].specName + 'x' + count;
                            if (index + 1 === data.length) {
                                orderDetail += ' 。 ';
                            } else {
                                orderDetail += ' ， ';
                            }
                            //设置要发货详情
                            selectDetaile.push(Object.assign({}, data[index]));
                            //设置所有未发货的详情Id
                            allDetaile.push(Object.assign({}, data[index]));

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
                let mergeSelectDetaile = [];
                let allMergeSelectDetaile = [];
                for (let i = 0; i < allDetaile.length; i++) {
                    let is = false;
                    for (let j = 0; j < mergeSelectDetaile.length; j++) {
                        if (allDetaile[i].onlineId === mergeSelectDetaile[j].onlineId && allDetaile[i].onlineSpecId === mergeSelectDetaile[j].onlineSpecId) {
                            mergeSelectDetaile[j].buyCount += 1;
                            allMergeSelectDetaile[j].buyCount += 1;
                            is = true
                        }
                    }
                    if (!is) {
                        //使用Object.assign({},allDetaile[i])复制一个对象，这样上面+=1的时候就不会改变原来对象的值
                        mergeSelectDetaile.push(Object.assign({}, allDetaile[i]));
                        allMergeSelectDetaile.push(Object.assign({}, allDetaile[i]));
                    }
                }
                //合并时候的发货备注
                let mergeOrderDetail = '';
                for (let index = 0; index < mergeSelectDetaile.length; index++) {
                    mergeOrderDetail += mergeSelectDetaile[index].onlineTitle + '·' + mergeSelectDetaile[index].specName + 'x' + mergeSelectDetaile[index].buyCount;
                    if (index + 1 === mergeSelectDetaile.length) {
                        mergeOrderDetail += ' 。 ';
                    } else {
                        mergeOrderDetail += ' ， ';
                    }
                }
                //设置合并后的详情和发货备注
                this.setState({
                    mergeSelectDetaile,
                    mergeOrderDetail,
                    allMergeSelectDetaile,
                    mergeselectedRowKeys: keys,
                    allmergeselectedRowKeys: allRowKeys
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
                step: '2'
            })
        } else if (i === 2) {
            this.setState({
                selectSend: item,
                step: '2'
            })
        }
    }

    /**
     * 打勾要选择的发货详情时触发。
     */
    setDetaileData = (count, data) => {
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
            orderDetail += data[index].onlineTitle + '·' + data[index].specName + 'x' + count;
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
        if (this.state.merge === true) {
            this.setState({
                mergeselectedRowKeys: rowKeys,
                mergeOrderDetail: orderDetail,
                mergeSelectDetaile: selectDetaile
            })
        } else {
            this.setState({
                selectedRowKeys: rowKeys,
                orderDetail: orderDetail,
                selectDetaile,
            })
        }

    }

    /**
     * 显示包裹
     */
    showPackage = (array) => {
        //先将相同物流号码的整理成同一个对象
        let data = [];
        let tempData = [];

        for (let i = 0; i < array.length; i++) {
            let isIn = false;
            for (let j = 0; j < tempData.length; j++) {
                if (array[i].logisticCode === tempData[j].logisticCode) {
                    tempData[j].onlineTitle += ',' + array[i].onlineTitle + 'x1';
                    isIn = true
                }
            }
            if (!isIn) {
                let obj = Object.assign({}, array[i])
                obj.onlineTitle = obj.onlineTitle + 'x1'
                tempData.push(obj)

            }
        }

        data = tempData;

        if (data !== undefined && data !== '' && data.length > 0) {
            const listItems = data.map((items, i) => {
                let count = i + 1;
                let header = '包裹' + count + '物流单号 ' + items.logisticCode
                return (
                    <Panel header={header} key={items.id}>
                        <p>{items.onlineTitle}</p>
                    </Panel>
                )
            });
            return listItems;
        }
    }


    /**
     * 如果用户选择的快递公司没有密码证明是要订阅轨迹,下面的else必须需要，否则将存在感觉不存在的logisticCode被校验
     * 导致无法提交。
     */
    showlogisticCode = () => {

        if (this.props.record.onlineOrgId === this.props.record.deliverOrgId) {
            if (this.state.selectCompany.companyPwd === undefined || this.state.selectCompany.companyPwd === null || this.state.selectCompany.companyPwd === '') {
                return (
                    <textarea placeholder="请输入物流单号，多个单号请换行区分，且单号的数量要与要发的包裹相等。" onChange={(value) => this.logisticCodeChange(value)} style={{ width: '100%', }} rows="6"  >

                    </textarea>
                )
            }
        } else {
            if (this.state.selectCompany.companyPwd === undefined || this.state.selectCompany.companyPwd === null || this.state.selectCompany.companyPwd === '') {
                return (
                    <textarea placeholder="请输入物流单号，多个单号请换行区分。" onChange={(value) => this.logisticCodeChange(value)} style={{ width: '100%', }} rows="6"  >
                    </textarea>
                )
            }
        }

    }


    /**
     * 显示是否能将一个订单拆成多个包裹按钮
     */
    showSplit = () => {
        let count = 0;
        if (this.state.merge) {
            count = this.state.mergeSelectDetaile.length
        } else {
            count = this.state.selectDetaile.length
        }
        return (
            <FormItem >
                <RadioGroup onChange={this.setSplit} value={this.state.split} >
                    <Tooltip placement="topLeft" title="该选项是所有选择的商品发一个包裹">
                        <Radio value={false}>选择的商品发一个包裹</Radio>
                    </Tooltip>
                    <Tooltip placement="topLeft" title="该选项是选择多少个商品就发多少个包裹,且发货备注将是选中商品的名称规格等,上面的发货备注无效!">
                        <Radio value={true}>选择的商品发{count}个包裹</Radio>
                    </Tooltip>
                </RadioGroup>
            </FormItem>
        )

    }

    /**
     * 修改发货备注
     */
    textChange = (value) => {
        this.setState({
            orderDetail: value.target.value,
            mergeOrderDetail: value.target.value,
        })

    }

    /**
     * 格式化物流单号
     */
    logisticCodeChange = (logisticCodeArr) => {
        this.setState({
            logisticCodeArr: logisticCodeArr.target.value.split(/[\s\n]/)
        })
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
    setStep = () => {
        if (this.state.step === '1') {
            this.setState({
                step: '2'
            })
        } else {
            this.setState({
                step: '1'
            })
        }
    }
    /**
     * 设置合并
     */
    setMerge = () => {
        if (this.state.merge === true) {
            this.setState({
                merge: false,
                mergeMsg: '合并订单'
            })
        } else {
            this.setState({
                merge: true,
                mergeMsg: '拆分订单'
            })
        }
    }

    /**
     * 设置拆分包裹
     */
    setSplit = () => {
        if (this.state.split === true) {
            this.setState({
                split: false,
            })
        } else {
            this.setState({
                split: true,
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
                    {form.getFieldDecorator('id')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderCode')(<Input type="hidden" />)}
                    {form.getFieldDecorator('orderState')(<Input type="hidden" />)}
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
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                        <Col md={9} sm={24} >
                            <p>请选择快递公司</p>
                            <div className={styles.ordSendForm} style={{ height: 487 }} >
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
        //判断是否要合并
        let detailData = []
        let orderDetail = '';
        let selectKeys = [];
        if (this.state.merge === true) {
            detailData = this.state.allMergeSelectDetaile;
            orderDetail = this.state.mergeOrderDetail;
            selectKeys = this.state.mergeselectedRowKeys;
        } else {
            detailData = this.state.willDeliver;
            orderDetail = this.state.orderDetail;
            selectKeys = this.state.selectedRowKeys
        }
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setDetaileData(selectedRowKeys, selectedRows);
            },
            selectedRowKeys: selectKeys,//默认选择的
        };



        const columns = [
            {
                title: '商品',
                dataIndex: 'onlineTitle',


            },
            {
                title: '规格',
                dataIndex: 'specName',
                width: 150,
            },
            {
                title: '数量',
                dataIndex: 'buyCount',
                width: 100,
            },
        ]



        return (

            <Fragment>
                <p>快递公司: {this.showCompany()}发件人: {this.showSend()}</p>
                <p style={{}} >买家收货信息: {this.state.receiverInfo.receiverProvince + this.state.receiverInfo.receiverCity + this.state.receiverInfo.receiverExpArea + this.state.receiverInfo.receiverAddress + '  ' + this.state.receiverInfo.receiverName + '·' + this.state.receiverInfo.receiverMobile}</p>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderCode')(<Input type="hidden" />)}
                {form.getFieldDecorator('orderState')(<Input type="hidden" />)}
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
                                    <p style={{ marginBottom: -1 }} >未发货商品:</p>
                                </Col>
                                <Col md={8} sm={24} style={{ paddingBottom: 5 }} >
                                    <Tooltip placement="topLeft" title="如果数量大于1,拆分后可勾选任意个商品发一个包裹或者同时发多个包裹,默认勾选全部且发一个包裹。">
                                        <Button onClick={this.setMerge} size="small" type="primary"  >
                                            {this.state.mergeMsg}
                                        </Button>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={16} sm={24}  >
                        <div style={{ height: 420, overflow: scroll }} >
                            <Table
                                scroll={{ y: 240 }}
                                rowKey="id"
                                dataSource={detailData}
                                columns={columns}
                                pagination={false}
                                rowSelection={rowSelection}
                            />
                            <Row gutter={{ md: 6, lg: 24, xl: 48 }}   >
                                <Col md={24} sm={24} style={{ marginTop: 10 }}  >
                                    <Collapse >
                                        {this.showPackage(this.state.PackageData)}
                                    </Collapse>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={8} sm={24}  >
                        {this.showRemark(orderDetail)}
                        {this.showlogisticCode(orderDetail)}
                        {this.showSplit()}
                        <Button size="small" type="primary" onClick={() => this.willDeliver()} >
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
