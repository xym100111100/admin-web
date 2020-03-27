import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, message, Table, Icon, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImportProduct.less';
import XLSX from 'xlsx';//引入JS读取Excel文件的插件
import splitAddr from 'components/Kdi/Area/SplitAddr';

@connect(({ importproduct, loading }) => ({ importproduct, loading: loading.models.importproduct }))
export default class ImportProduct extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'importproduct';
    this.state.data = []
    this.state.data1 = []
  }


  /**
    * 导入Excel获取的收件人信息
    */
  onChange1 = (obj) => {
    if (obj.fileList.length === 0) {
      return;
    }
    let receivingInformation = [];
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

        for (let i = 0; i < str.length; i++) {
          receivingInformation[i] = {};
          receivingInformation[i].id = i + 1;
          receivingInformation[i].goodCode = str[i].商品条码;
          receivingInformation[i].name = str[i].商品名称;
          receivingInformation[i].price = str[i].售价;
          receivingInformation[i].className = str[i].分类;
          receivingInformation[i].unit = str[i].单位;
          receivingInformation[i].inPrice = str[i].进价;
          receivingInformation[i].stock = str[i].库存;

        }
        window.localStorage.setItem("templates", JSON.stringify(receivingInformation))//存入localStorage 中

      }
      read.readAsBinaryString(f);
    }

    setTimeout(() => {
      this.setState({
        data1: JSON.parse(window.localStorage.getItem('templates'))
      })
    }, 500);

    if (obj.file.status === 'done') {

      message.success(`${obj.file.name} 导入成功`);
    } else if (obj.file.status === 'error') {

      message.error(`${obj.file.name} 导入失败`);
    }


  }

  commitData = () => {
    console.log(this.state.data1)
    this.props.dispatch({
      type: `${this.moduleCode}/add`,
      payload: {
        importProduct:this.state.data1
      },
    })
  }


  render() {
    console.log(this.state.data1)
    const { importproduct: { importproduct }, loading } = this.props;
    const prop = {
      name: 'fileName',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
    };
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '商品条码',
        dataIndex: 'goodCode',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '售价',
        dataIndex: 'price',
      },
      {
        title: '分类',
        dataIndex: 'className',
      },

      {
        title: '单位',
        dataIndex: 'unit',
      },
      {
        title: '进货价',
        dataIndex: 'inPrice',
      },
      {
        title: '库存',
        dataIndex: 'stock',
      },


    ];

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Upload {...prop} onChange={(obj) => this.onChange1(obj)}>
                  <Button >
                    <Icon type="upload" /> 导入Excel文件
                    </Button>
                </Upload>
              </div>
              <div>
                <Button style={{ marginLeft: 8 }} onClick={this.commitData}>
                  提交
              </Button>
              </div>
              <Table rowKey="id" pagination={false} loading={loading} dataSource={this.state.data1} columns={columns} />

            </div>
          </Card>
        </PageHeaderLayout>,

      </Fragment>
    );
  }
}
