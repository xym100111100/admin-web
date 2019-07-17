import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Table, Upload, message, Icon, Row, Col } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiCompany.less';
import KdiBatchSendForm from './KdiBatchSendForm'
import getArea from 'components/Kdi/Area/index';//获取地址
import splitAddr from 'components/Kdi/Area/SplitAddr';
import KdiCopyForm from './KdiCopyForm'
import XLSX from 'xlsx';//引入JS读取Excel文件的插件
import downloadExcel from "./downloadFile/导入模板.xlsx"


@connect(({ kdieorder, kdicompany, kditemplate, companydic, user, login, loading, kdisender }) => ({
    kdicompany,
    kdieorder,
    companydic,
    kditemplate,
    user,
    kdisender,
    login,
    loading: loading.models.kdicompany || loading.models.kditemplate || loading.models.user || loading.models.companydic || loading.models.login || loading.models.kdieorder || loading.models.kdisender,
}))
export default class KdiBatchSubscribe extends SimpleMng {
    constructor() {
        super();
        this.moduleCode = 'kdieorder';
        this.state.selectedRowKeys = [];
        this.state.hasSelected = false;
        this.state.data = [];
        this.state.noOrder = [];
        this.state.allOrder = [];

        iframeHTML: '<div></div>'//用于打印
    }
    //初始化
    componentDidMount() {
        //console.log(JSON.parse(window.localStorage.getItem('templates')));
    }

    /**
     * 清空table
     */
    clearData = () => {
        window.localStorage.clear();
        this.setState({
            data: [],
            selectedRowKeys: [],
            hasSelected: false
        })

    }


    //显示批量打印选择快递和发件人的窗口
    showBatchSendForm = () => {
        this.showAddForm({
            editForm: 'kdiBatchSend',
            editFormTitle: '选择发货快递和发件人',
        })
    }

    onSelectChange = (selectedRowKeys, selectedRow) => {
        selectedRowKeys.receiver = selectedRow;
        //console.log('获取的值', selectedRow);
        let noOrder = [];
        for (let i = 0; i < this.state.allOrder.length; i++) {
            let temp = this.state.allOrder[i];
            let flag = true;
            for (let j = 0; j < selectedRow.length; j++) {
                if (temp.id === selectedRow[j].id) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                noOrder.push(temp);
            }
        }
        const hasSelected = selectedRowKeys.length > 0;//是否勾选订单
        this.setState({ selectedRowKeys, hasSelected, noOrder });
    }


    /**
     * 导入Excel获取的收件人信息
     */
    onChange = (obj) => {
        if (obj.fileList.length === 0) {
            return;
        }
        this.setState({
            data: []
        }, () => {
            window.localStorage.clear();
        })
        let receivingInformation = [];
        setTimeout(() => {
            if (obj.file.status !== 'uploading') {
                let f = obj.fileList[obj.fileList.length - 1].originFileObj;
                let read = new FileReader();

                read.onload = function (e) {
                    let data = e.target.result;
                    let wb = XLSX.read(data, {
                        type: 'binary' //以二进制的方式读取
                    });
                    let sheet0 = wb.Sheets[wb.SheetNames[0]];//sheet0代表excel表格中的第一页
                    let str = XLSX.utils.sheet_to_json(sheet0);//利用接口实现转换。
                    console.log("str", str);
                    let receivingInformation = [];

                    for (let i = 0; i < str.length; i++) {
                        receivingInformation.push({
                            id: i + 1,
                            trackingNumber: str[i].运单号,
                            receivePeople: str[i].收件人姓名,
                            receivePhone: str[i].收件电话,
                            receiveTitle: str[i].商品信息,
                            receiveProvince: str[i].收件省份,
                            receiveCity: str[i].收件城市,
                            receiveCounty: str[i].收件区县,
                            receiveAddress: str[i].收件人详细地址,
                        })
                    }
                    console.log("receivingInformation", receivingInformation);
                    window.localStorage.setItem("templates", JSON.stringify(receivingInformation))//存入localStorage 中
                }
                read.readAsBinaryString(f);
            }
            if (obj.file.status === 'done') {
                message.success(`${obj.file.name} 导入成功`);
            } else if (obj.file.status === 'error') {
                message.error(`${obj.file.name} 导入失败`);
            }
            setTimeout(() => {
                this.setState({
                    allOrder: receivingInformation,
                    data: JSON.parse(window.localStorage.getItem('templates'))
                })
            }, 500);
        }, 500)


    }

    /**
 * 批量下单
 */
    kdiMessage = (fields) => {
        const { user } = this.props;
        fields.orgId = user.currentUser.orgId;
        fields.sendOpId = user.currentUser.userId;
        fields.receiver = this.state.selectedRowKeys.receiver;
        console.log("fields",fields);
        //判断是否选择了发件人
        if (fields.selectSend.length === 0) {
            message.error('未选择发件人，不能提交');
            return;
        }
        //判断是否选择了快递公司
        if (fields.selectCompany.length === 0) {
            message.error('未选择快递公司，不能提交');
            return;
        }
        console.log("fields",fields);
        this.commit(fields);
    }

