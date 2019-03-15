import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Table, Upload, message, Icon, Row, Col } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiCompany.less';
import KdiBatchSendForm from './KdiBatchSendForm'
import getArea from 'components/Kdi/Area/index';//获取地址
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
        console.log(JSON.parse(window.localStorage.getItem('templates')));
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
        console.log(files);
        
        let temp=files.receivingInformation.split("\n");
        console.log(temp);
        //存入localStorage 中
        //window.localStorage.setItem("templates", JSON.stringify(str))
    }

    onSelectChange = (selectedRowKeys, selectedRow) => {
        //selectedRowKeys.receiver = selectedRow;
        //console.log('获取的值', selectedRowKeys);
        const hasSelected = selectedRowKeys.length > 0;//是否勾选订单
        this.setState({ selectedRowKeys, hasSelected });
    }

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

                    window.localStorage.setItem("templates", JSON.stringify(str))//存入localStorage 中
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
            // getCheckboxProps: record => ({
            //     disabled: record.orderState !== 2 && record.orderState !== 3,
            //     name: record.orderState.toString(),
            // })
        };
        //let temp = window.localStorage.getItem('templates');
        const columns = [
            {
                title: '收件人',
                dataIndex: '收件人',
                width: 150
            },
            {
                title: '收件人电话',
                dataIndex: '收件人电话',
                width: 150
            },
            {
                title: '收件地址',
                dataIndex: '收件地址',
                width: 150
            },
            {
                title: '订单标题',
                dataIndex: '订单标题',
                width: 150
            },

        ];
        return (
            <PageHeaderLayout title="快递批量下单">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Row gutter={{ xs: 8, sm: 16 }}  >
                                <Col sm={4} md={5} >
                                    <Button icon="reload" onClick={() => this.clearData()}>
                                        清除
                                    </Button>
                                    <Divider type="vertical" />
                                    <Upload {...prop} onChange={(obj) => this.onChange(obj)}>
                                        <Button >
                                            <Icon type="upload" /> 导入Excel文件
                                        </Button>
                                    </Upload>
                                </Col>
                                <Col sm={2} md={3} pull={1} >
                                    <a
                                        href={downloadExcel} download="导入模板"
                                        title="导入模板"
                                        mce_href="#"
                                        style={{ fontSize: 15, textAlign:'center'}}
                                    >
                                        Excel模板文件下载
                                       </a>
                                </Col>
                                <Col sm={3} md={4} pull={2} >
                                    <Divider type="vertical" />
                                    <Button icon="copy" onClick={() => this.showCopyForm()}>复制并导入收货信息</Button>
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
