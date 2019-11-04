import React from 'react';
import { connect } from 'dva';
import { Card, Row, message, Input, Form, Col, Select, Table, Upload, Icon, Modal, Cascader } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import EditableTable from 'components/Rebue/EditableTable';

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
export default class PrdProductForm extends React.Component {
  state = {
    categoryTree: [],
    previewVisible: false,
    previewImage: '',
    fileList: [],
    previewVisibles: false,
    previewImages: '',
    fileLists: [],
    productSpec: [],
    categorys: [],
    //添加后经过整理的搜索分类
    classifications: [],
    // 创建一个空的editorState作为初始值
    productDetail: BraftEditor.createEditorState(null),
  };

  componentWillMount() {
    const { record } = this.props;
    const height = document.body.clientHeight * 0.82;
    if (record.id !== undefined) {
      this.getProductSpec(record.id);
      this.getProductPic(record.id);
    }
    this.getCategoryTree();
    this.setState({
      windowsHeight: height,
      productDetail: BraftEditor.createEditorState(record.productDetail),
    });
  }

  /**
   * 获取产品分类树
   */
  getCategoryTree() {
    const { record } = this.props;
    this.props.dispatch({
      type: `prdproductcategory/getCategoryTree`,
      callback: result => {

        this.setState({
          categoryTree: result,
        });
        let find = [];
        for (let i = 0; i < result.length; i++) {
          if (this.findCode(record.categoryId, result[i], find)) {
            find.unshift(result[i].id);
            this.setState({
              categorys: find
            })
            break;
          }
        }
      },
    });
  }

