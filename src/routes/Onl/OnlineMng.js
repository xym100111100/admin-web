import React from 'react';
import SimpleMng from 'components/Rebue/SimpleMng';
import { connect } from 'dva';
import { Card, message, Button, Input, Form, Row, Col, Table, Upload, Icon, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

const FormItem = Form.Item;
@connect(({ sucuser, userrole, sucorg }) => ({
  sucuser,
  sucorg,
  userrole,
}))
export default class OnlineMng extends SimpleMng {
  componentDidMount() {
    this.showAddEditor();
  }

  // 创建商品规格信息table表格开始
  showAddEditor() {
    // 克隆新数组
    const newList = this.cloneList();
    // 创建新记录
    const newRecord = {
      id: new Date().getTime(),
      onlineSpec: undefined,
      salePrice: undefined,
      cashbackAmount: undefined,
      saleCount: undefined,
      seqNo: undefined,
      saleUnit: undefined,
    };
    // 添加新记录
    newList.push(newRecord);
    this.setState({ editType: 'add', editRecord: newRecord, sucuser: newList });
  }

  cloneList() {
    let { sucuser } = this.state;
    if (sucuser == undefined) {
      return [];
    }
    return Object.assign(sucuser);
  }
  // 创建商品规格信息table表格结束

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  // 商品主图上传开始
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });
  // 商品图片上传结束

  onDelete(index) {
    if (index === 0) {
      message.error('当前行不能删除');
      return;
    }
    const sucuser = [...this.state.sucuser];
    sucuser.splice(index, 1); //index为获取的索引，后面的 1 是删除几行
    this.setState({ sucuser });
  }

  render() {
    const { loading } = this.props;
    const { previewVisible, previewImage, fileList, sucuser } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text" />
      </div>
    );
    const columns = [
      {
        title: '规格名称',
        dataIndex: 'onlineSpec',
        align: 'center',
        render: (text, record) => {
          return (
            <Input
              defaultValue={text}
              // 首格input要设置width不是默认的100%，否则会被换到下一行
              style={{ width: 'auto' }}
              placeholder="规格名称"
            />
          );
          return text;
        },
      },
      {
        title: '上线价格',
        dataIndex: 'salePrice',
        align: 'center',
        render: (text, record) => {
          return <Input defaultValue={text} placeholder="上线价格" />;
          return text;
        },
      },
      {
        title: '返现金额',
        dataIndex: 'cashbackAmount',
        align: 'center',
        render: (text, record) => {
          return <Input defaultValue={text} placeholder="返现金额" />;
          return text;
        },
      },
      {
        title: '上线数量',
        dataIndex: 'saleCount',
        align: 'center',
        render: (text, record) => {
          return <Input defaultValue={text} placeholder="上线数量" />;
          return text;
        },
      },
      {
        title: '规格排序号',
        dataIndex: 'seqNo',
        align: 'center',
        render: (text, record) => {
          const { editRecord } = this.state;
          return <Input defaultValue={text} placeholder="规格排序号" />;
          return text;
        },
      },
      {
        title: '单位',
        dataIndex: 'saleUnit',
        align: 'center',
        render: (text, record) => {
          return <Input defaultValue={text} placeholder="单位" />;
          return text;
        },
      },
      {
        title: '操作',
        align: 'center',
        width: '130px',
        render: (text, record, index) => {
          return (
            <Row>
              <Col xs={24} xxl={13}>
                <a onClick={() => this.showAddEditor()}>
                  <Button icon="plus" />
                </a>
              </Col>
              <Col xs={24} xxl={10}>
                <a onClick={this.onDelete.bind(this, index)}>
                  <Button icon="minus" />
                </a>
              </Col>
            </Row>
          );
          return null;
        },
      },
    ];

    const editorProps = {
      border: 'solid, 1px, rgba(0, 0, 0, 0.25)',
    };

    return (
      <PageHeaderLayout title="商品上线">
        <Row style={{ width: '100%' }} align="middle">
          <Card style={{ width: '1500px', margin: '0 auto' }}>
            <Col span={24} style={{ width: '100%' }}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品名称">
                {<Input style={{ width: '500px' }} placeholder="请输入商品的名称" />}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="规格信息">
                {
                  <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                    <Table rowKey="id" pagination={false} loading={loading} dataSource={sucuser} columns={columns} />
                  </div>
                }
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品主图">
                {
                  <div className="clearfix">
                    <Upload
                      action="//jsonplaceholder.typicode.com/posts/"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                }
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品轮播图">
                {
                  <div className="clearfix">
                    <Upload
                      action="//jsonplaceholder.typicode.com/posts/"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {fileList.length >= 4 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                }
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品详情">
                {
                  <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                    <BraftEditor {...editorProps} />
                  </div>
                }
              </FormItem>
            </Col>
          </Card>
        </Row>
      </PageHeaderLayout>
    );
  }
}
