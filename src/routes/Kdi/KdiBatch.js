import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Table, Upload, message, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiCompany.less';
import XLSX from 'xlsx';

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
        this.moduleCode = 'kdicompany';
    }
    //初始化
    componentDidMount() {
        //window.localStorage.clear();
        let { user } = this.props
        let orgId = user.currentUser.orgId
        this.props.dispatch({
            type: `${this.moduleCode}/list`,
            payload: { orgId: orgId },
        });
    }
    
    reload(){
        window.localStorage.clear();
        this.handleReload();
    }

    render() {
        const prop = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(obj) {
                // if (!obj.files) {
                //     return;
                // }
                  if (obj.file.status !== 'uploading') {
                    // console.log('obj',obj);
                    // console.log('obj.file',obj.file);
                    // console.log("obj.fileList",obj.fileList); 
                    var f = obj.fileList[0].originFileObj;
                    //console.log("obj.fileList[0].originFileObj",obj.fileList[0].originFileObj); 
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
                       // window.localStorage.clear();
                        console.log(str);
                        window.localStorage.setItem("templates", JSON.stringify(str))//存入localStorage 中
                        
                    }
                    read.readAsBinaryString(f);
                }
                    if (obj.file.status === 'done') {
                        message.success(`${obj.file.name} file uploaded successfully`);
                    } else if (obj.file.status === 'error') {
                        message.error(`${obj.file.name} file upload failed.`);
                    }
                    handleReload();
                },
        };
        const { kdicompany: { kdicompany }, loading, user } = this.props;
        let temp = window.localStorage.getItem('templates');
        //let read;
        let read=JSON.parse(temp);
        console.log(temp);
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
            },
            {
                title: '买家账号',
                dataIndex: '买家账号',
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
                title: '运单号',
                dataIndex: '运单号',
            },
            {
                title: '快递公司',
                dataIndex: '快递公司',
            },
            {
                title: '备注',
                dataIndex: '备注',
            },
            
        ];
        return (
            <PageHeaderLayout title="快递公司配置">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Divider type="vertical" />
                            <Button icon="reload" onClick={() => this.reload()}>
                                清除
                         </Button>
                            <Upload {...prop}>
                                <Button>
                                    <Icon type="upload" /> 文件上传
                                </Button>
                            </Upload>
                        </div>
                        <Table rowKey="id" pagination={false} loading={loading} dataSource={read} columns={columns} />
                    </div>
                </Card>

            </PageHeaderLayout>
        );
    }
}