  /**
   * 获取分类
   */
  findCode = (categoryId, item, find) => {
    if (categoryId === item.id) {
      return true;
    }
    if (item.categoryList === undefined && categoryId !== item.id) {
      return false;
    }
    if (categoryId !== item.id && item.categoryList !== undefined) {
      for (let i = 0; i < item.categoryList.length; i++) {
        if (this.findCode(categoryId, item.categoryList[i], find)) {
          find.unshift(item.categoryList[i].id);
          return true;
        }
      }
      return false;
    }

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
          const picUrl = `/ise-svr/files${result.picPath}`;
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

  /**
   * 选择产品分类
   */
  selectCategory = value => {
    this.setState({ categorys: value });
  };

  // 产品主图开始
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });
  // 产品图片结束

  // 产品轮播图开始
  handleCancels = () => this.setState({ previewVisibles: false });

  handlePreviews = file => {
    this.setState({
      previewImages: file.url || file.thumbUrl,
      previewVisibles: true,
    });
  };

  handleChanges = info => {
    const fileList = info.fileList.slice(-5);
    this.setState({ fileLists: fileList });
  };
  // 产品轮播图结束

  /**
   * 校验上传图片大小
   */
  beforeUpload = file => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片大小不能超过1M!');
    }
    return isLt1M;
  };

  // 富文本框上传
  uploadFn = value => {
    this.props.dispatch({
      type: `BraftEditorUpload/upload`,
      payload: {
        moduleName: 'productDetail',
        value,
      },
    });
  };

  handleCheck = (record, col) => {
    if (col && col.dataIndex === 'code') {
      this.props.dispatch({
        type: `prdproductspec/existSpecCode`,
        payload: {
          code: record.code,
        },
        callback: results => {
          if (results.result === -1) {
            message.error(results.msg);
          } else {
            message.success(results.msg);
          }
        },
      });
      return false;
    }

    if (!record.name) {
      message.error('请输入规格名称');
      return false;
    }

    if (!record.unit) {
      message.error('请输入单位');
      return false;
    }

    if (!record.code) {
      message.error('请输入规格编码');
      return false;
    }

    return true;
  };

  // 富文本框编辑事件
  handleEditorChange = editorState => {
    this.setState({ productDetail: editorState });
  };

  // 提交前事件
  beforeSave = () => {
    const { form, record } = this.props;
    // 产品ID
    let productId = null;
    if (record !== undefined) {
      productId = record.id;
    }
    // 品牌名称
    let brand = null;
    // 产品名称
    let productName = null;
    // 生产厂家
    let manufacturer = null;
    form.validateFields((err, values) => {
      brand = values.brand;
      productName = values.productName;
      manufacturer = values.manufacturer;
    });

    const { categorys, fileList, fileLists, productDetail } = this.state;
    // 产品分类ID
    let categoryId = null;
    if (categorys === undefined || categorys.length === 0) {
      categoryId = record.categoryId;
    } else {
      categoryId = categorys[categorys.length - 1];
    }

    if (categoryId === undefined || categoryId.length === 0) return message.error('请选择产品分类');
    // if (fileList === undefined || fileList.length === 0) return message.error('请上传产品主图');
    // if (fileLists === undefined || fileLists.length === 0) return message.error('请上传至少一张产品轮播图');

    // 产品规格信息
    const productSpecs = this.refs.editableTable.getRecords();
    // 产品图片
    const productPic = [];
    if (fileList !== undefined && fileList.length !== 0) {
      productPic.push({
        picType: 1, // 1为主图 0为轮播图
        picPath: fileList[0].response === undefined ? fileList[0].name : fileList[0].response.filePaths[0],
      });
    }

    if (fileLists !== undefined || fileLists.length !== 0) {
      for (let i = 0; i < fileLists.length; i++) {
        productPic.push({
          picType: 0, // 1为主图 0为轮播图
          picPath: fileLists[i].response === undefined ? fileLists[i].name : fileLists[i].response.filePaths[0],
        });
      }
    }

    form.getFieldDecorator('id');
    form.getFieldDecorator('categoryId');
    form.getFieldDecorator('productName');
    form.getFieldDecorator('manufacturer');
    form.getFieldDecorator('brand');
    form.getFieldDecorator('productDetail');
    form.getFieldDecorator('spec');
    form.getFieldDecorator('pics');
  
    productName
    form.setFieldsValue({
      id: productId,
      categoryId,
      productName,
      manufacturer,
      brand,
      productDetail: productDetail.toHTML(),
      spec: productSpecs,
      pics: productPic,
    });
  };





  render() {
    const { loading, form, record } = this.props;
    const {
      categoryTree,
      previewVisible,
      previewImage,
      fileList,
      previewVisibles,
      previewImages,
      fileLists,
      productSpec,
      productDetail,
      categorys,
    } = this.state;


    // 产品主图、轮播图上传图标
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text" />
      </div>
    );

    const columns = [
      { title: '条形码', dataIndex: 'code', align: 'center' },
      { title: '单位', dataIndex: 'unit', align: 'center' },
      { title: '规格名称', dataIndex: 'name', align: 'center' },
      { title: '市场价格', dataIndex: 'marketPrice', align: 'center' },

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
      'separator',
    ];

    // 不允许添加尺寸大于1000KB的文件
    const myValidateFn = file => {
      return file.size < 1024 * 1024 * 1;
    };

    // 富文本框功能配置
    const editorProps = {
      value: productDetail,
      excludeControls: excludeControl,
      onChange: this.handleEditorChange,
      media: {
        allowPasteImage: false, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        uploadFn: this.uploadFn,
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

    const uploadData = {
      moduleName: 'productQsmm',
    };

    const uploadDatas = {
      moduleName: 'productSlideshow',
    };

    return (
      <div style={{ height: this.state.windowsHeight }}>
        <Card>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="产品名称">
                {form.getFieldDecorator('productName', {
                  initialValue: record.productName,
                })(<Input style={{ width: '500px' }} placeholder="请输入产品的名称" />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="产品分类">
                <Cascader
                  style={{ width: '500px' }}
                  fieldNames={{ label: 'name', value: 'id', children: 'categoryList' }}
                  options={categoryTree}
                  value={categorys}
                  onChange={this.selectCategory}
                  placeholder="请选择产品分类"
                />
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="品牌名称">
                {form.getFieldDecorator('brand', {
                  initialValue: record.brand,
                })(<Input style={{ width: '500px' }} placeholder="请输入品牌的名称" />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="生产厂家">
                {form.getFieldDecorator('manufacturer', {
                  initialValue: record.manufacturer,
                })(<Input placeholder="请输入生产厂家的名称" />)}
              </FormItem>
            </Col>

            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="规格信息">
                {
                  <div>
                    <br />
                    <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)', marginLeft: -70 }}>
                      {columns.length === 0 ? (
                        <div id="skuDivId" />
                      ) : (
                          <div id="skuDivId">
                            <EditableTable onCheck={this.handleCheck} ref="editableTable">
                              <Table
                                rowKey="id"
                                pagination={false}
                                loading={loading}
                                dataSource={productSpec}
                                columns={columns}
                              />
                            </EditableTable>
                          </div>
                        )}
                    </div>
                  </div>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <br />
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="产品主图">
                {
                  <div className="clearfix">
                    <Upload
                      // gitaction="/ise-svr/ise/upload"
                      action="http://192.168.1.16:20180/ise/upload"
                      listType="picture-card"
                      fileList={fileList}
                      name="multipartFile"
                      data={uploadData}
                      beforeUpload={this.beforeUpload}
                      multiple={false}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      className="damaiQsmm"
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" src={previewImage} />
                    </Modal>
                  </div>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="产品轮播图">
                {
                  <div className="clearfix">
                    <Upload
                      // action="/ise-svr/ise/upload"
                      action="http://192.168.1.16:20180/ise/upload"
                      listType="picture-card"
                      fileList={fileLists}
                      name="multipartFile"
                      data={uploadDatas}
                      multiple
                      beforeUpload={this.beforeUpload}
                      onPreview={this.handlePreviews}
                      onChange={this.handleChanges}
                      className="damaiSlideshow"
                    >
                      {fileLists.length >= 5 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisibles} footer={null} onCancel={this.handleCancels}>
                      <img alt="example" src={previewImages} />
                    </Modal>
                  </div>
                }
              </FormItem>
            </Col>

            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="产品详情">
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
