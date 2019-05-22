import React from 'react';
import { connect } from 'dva';
import { Card, Row, Form, Col, Table } from 'antd';
import EditForm from 'components/Rebue/EditForm';
// 引入编辑器以及EditorState子模块
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;

@connect(({ BraftEditorUpload, prmpartner }) => ({
  BraftEditorUpload,
  prmpartner,
}))
@Form.create()
@EditForm
export default class PrdProductDetail extends React.Component {
  state = {
    fileList: [],
    fileLists: [],
    productSpec: [],
    // 创建一个空的editorState作为初始值
    productDetail: BraftEditor.createEditorState(null),
  };

  componentWillMount() {
    const { record, id } = this.props;
    const height = document.body.clientHeight * 0.82;
    if (id !== undefined) {
      this.getProductSpec(id);
      this.getProductPic(id);
    }
    this.setState({
      windowsHeight: height,
      productDetail: BraftEditor.createEditorState(record.productDetail),
    });
  }

  /**
   * 获取产品规格信息
   */
  getProductSpec = id => {
    this.props.dispatch({
      type: `prdproductspec/list`,
      payload: {
        productId: id,
      },
      callback: record => {
        this.setState({ productSpec: record });
      },
    });
  };

  /**
   * 获取产品图片
   */
  getProductPic = id => {
    this.props.dispatch({
      type: `prdproductpic/list`,
      payload: {
        productId: id,
      },
      callback: record => {
        // 产品主图
        const fileList = [];
        // 产品轮播图
        const fileLists = [];
        record.forEach(result => {
          const picUrl = `http://192.168.1.222:20180/files${result.picPath}`;
          if (result.picType === 1) {
            fileList.push({
              uid: result.id,
              name: result.picPath,
              status: 'done',
              url: picUrl,
            });
          }
          if (result.picType === 0) {
            fileLists.push({
              uid: result.id,
              name: result.picPath,
              status: 'done',
              url: picUrl,
            });
          }
        });
        this.setState({ fileList, fileLists });
      },
    });
  };

  render() {
    const { record } = this.props;
    const { fileList, fileLists, productSpec, productDetail } = this.state;

    const columns = [
      { title: '规格名称', dataIndex: 'name', align: 'center' },
      { title: '市场价格', dataIndex: 'marketPrice', align: 'center' },
      { title: '单位', dataIndex: 'unit', align: 'center' },
      { title: '条形码', dataIndex: 'code', align: 'center' },
    ];

    // 不在工具栏显示的控件列表
    const excludeControl = [
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'underline',
      'strike-through',
      'separator',
      'superscript',
      'subscript',
      'remove-styles',
      'emoji',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'headings',
      'list-ul',
      'list-ol',
      'blockquote',
      'code',
      'separator',
      'link',
      'separator',
      'hr',
      'separator',
      'media',
      'separator',
      'clear',
    ];

    // 不允许添加尺寸大于1000KB的文件
    const myValidateFn = file => {
      return file.size < 1024 * 1024 * 1;
    };

    // 富文本框功能配置
    const editorProps = {
      value: productDetail,
      readOnly: true,
      excludeControls: excludeControl,
      media: {
        allowPasteImage: false, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        textAligns: ['center'],
        externals: {
          image: false,
          audio: false,
          video: false,
          embed: false,
        }, // 如果以上四个值皆为false，则不允许插入任何外部媒体，也不会显示插入外部媒体的入口
        validateFn: myValidateFn,
      },
    };

    return (
      <div style={{ height: this.state.windowsHeight }}>
        <Card>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="产品名称">
                {record.productName}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="产品分类">
                {record.fullName}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="规格信息">
                {
                  <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                    <Table rowKey="id" pagination={false} dataSource={productSpec} columns={columns} />
                  </div>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <br />
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品主图">
                <div>
                  {fileList.map(file => {
                    return (
                      <div
                        key={file.url}
                        style={{ float: 'left', width: '104px', height: '104px', margin: '0 8px 8px 0' }}
                      >
                        <img style={{ width: '100%', height: '100%' }} src={file.url} alt="" />
                      </div>
                    );
                  })}
                </div>
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品轮播图">
                <div>
                  {fileLists.map(file => {
                    return (
                      <div
                        key={file.url}
                        style={{ float: 'left', width: '104px', height: '104px', margin: '0 8px 8px 0' }}
                      >
                        <img style={{ width: '100%', height: '100%' }} src={file.url} alt="" />
                      </div>
                    );
                  })}
                </div>
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="品牌名称">
                {record.brand}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="生产厂家">
                {record.manufacturer}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品详情">
                {
                  <div>
                    <br />
                    <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                      <BraftEditor {...editorProps} />
                    </div>
                  </div>
                }
              </FormItem>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