    //提交到后台
    commit = (fields) => {
        this.setState({ editForm: undefined });
        this.props.dispatch({
            type: `kdieorder/batchOrder`,
            payload: fields,
            callback: data => {
                if (data.result === 1) {
                    this.undisplay(fields.receiver);
                    //设置打印页面
                    this.setState({
                        iframeHTML: data.printPage
                    }, () => {
                        setTimeout(() => {
                            this.refs.myFocusInput.contentWindow.print();
                        }, 1000);
                    })
                }
            }
        })
    }

    //去除成功下单的发件信息
    undisplay = (fields) => {
        let oldNoOrder = JSON.parse(window.localStorage.getItem('templates'));
        let newNoOrder = [];
        for (let i = 0; i < oldNoOrder.length; i++) {
            let temp = oldNoOrder[i];
            let flag = true;
            for (let j = 0; j < fields.length; j++) {
                if (temp.id === fields[j].id) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                newNoOrder.push(temp);
            }
        }
        window.localStorage.clear();
        window.localStorage.setItem("templates", JSON.stringify(newNoOrder));
        this.setState({
            selectedRowKeys: [],
            hasSelected: false,
            noOrder: newNoOrder,
            data: JSON.parse(window.localStorage.getItem('templates'))
        })
    }

    render() {
        const { kdicompany: { kdicompany }, loading, user } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord, selectedRowKeys } = this.state;
        const prop = {
            name: 'fileName',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
        };

        const rowSelection = {
            selectedRowKeys, onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.trackingNumber === null || record.receivePeople === null ||
                record.receivePhone === null || record.receiveTitle === undefined || record.receiveProvince === undefined || 
                record.receiveCity === undefined || record.receiveCounty === undefined || record.receiveAddress === null,

            })
        };
        //let temp = window.localStorage.getItem('templates');
        const columns = [
            {
                title: '运单号',
                dataIndex: 'trackingNumber',
                key: 'trackingNumber',
                width: 150
            },
            {
                title: '收件人姓名',
                dataIndex: 'receivePeople',
                key: 'receivePeople',
                width: 150
            },
            {
                title: '收件电话',
                dataIndex: 'receivePhone',
                key: 'receivePhone',
                width: 100
            },
            {
                title: '订单标题',
                dataIndex: 'receiveTitle',
                key: 'receiveTitle',
                width: 150
            },
            {
                title: '收件省份',
                dataIndex: 'receiveProvince',
                key: 'receiveProvince',
                width: 150
            },
            {
                title: '收件城市',
                dataIndex: 'receiveCity',
                key: 'receiveCity',
                width: 150
            },
            {
                title: '收件区县',
                dataIndex: 'receiveCounty',
                key: 'receiveCounty',
                width: 150
            },
            {
                title: '收件人详细地址',
                dataIndex: 'receiveAddress',
                key: 'receiveAddress',
                width: 150
            },
        ];
        return (
            <PageHeaderLayout title="快递批量导入">
                <iframe name="print" style={{ display: 'none' }} ref="myFocusInput" srcdoc={this.state.iframeHTML} ></iframe>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                                <Col md={2} sm={24}   >
                                    <Button icon="reload" onClick={() => this.clearData()}>
                                        清除
                                    </Button>
                                </Col>
                                <Col md={4} sm={24}  >

                                    <Upload {...prop} onChange={(obj) => this.onChange(obj)}>
                                        <Button >
                                            <Icon type="upload" /> 导入Excel文件
                                         </Button>
                                    </Upload>
                                </Col>
                                <Col md={4} sm={24} style={{ marginTop: 5 }} >
                                    <a
                                        href={downloadExcel} download="导入模板.xlsx"
                                        title="导入模板.xlsx"
                                        mce_href="#"
                                        style={{ fontSize: 15, textAlign: 'center' }}
                                    >
                                        Excel模板文件下载
                                     </a>
                                </Col>
                            </Row>
                            <p />
                            <Row>
                                <Button type="primary" icon="printer" disabled={!this.state.hasSelected} onClick={this.showBatchSendForm}>
                                    批量导入并订阅
                                </Button>
                            </Row>
                        </div>
                        <Table rowKey="id"
                            pagination={false}
                            loading={loading}
                            dataSource={this.state.data}
                            columns={columns}
                            rowSelection={rowSelection}
                            scroll={{ x: 1500, y: 600 }}
                        />
                    </div>
                </Card>
                {editForm === 'kdiBatchSend' && (
                    <KdiBatchSendForm
                        width={800}
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={(fields) => this.kdiMessage(fields)}
                    />
                )}
            </PageHeaderLayout>
        );
    }
}
