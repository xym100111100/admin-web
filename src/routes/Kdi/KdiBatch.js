import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Table, Upload, message, Icon, Row, Col } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiCompany.less';
import KdiBatchSendForm from './KdiBatchSendForm'
import XLSX from 'xlsx';//引入JS读取Excel文件的插件

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
        //window.localStorage.clear();
        let { user } = this.props
    }

    /**
     * 清空table
     */
    clearData = () => {
        window.localStorage.clear();
        this.setState({
            data: JSON.parse(window.localStorage.getItem('templates')),
            hasSelected:false
        });

    }


    //显示批量打印选择快递和发件人的窗口
    showBatchSendForm = () => {
        this.setState({
            data: [],
        })
        // this.showAddForm({
        //     editForm: 'kdiBatchSend',
        //     editFormTitle: '选择发货快递和发件人',
        // })
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
        if (obj.file.status !== 'uploading') {
            console.log('obj', obj);

            var f = obj.fileList[0].originFileObj;
            let read = new FileReader();

            read.onload = function (e) {
                var data = e.target.result;
                var wb = XLSX.read(data, {
                    type: 'binary' //以二进制的方式读取
                });
                var sheet0 = wb.Sheets[wb.SheetNames[0]];//sheet0代表excel表格中的第一页
                var str = XLSX.utils.sheet_to_json(sheet0);//利用接口实现转换。
                // var templates = new Array();
                // var str1 = obj.fileList[0].originFileObj.name;
                //templates = str1.split(".");//将导入文件名去掉后缀
                //alert(JSON.stringify(str));
                console.log('1', JSON.parse(window.localStorage.getItem('templates')));
                window.localStorage.clear();
                console.log('2', JSON.parse(window.localStorage.getItem('templates')));
                window.localStorage.setItem("templates", JSON.stringify(str))//存入localStorage 中
                console.log('3', JSON.parse(window.localStorage.getItem('templates')));
            }
            read.readAsBinaryString(f);
            console.log('4', JSON.parse(window.localStorage.getItem('templates')));
        }
            this.setState({
                data: JSON.parse(window.localStorage.getItem('templates')),
            })
        if (obj.file.status === 'done') {
            message.success(`${obj.file.name} 导入成功`);
        } else if (obj.file.status === 'error') {
            message.error(`${obj.file.name} 导入失败`);
        }
    }



    render() {
        const { kdicompany: { kdicompany }, loading, user } = this.props;
        const { editForm, editFormType, editFormTitle, editFormRecord, selectedRowKeys } = this.state;
        const prop = {
            name: 'image/*',
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
        //console.log(temp);
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
            },
            {
                title: '收件人',
                dataIndex: '收件人',
            },
            {
                title: '收件人电话',
                dataIndex: '收件人电话',
            },
            {
                title: '收件地址',
                dataIndex: '收件地址',
            },
            {
                title: '邮编',
                dataIndex: '邮编',
            },
            {
                title: '备注',
                dataIndex: '备注',
            },

        ];
        return (
            <PageHeaderLayout title="快递批量下单">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="reload" onClick={() => this.clearData()}>
                                清除
                            </Button>
                            <Divider type="vertical" />
                            <Upload {...prop} onChange={(obj) => this.onChange(obj)}>
                                <Button >
                                    <Icon type="upload" /> 导入Excel文件
                                </Button>
                            </Upload>
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
                        onSubmit={(fields) => this.batchPrint(fields)}
                    />
                )}
            </PageHeaderLayout>
        );
    }
}
