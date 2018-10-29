import React from 'react';
import { connect } from 'dva';
import { Card, message, Input, Form, Col, Table, Upload, Icon, Modal, Radio, Select } from 'antd';
// import OnlyPopupForm from 'components/Rebue/OnlyPopupForm';
import EditForm from 'components/Rebue/EditForm';
import EditableTable from 'components/Rebue/EditableTable';
// 引入编辑器以及EditorState子模块
import BraftEditor, { EditorState } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ onlonline, BraftEditorUpload, prmpartner }) => ({
  BraftEditorUpload,
  onlonline,
  prmpartner,
}))
@Form.create()
// @OnlyPopupForm
@EditForm
export default class OnlineForm extends React.Component {
  componentWillMount() {
    const { id } = this.props;
    if (id !== undefined) this.getOnlines(id);
    this.partnerSearch();
  }

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    previewVisibles: false,
    previewImages: '',
    fileLists: [],
    subjectType: 0,
    onlOnlineSpec: [],
    partnerData: [],
    // 创建一个空的editorState作为初始值
    editorState: EditorState.createFrom(''),
  };

  // 获取上线信息包括：上线信息、规格信息、图片信息等
  getOnlines = id => {
    this.props.dispatch({
      type: `onlonline/getById`,
      payload: {
        id: id,
      },
      callback: onlonline => {
        let fileList = new Array();
        let fileLists = new Array();
        for (let i = 0; i < onlonline.record.onlinePicList.length; i++) {
          if (onlonline.record.onlinePicList[i].picType === 1) {
            fileList.push({
              uid: onlonline.record.onlinePicList[i].id,
              name: onlonline.record.onlinePicList[i].picPath,
              status: 'done',
              url: '/ise-svr/files' + onlonline.record.onlinePicList[i].picPath,
            });
          } else {
            fileLists.push({
              uid: onlonline.record.onlinePicList[i].id,
              name: onlonline.record.onlinePicList[i].picPath,
              status: 'done',
              url: '/ise-svr/files' + onlonline.record.onlinePicList[i].picPath,
            });
          }
        }
        let onlineDetail = onlonline.record.onlineDetail + '<p></p>';
        const { form } = this.props;
        form.setFieldsValue({ onlineName: onlonline.record.onlineTitle });
        this.setState({
          subjectType: onlonline.record.subjectType,
          onlOnlineSpec: Array.from(onlonline.record.onlineSpecList),
          previewVisible: false,
          previewImage: '',
          fileList: fileList,
          previewVisibles: false,
          previewImages: '',
          fileLists: fileLists,
          onlineDetail: EditorState.createFrom(onlineDetail),
        });
      },
    });
  };

  // 商品主图开始
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });
  // 商品图片结束

  // 商品轮播图开始
  handleCancels = () => this.setState({ previewVisibles: false });

  handlePreviews = file => {
    this.setState({
      previewImages: file.url || file.thumbUrl,
      previewVisibles: true,
    });
  };

  handleChanges = info => {
    let fileList = info.fileList;
    fileList = fileList.slice(-5);
    this.setState({ fileLists: fileList });
  };
  // 商品轮播图结束

  // 富文本框上传
  uploadFn = param => {
    this.props.dispatch({
      type: `BraftEditorUpload/upload`,
      payload: param,
    });
  };

  handleCheck = record => {
    // 验证价格是否大于0
    const reg = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
    if (!record.onlineSpec) {
      message.error('请输入规格名称');
      return false;
    }
    if (!record.salePrice) {
      message.error('请输入上线价格');
      return false;
    }
    if (this.state.subjectType === 0) {
      if (!record.cashbackAmount) {
        message.error('请输入返现金额');
        return false;
      }
      if (!reg.test(record.cashbackAmount)) {
        message.error('返现金额只能输入大于0的整数或者小数');
        return false;
      }
    }

    if (!record.currentOnlineCount) {
      message.error('请输入上线数量');
      return false;
    }
    if (!record.saleUnit) {
      message.error('请输入单位');
      return false;
    }
    if (!reg.test(record.salePrice)) {
      message.error('上线价格只能输入大于0的整数或者小数');
      return false;
    }

    // 验证是否为正整数
    const regs = /^[1-9]\d*$/;
    if (!regs.test(record.currentOnlineCount)) {
      message.error('上线数量只能为正整数且不能为0');
      return false;
    }
    return true;
  };

  // 搜索伙伴
  partnerSearch = e => {
    this.props.dispatch({
      type: `prmpartner/list`,
      payload: {
        pageNum: 1,
        pageSize: 5,
        partnerName: e,
      },
      callback: partner => {
        this.setState({
          partnerData: partner.list === undefined ? [] : partner.list
        })
      },
    });
  }

  partnerChange = e => {
    console.log(e)
  }

  // 选择板块类型事件
  onChangeRadio = e => {
    this.setState({
      subjectType: e.target.value,
    });
  };

  // 富文本框编辑事件
  handleEditorChange = editorState => {
    this.setState({ onlineDetail: editorState });
  };

  // 提交前事件
  beforeSave = () => {
    const { form, record, id } = this.props;
    // 产品id
    let productId = record.productId === undefined ? 0 : record.productId;
    // 上线商品名称
    let onlineName = undefined;
    form.validateFields((err, values) => {
      onlineName = values.onlineName;
    });
    const { fileList, fileLists, onlineDetail, subjectType } = this.state;
    console.log(fileLists);
    let detailHtml = onlineDetail.toHTML().replace(/<div\/?.+?>/g, '');
    let onlineDetails = detailHtml.replace(/<\/div>/g, '');
    if (onlineName === undefined || onlineName === null || onlineName === '') return message.error('请输入商品名称');

    // 上线规格信息
    const onlineSpecs = this.refs.editableTable.getRecords();
    if (onlineSpecs === undefined || onlineSpecs.length === 0) return message.error('请输入商品规格信息');

    if (fileList === undefined || fileList.length === 0) return message.error('请上传商品主图');

    if (fileLists === undefined || fileLists.length === 0) return message.error('请上传至少一张商品轮播图');

    if (onlineDetail === undefined || onlineDetail === '' || onlineDetail === null)
      return message.error('商品详情不能为空');
    if (onlineDetail.length > 2400) return message.error('商品详情字数不能大于2400个字');

    let qsmm = fileList[0].response === undefined ? fileList[0].name : fileList[0].response.filePaths[0];
    let slideshows = new Array();
    for (let i = 0; i < fileLists.length; i++) {
      let slideshow = fileLists[i].response === undefined ? fileLists[i].name : fileLists[i].response.filePaths[0];
      slideshows.push({
        slideshow: slideshow,
      });
    }
    form.getFieldDecorator('subjectType');
    form.getFieldDecorator('onlineSpecs');
    form.getFieldDecorator('goodsQsmm');
    form.getFieldDecorator('slideshow');
    form.getFieldDecorator('onlineDetail');
    form.getFieldDecorator('productId');
    form.getFieldDecorator('onlineId');
    form.setFieldsValue({
      onlineId: id,
      onlineName: onlineName,
      subjectType: subjectType,
      onlineSpecs: onlineSpecs,
      goodsQsmm: qsmm,
      slideshow: slideshows,
      onlineDetail: onlineDetails,
      productId: productId,
    });
  };

  render() {
    const { loading, form } = this.props;
    const {
      previewVisible,
      previewImage,
      fileList,
      previewVisibles,
      previewImages,
      fileLists,
      onlOnlineSpec,
      onlineDetail,
      subjectType,
      partnerData,
    } = this.state;
    const options = partnerData.map(d => <Option key={d.id}>{d.partnerName}</Option>);

    // 商品主图、轮播图上传图标
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text" />
      </div>
    );

    // 上线规格table表格
    const columns = [
      {
        title: '规格名称',
        dataIndex: 'onlineSpec',
        align: 'center',
      },
      {
        title: '上线价格',
        dataIndex: 'salePrice',
        align: 'center',
        width: '110px',
      },
      {
        title: '返现金额',
        dataIndex: 'cashbackAmount',
        align: 'center',
        width: '110px',
      },

      {
        title: '本次上线数量',
        dataIndex: 'currentOnlineCount',
        align: 'center',
        width: '120px',
      },
      {
        title: '单位',
        dataIndex: 'saleUnit',
        align: 'center',
        width: '90px',
      },
    ];

    if (subjectType === 1) {
      columns.splice(2, 1);
    }
    // 富文本框功能配置
    const editorProps = {
      value: onlineDetail,
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
      },
    };

    const uploadData = {
      moduleName: 'damaiQsmm',
    };

    const uploadDatas = {
      moduleName: 'damaiSlideshow',
    };

    return (
      <Card style={{ width: '1050px', margin: '0 auto' }}>
        <Col span={24} style={{ width: '100%' }}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品名称">
            {form.getFieldDecorator('onlineName', {})(
              <Input style={{ width: '500px' }} placeholder="请输入商品的名称" />
            )}
          </FormItem>
        </Col>
        <Col span={24} style={{ width: '100%' }}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="伙伴名称">
            {form.getFieldDecorator('partnerName', {})(
              <Select
              showSearch
              //value={this.state.value}
              placeholder="请输入伙伴名称"
              style={{width: 300}}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.partnerSearch}
              onChange={this.partnerChange}
              notFoundContent={null}
            >
              {options}
            </Select>
            )}
          </FormItem>
        </Col>
        <Col span={24} style={{ width: '100%' }}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="上线板块">
            {
              <RadioGroup onChange={this.onChangeRadio} value={this.state.subjectType}>
                <Radio value={0}>返现</Radio>
                <Radio value={1}>全返</Radio>
              </RadioGroup>
            }
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="规格信息">
            {
              <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                <EditableTable onCheck={this.handleCheck} ref="editableTable">
                  <Table
                    rowKey="id"
                    pagination={false}
                    loading={loading}
                    dataSource={onlOnlineSpec}
                    columns={columns}
                  />
                </EditableTable>
              </div>
            }
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品主图">
            {
              <div className="clearfix">
                <Upload
                  action="/ise-svr/ise/upload"
                  listType="picture-card"
                  fileList={fileList}
                  name="multipartFile"
                  data={uploadData}
                  multiple={true}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  className="damaiQsmm"
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
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品轮播图">
            {
              <div className="clearfix">
                <Upload
                  action="/ise-svr/ise/upload"
                  listType="picture-card"
                  fileList={fileLists}
                  name="multipartFile"
                  data={uploadDatas}
                  multiple={true}
                  onPreview={this.handlePreviews}
                  onChange={this.handleChanges}
                  className="damaiSlideshow"
                >
                  {fileLists.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisibles} footer={null} onCancel={this.handleCancels}>
                  <img alt="example" style={{ width: '100%' }} src={previewImages} />
                </Modal>
              </div>
            }
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品详情">
            {
              <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                <BraftEditor {...editorProps} ref={instance => (this.editorInstance = instance)} />
              </div>
            }
          </FormItem>
        </Col>
      </Card>
    );
  }
}
