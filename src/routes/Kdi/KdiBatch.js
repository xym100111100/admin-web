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


@connect(({ kdicompany, kditemplate, companydic, user, login, loading }) => ({
    kdicompany,
    companydic,
    kditemplate,
    user,
    login,
    loading: loading.models.kdicompany || loading.models.kditemplate || loading.models.user || loading.models.companydic || loading.models.login,
}))
export default class KdiBatch extends SimpleMng {
    constructor() {
        super();
        this.state.selectedRowKeys = [];
        this.state.hasSelected = false;
        this.state.data = [];

    }
    //初始化
    componentDidMount() {
        //console.log(JSON.parse(window.localStorage.getItem('templates')));
    }

    /**
     * 清空table
     */
    clearData = () => {
        console.log(this.state.data);
        console.log("----------")
        //打印地址
        console.log(getArea())
        console.log(JSON.parse(window.localStorage.getItem('templates')));
        console.log("开始清除");
        window.localStorage.clear();
        console.log(JSON.parse(window.localStorage.getItem('templates')));
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

    //显示批量复制输入框
    showCopyForm = () => {
        this.showAddForm({
            editForm: 'kdiCopy',
            editFormTitle: '批量复制输入框',
        })
    }

    //通过复制获取的收件人信息
    receivingInformation = (files) => {
        let temp = files.receivingInformation.split("\n");
        const check = getArea();
        console.log('temp', temp);
        //清除内容为空的数组元素
        let array = [];
        let x = 0;
        for (let i = 0; i < temp.length; i++) {
            temp[i] = temp[i].replace(/^[\s]*$/, "");
            if (temp[i] !== null && temp[i] !== "") {
                array[x++] = temp[i];
            }
        }
        let receivingInformation = [];
        for (let i = 0; i < array.length; i++) {
            receivingInformation[i] = splitAddr(array[i]);
            receivingInformation[i].id = i + 1;
            for (let x = 0; x < check.length; x++) {
                let province = check[x];
                //校验省份
                if (province.value == receivingInformation[i].province) {
                    for (let y = 0; y < province.children.length; y++) {
                        let city = province.children[y];
                        //校验城市
                        if (city.value == receivingInformation[i].city) {
                            for (let z = 0; z < city.children.length; z++) {
                                let count = city.children[z];
                                //校验市区
                                if (count.value == receivingInformation[i].count) {
                                    receivingInformation[i].errorMessage = null;
                                    break;
                                } else {
                                    receivingInformation[i].errorMessage = '市区错误';
                                }
                            }
                            break;
                        } else {
                            receivingInformation[i].errorMessage = "城市错误";
                        }
                    }
                    break;
                } else {
                    receivingInformation[i].errorMessage = "省份错误";
                }
            }
        }
        console.log(receivingInformation);
        //存入localStorage 中
        window.localStorage.setItem("templates", JSON.stringify(receivingInformation));
        this.setState({
            data: JSON.parse(window.localStorage.getItem('templates'))
        })
        this.setState({ editForm: undefined });
    }

    onSelectChange = (selectedRowKeys, selectedRow) => {
        //selectedRowKeys.receiver = selectedRow;
        console.log('获取的值', selectedRow);
        const hasSelected = selectedRowKeys.length > 0;//是否勾选订单
        this.setState({ selectedRowKeys, hasSelected });
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
                    let receivingInformation = [];
                    for (let i = 0; i < str.length; i++) {
                        receivingInformation[i] = splitAddr(str[i].收货地址);
                        receivingInformation[i].id = i + 1;
                        receivingInformation[i].receivePeople = str[i].收件人;
                        receivingInformation[i].receivePhone = str[i].收件人手机;
                        receivingInformation[i].receiveTitle = str[i].订单标题;
                        for (let x = 0; x < check.length; x++) {
                            let province = check[x];
                            //校验省份
                            if (province.value == receivingInformation[i].province) {
                                for (let y = 0; y < province.children.length; y++) {
                                    let city = province.children[y];
                                    //校验城市
                                    if (city.value == receivingInformation[i].city) {
                                        for (let z = 0; z < city.children.length; z++) {
                                            let count = city.children[z];
                                            //校验市区
                                            if (count.value == receivingInformation[i].count) {
                                                receivingInformation[i].errorMessage = null;
                                                break;
                                            } else {
                                                receivingInformation[i].errorMessage = '市区错误';
                                            }
                                        }
                                        break;
                                    } else {
                                        receivingInformation[i].errorMessage = "城市错误";
                                    }
                                }
                                break;
                            } else {
                                receivingInformation[i].errorMessage = "省份错误";
                            }
                        }
                    }
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
                    data: JSON.parse(window.localStorage.getItem('templates'))
                })
            }, 500);
        }, 500)


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
                disabled: record.receivePeople === null || record.receivePhone === null || record.address === null || record.receiveTitle === null || record.receivePeople === undefined || record.receivePhone === undefined || record.address === undefined || record.receiveTitle === undefined || record.errorMessage !== null,

            })
        };
        //let temp = window.localStorage.getItem('templates');
        const columns = [
            {
                title: '收件人',
                dataIndex: 'receivePeople',
                key: 'receivePeople',
                width: 150
            },
            {
                title: '收件人电话',
                dataIndex: 'receivePhone',
                key: 'receivePhone',
                width: 100
            },
            {
                title: '收件地址',
                dataIndex: 'address',
                key: 'address',
                width: 200
            },
            {
                title: '订单标题',
                dataIndex: 'receiveTitle',
                key: 'receiveTitle',
                width: 150
            },
            {
                title: '地址错误信息',
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                width: 150
            }
        ];
        return (
            <PageHeaderLayout title="快递批量下单">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Row gutter={{ md: 6, lg: 24, xl: 48 }} >
                                <Col md={2} sm={24}   >
                                    <Button icon="reload" onClick={() => this.clearData()}>
                                        清除
                                    </Button>

                                </Col>

                                <Col md={5} sm={24} style={{marginLeft:30}} >
                                    <Button icon="copy" onClick={() => this.showCopyForm()}>复制并导入收货信息</Button>
                                </Col>
                                <Col md={4} sm={24}  >

                                    <Upload {...prop} onChange={(obj) => this.onChange(obj)}>
                                        <Button >
                                            <Icon type="upload" /> 导入Excel文件
                                         </Button>
                                    </Upload>
                                </Col>
                                <Col md={4} sm={24} style={{marginTop:5}} >
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
                                    批量下单并打印
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
                {editForm === 'kdiCopy' && (
                    <KdiCopyForm
                        width={800}
                        visible
                        title={editFormTitle}
                        editFormType={editFormType}
                        record={editFormRecord}
                        closeModal={() => this.setState({ editForm: undefined })}
                        onSubmit={(fields) => this.receivingInformation(fields)}
                    />
                )}
            </PageHeaderLayout>
        );
    }
}
