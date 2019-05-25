import React from 'react';
import { connect } from 'dva';
import { Card, Row, message, Input, Form, Col, Table, Upload, Icon, Modal, Radio, Select, Tag, Tooltip, Cascader, Button } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import EditableTable from 'components/Rebue/EditableTable';
// 引入编辑器以及EditorState子模块
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ onlonline, BraftEditorUpload, prmpartner, slrshop }) => ({
  BraftEditorUpload,
  onlonline,
  prmpartner,
  slrshop,
}))
@Form.create()
@EditForm
export default class OnlineForm extends React.Component {
  componentWillMount() {
    const { record } = this.props;
    if (record.id !== undefined) this.getOnlines(record.id);
    this.partnerSearch();
    if (this.props.editFormType === "add") {
      this.setState({
        isEditSupplier: 1,
      })
    }
    this.onlineSpecColumn();
    this.getShopName();
    let height = document.body.clientHeight * 0.82;
    this.setState({
      windowsHeight: height,
    })
  }


  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    previewVisibles: false,
    previewImages: '',
    fileLists: [],
    subjectType: 0,
    deliveryType: 0,
    pledgeType: 1,
    onlOnlineSpec: [],
    partnerData: [],
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
    //是否能修改供应商,0：否,1：是,2：是，并修改该商品未结算的订单的供应商。
    isEditSupplier: 0,
    // 上线规格table表格
    columns: [],
    //是否上线到平台，0为不上线，1为上线
    isOnlinePlatform: 1,
    //是否为线下商品,0为否，1为是,2为既是线上也是线下
    isBelowOnline: 0,

    //标签
    tags: [],
    //标签动态生成和删除 ****开始***
    inputVisiable: false,
    inputValue: '',
    //标签动态生成和删除 ****结束***

    //分类信息级联选择禁用
    classificationDisable: true,

    //选择店铺
    shopName: [],
  };

  //查询卖家所有店铺
  getShopName = () => {
    this.props.dispatch({
      type: `slrshop/shopList`,
      callback: record => {
        //console.log('020202', record);
        let shopName = [];
        for (let i = 0; i < record.length; i++) {
          shopName.push({ value: record[i].id, label: record[i].shopName });
        }
        this.setState({
          shop: record,
          shopName: shopName,
        })
        if (shopName.length === 1) {
          this.onChangeShop();
        }
      }
    });
  }

  //选择店铺并获取分类树
  onChangeShop = value => {
    console.log('2525', value)
    if (this.state.shopName.length === 1) {
      value = [this.state.shopName[0].value];
    }
    this.setState({
      shopNames: value,
    })
    if (value.length === 0) {
      this.setState({
        classification: [],
        classificationDisable: true,
      });
      return;
    }
    this.props.dispatch({
      type: `onlonline/getTreeByShopId`,
      payload: {
        shopId: value[0],
      },
      callback: record => {
        //console.log('232323', record);
        let classification = [];
        for (let i = 0; i < record.length; i++) {
          let subclass = [];
          const categoryList = record[i].categoryList;
          for (let j = 0; j < categoryList.length; j++) {
            subclass.push({ value: categoryList[j].id, label: categoryList[j].name })
          }
          classification.push({ value: record[i].id, label: record[i].name, children: subclass });
        }
        //console.log('123123', classification);
        this.setState({
          classification: classification,
          classificationDisable: false,
        })
      }
    });

  }

  //获取分类信息
  onChangeClassification = value => {
    console.log('159951', value);
    const classificationId = value[value.length - 1];
    //console.log('555', classificationId);
    this.setState({
      classificationId: classificationId,
      classificationArr: value
    });

  }
  // 上线规格table表格
  onlineSpecColumn = () => {
    let { columns, subjectType, tags } = this.state;
    columns = [
      {
        title: '规格名称',
        dataIndex: 'onlineSpec',
        align: 'center',
        width: '90px',
      },
      {
        title: '上线价格',
        dataIndex: 'salePrice',
        align: 'center',
        width: '90px',
      },
      {
        title: '成本价格',
        dataIndex: 'costPrice',
        align: 'center',
        width: '90px',
      },
      {
        title: '返现金额',
        dataIndex: 'cashbackAmount',
        align: 'center',
        width: '90px',
      },
      {
        title: '本次上线数量',
        dataIndex: 'currentOnlineCount',
        align: 'center',
        width: '90px',
      },
      {
        title: '限购数量',
        dataIndex: 'limitCount',
        align: 'center',
        width: '90px',
      },
      {
        title: '单位',
        dataIndex: 'saleUnit',
        align: 'center',
        width: '90px',
      },
    ];
    // 如果板块类型为全返时，去掉返现金额
    if (subjectType === 1) {
      columns.splice(3, 1);
    }
    if (tags.length !== 0) {
      for (let i = 0; i < tags.length; i++) {
        let column = {
          title: tags[i],
          dataIndex: 'onlineSpec' + (i + 1),
          align: 'center',
          width: '90px',
        };
        columns.splice(i+1, 0, column);
      }
    }
    this.setState({
      columns: columns
    });
  }

  // 获取上线信息包括：上线信息、规格信息、图片信息等
  getOnlines = id => {
    this.props.dispatch({
      type: `onlonline/getById`,
      payload: {
        id: id,
      },
      callback: onlonline => {
        console.log('获取', onlonline);
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
        //整理属性名
        let attrNames = [];
        const onlineSpecAttrList = onlonline.record.onlOnlineSpecAttrList;
        for (let i = 0; i < onlineSpecAttrList.length; i++) {
          const attrName = onlineSpecAttrList[i].attrName;
          if (attrNames.indexOf(attrName) == -1) {
            attrNames.push(attrName);
          }
        }
        //console.log('322333',attrNames);
        //整理属性值
        let onlineSpecList = onlonline.record.onlineSpecList;
        for (let i = 0; i < onlineSpecList.length; i++) {
          const onlineSpecListId = onlineSpecList[i].id;
          for (let x = 0; x < onlineSpecAttrList.length; x++) {
            const attrName = onlineSpecAttrList[x].attrName;
            const attrValue = onlineSpecAttrList[x].attrValue;
            if (onlineSpecListId === onlineSpecAttrList[x].onlineSpecId) {
              for (let j = 0; j < attrNames.length; j++) {
                if (attrNames[j] === attrName) {
                  const value = j + 1;
                  eval('onlineSpecList[' + i + '].onlineSpec' + value + '=attrValue');
                }
              }
            }
          }
        }

        //确认商品类型
        let isBelowOnline;
        const isBelow = onlonline.record.isBelow;
        const isOnline = onlonline.record.isOnline;
        if (isBelow === 0 && isOnline === 1) {
          isBelowOnline = 0;
        } else if (isBelow === 1 && isOnline === 0) {
          isBelowOnline = 1;
        } else if (isBelow === 1 && isOnline === 1) {
          isBelowOnline = 2;
        }

        //console.log('88888', attrNames);

        //确认商品分类
        const searchCategoryMo = onlonline.record.searchCategoryMo;
        this.getShopNameById(searchCategoryMo.shopId);
        this.getClassification(searchCategoryMo.shopId, searchCategoryMo.id);

        const { form } = this.props;
        form.setFieldsValue({ onlineName: onlonline.record.onlineTitle });
        this.setState({
          subjectType: onlonline.record.subjectType,
          deliveryType: onlonline.record.deliveryType,
          onlOnlineSpec: Array.from(onlineSpecList),
          previewVisible: false,
          previewImage: '',
          fileList: fileList,
          previewVisibles: false,
          previewImages: '',
          fileLists: fileLists,
          onlineDetail: BraftEditor.createEditorState(onlineDetail),
          isBelowOnline: isBelowOnline,
          isOnlinePlatform: onlonline.record.isOnlinePlatform,
          tags: attrNames,
        });
        this.onlineSpecColumn();
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
  uploadFn = value => {
    this.props.dispatch({
      type: `BraftEditorUpload/upload`,
      payload: {
        moduleName: 'goodsDetail',
        value,
      },
    });
  };

  handleCheck = record => {
    // 验证价格是否大于0
    const reg = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

    if(!record.onlineSpec){
      message.error('请输入规格名称');
      return false;
    }

    const tags = this.state.tags;
    if (tags.length !== 0) {
      for (let i = 0; i < tags.length; i++) {
        let value = i + 1;
        let onlineSpec = 'onlineSpec' + value;
        if (!eval('record.' + onlineSpec)) {
          message.error('请输入' + tags[i] + '的属性值');
          return false;
        }
      }
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
    const regs = /^(0|\+?[1-9][0-9]*)$/;
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

  //******标签的添加与删除，开始******
  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    //console.log(tags);
    this.setState({ tags });
    setTimeout(() => {
      this.onlineSpecColumn();
    }, 1);
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    //console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    setTimeout(() => {
      this.onlineSpecColumn();
    }, 1);
  }

  saveInputRef = input => this.input = input
  //*******标签的添加与删除，结束********

  //查询店铺信息
  getShopNameById = shopId => {
    this.props.dispatch({
      type: `slrshop/getById`,
      payload: {
        id: shopId,
      },
      callback: record => {
        let shopName = [];
        shopName.push(record.id);
        this.setState({
          shopNames: shopName,
        })
        this.onChangeShop(shopName);
      }
    });
  }

  //查询分类树
  getClassification = (shopId, id) => {
    this.props.dispatch({
      type: `onlonline/getTreeByShopId`,
      payload: {
        shopId: shopId,
      },
      callback: record => {
        let classification = [];
        for (let i = 0; i < record.length; i++) {
          const categoryList = record[i].categoryList;
          for (let j = 0; j < categoryList.length; j++) {
            if (categoryList[j].id === id) {
              classification.push(record[i].id);
              classification.push(categoryList[j].id);
            }
          }
        }
        const classificationId = classification[classification.length - 1];
        this.setState({
          classificationDisable: false,
          shopClassification: classification,
          classificationId: classificationId,
          classificationArr: classification
        })
      }
    });
  }


  showCustomizeAttr = () => {
    const { tags, inputVisible, inputValue, } = this.state;
    return (
      <Col md={23} sm={23}>
        <p style={{ color: 'black' }}>&nbsp;自定义规格属性名:</p>
        <div>
          <span>&emsp;</span>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)} color="blue">
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus" /> 点击添加属性名
          </Tag>
          )}
        </div>
      </Col>
    )
  }

  //显示分类信息
  showClassification = () => {
    const { loading, form, record } = this.props;
    if (this.state.shopName.length >= 2) {
      return (
        <Col md={24} sm={24} >
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="店铺信息">
            <Cascader style={{ width: '250px' }} value={this.state.shopNames} options={this.state.shopName} onChange={this.onChangeShop} placeholder="请选择店铺" changeOnSelect />
          </FormItem>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="分类信息">
            {form.getFieldDecorator('classificationId', {
              initialValue: this.state.shopClassification
            })(
              <Cascader style={{ width: '384px' }} options={this.state.classification} onChange={this.onChangeClassification} placeholder="请先选择店铺再选择分类信息" disabled={this.state.classificationDisable} changeOnSelect />
            )}
            <Button type="ghost" href="#/slr/slr-shop-mng" >添加商品分类</Button>
          </FormItem>
        </Col>
      );
    } else {
      return (
        <div >
          <Col md={24} sm={24}>
            <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="分类信息" >
              {form.getFieldDecorator('classificationId', {
                initialValue: this.state.shopClassification
              })(
                <Cascader style={{ width: '384px' }} options={this.state.classification} onChange={this.onChangeClassification} placeholder="请选择分类信息" changeOnSelect />
              )}
              <Button type="ghost" href="#/slr/slr-shop-mng">添加商品分类</Button>
            </FormItem>
          </Col>
        </div>
      )
    }
  }

  //显示是否修改供应商组件
  showIsEditSupplier = () => {
    const { form } = this.props;
    const { isEditSupplier } = this.state;
    if (this.props.editFormType === "add") {
      return (
        <Col md={14} sm={24} style={{ display: 'none' }} >
          <FormItem label="能否修改">
            {form.getFieldDecorator('isEditSupplier', {
              initialValue: 0,
            })(
              <RadioGroup onChange={this.setEditSupplier} value={isEditSupplier}>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
                <Radio value={2}>是,且修改该商品未结算订单的供应商,发货组织</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Col>
      )
    } else {
      return (
        <Col md={14} sm={24} >
          <FormItem label="能否修改">
            {form.getFieldDecorator('isEditSupplier', {
              initialValue: 0,
            })(
              <RadioGroup onChange={this.setEditSupplier} value={isEditSupplier}>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
                <Radio value={2}>是,且修改该商品未结算订单的供应商,发货组织</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Col>
      )
    }
  }

  // 选择板块类型事件
  onChangeRadio = e => {
    let { columns } = this.state;
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      // 如果板块类型为全返和上线规格的table表格里面有返现金额时，则删除该字段
      if (column.dataIndex === 'cashbackAmount' && e.target.value === 1) {
        columns.splice(i, 1);
      }
      // 判断板块类型为普通返现时，判断成本价格下一个是否为返现金额，如果不是则加上
      if (column.dataIndex === 'costPrice' && e.target.value === 0) {
        if (columns[i + 1].dataIndex !== 'cashbackAmount') {
          let cashbackAmount = {
            title: '返现金额',
            dataIndex: 'cashbackAmount',
            align: 'center',
            width: '90px',
          };
          columns.splice(i + 1, 0, cashbackAmount);
        }
      }
    }

    this.setState({
      subjectType: e.target.value,
      columns
    });
  };

  //选择商品类型事件
  onChangeBelowOnline = data => {
    this.setState({
      isBelowOnline: data.target.value
    })
  }

  //选择是否上线到平台
  onChangeOnlinePlatform = data => {
    this.setState({
      isOnlinePlatform: data.target.value
    })
  }

  // 选择发货类型事件
  onChangeDeliveryTypeRadio = e => {
    this.setState({
      deliveryType: e.target.value,
    });
  }

  // 富文本框编辑事件
  handleEditorChange = editorState => {
    this.setState({ onlineDetail: editorState });
  };

  //设置是否能修改供应商
  setEditSupplier = e => {
    this.setState({
      isEditSupplier: e.target.value,
    });
  }

  customizeAttr = () => {
    console.log(111);
    let attrName = document.getElementById("attrName").value.trim();
    if (attrName === null || attrName === undefined || attrName === '') {
      message.error("请输入属性名");
      return;
    }

    // 上线规格table表格
    let { columns, subjectType } = this.state;

    for (let i = 0; i < columns.length; i++) {
      const element = columns[i];
      console.log(element)
      if (element.dataIndex === 'salePrice') {
        let column = {
          title: attrName,
          dataIndex: 'onlineSpec' + i - 1,
          align: 'center',
          width: '90px',
        };

        columns.splice(i - 1, 0, column);
        break;
      }
    }

    this.setState({ columns });
  }

  // 提交前事件
  beforeSave = () => {
    const { form, record } = this.props;
    // 产品id
    let productId = record.productId === undefined ? 0 : record.productId;
    // 上线商品名称
    let onlineName = undefined;
    let supplierId = undefined;
    let isEditSupplier = undefined;
    form.validateFields((err, values) => {
      onlineName = values.onlineName;
      supplierId = values.supplierId;
      isEditSupplier = values.isEditSupplier;
    });
    if (onlineName === undefined || onlineName === null || onlineName === '') return message.error('请输入商品名称');
    if (supplierId === undefined || supplierId === null || supplierId === '') return message.error('请选择供应商');

    const { fileList, fileLists, onlineDetail, subjectType, deliveryType, classificationId, classificationArr } = this.state;
    let detailHtml = onlineDetail.toHTML().replace(/<div\/?.+?>/g, '');
    let onlineDetails = detailHtml.replace(/<\/div>/g, '');

    let deliverOrgId = 0;
    if (deliveryType === 1) {
      deliverOrgId = supplierId;
    }

    // 上线规格信息
    const onlineSpecs = this.refs.editableTable.getRecords();
    if (onlineSpecs === undefined || onlineSpecs.length === 0) return message.error('请输入商品规格信息');

    if (fileList === undefined || fileList.length === 0) return message.error('请上传商品主图');

    if (fileLists === undefined || fileLists.length === 0) return message.error('请上传至少一张商品轮播图');

    if (onlineDetail === undefined || onlineDetail === '' || onlineDetail === null)
      return message.error('商品详情不能为空');
    if (onlineDetail.length > 2400) return message.error('商品详情字数不能大于2400个字');

    if (classificationId === undefined || classificationId === '' || classificationId === null) return message.error('请选择商品分类');
    console.log('333',classificationArr);
    if (classificationArr.length !== 2) return message.error('请选择商品一级分类和二级分类');

    let qsmm = fileList[0].response === undefined ? fileList[0].name : fileList[0].response.filePaths[0];
    let slideshows = new Array();
    for (let i = 0; i < fileLists.length; i++) {
      let slideshow = fileLists[i].response === undefined ? fileLists[i].name : fileLists[i].response.filePaths[0];
      slideshows.push({
        slideshow: slideshow,
      });
    }

    form.getFieldDecorator('isEditSupplier');
    form.getFieldDecorator('subjectType');
    form.getFieldDecorator('onlineSpecs');
    form.getFieldDecorator('goodsQsmm');
    form.getFieldDecorator('slideshow');
    form.getFieldDecorator('onlineDetail');
    form.getFieldDecorator('productId');
    form.getFieldDecorator('onlineId');
    form.getFieldDecorator('supplierId');
    form.getFieldDecorator('deliverOrgId');
    form.getFieldDecorator('isOnlinePlatform');
    form.getFieldDecorator('isBelowOnline');
    form.getFieldDecorator('tags');
    form.getFieldDecorator('classificationId');
    form.setFieldsValue({
      isEditSupplier: isEditSupplier,
      onlineId: record.id,
      onlineName: onlineName,
      subjectType: subjectType,
      onlineSpecs: onlineSpecs,
      goodsQsmm: qsmm,
      slideshow: slideshows,
      onlineDetail: onlineDetails,
      productId: productId,
      supplierId: supplierId,
      deliverOrgId: deliverOrgId,
      isOnlinePlatform: this.state.isOnlinePlatform,
      isBelowOnline: this.state.isBelowOnline,
      tags: this.state.tags,
      classificationId: this.state.classificationId,
    });
  };

  render() {
    const { loading, form, record } = this.props;
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
      isEditSupplier,
      columns,
    } = this.state;

    // 商品主图、轮播图上传图标
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text" />
      </div>
    );

    // 不在工具栏显示的控件列表
    const excludeControls = [
      'undo', 'redo', 'separator',
      'font-size', 'line-height', 'letter-spacing', 'separator',
      'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
      'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
      'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
      'link', 'separator', 'hr', 'separator', 'separator',
    ];

    // 富文本框功能配置
    const editorProps = {
      value: onlineDetail,
      excludeControls: excludeControls,
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
      <div style={{ height: this.state.windowsHeight }}>

        <Card style={{ width: '95vw', margin: '0 auto' }}>

          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={24} sm={24} >
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="商品名称">
                {form.getFieldDecorator('onlineName', {})(
                  <Input style={{ width: '500px' }} placeholder="请输入商品的名称" />
                )}
              </FormItem>
            </Col>
            {this.showClassification()}

            <Col md={24} sm={24} >
              <Form layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                  <Col md={1} sm={1}></Col>
                  <Col md={7} sm={23} style={{ marginLeft: -13 }}>
                    <FormItem label="供应商名称">
                      {form.getFieldDecorator('supplierId', {
                        rules: [{ required: true, message: "请选择供应商" }],
                        initialValue: record.supplierId
                      })(
                        <Select
                          disabled={isEditSupplier === 0 ? true : false}
                          showSearch
                          placeholder={record.supplierName === undefined ? "请输入供应商名称" : record.supplierName}
                          style={{ width: 250 }}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          filterOption={false}
                          onSearch={this.partnerSearch}
                          notFoundContent="没有可选择的供应商"
                        >
                          {partnerData.map(d => <Option key={d.orgId}>{d.partnerName}</Option>)}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  {this.showIsEditSupplier()}
                </Row>
              </Form>
            </Col>
            <Col md={24} sm={24} >
              <br />
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="发货类型">
                {
                  <RadioGroup onChange={this.onChangeDeliveryTypeRadio} value={this.state.deliveryType}>
                    <Radio.Button value={0}>自发</Radio.Button>
                    <Radio.Button value={1}>供应商</Radio.Button>
                  </RadioGroup>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24} >
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="上线板块">
                {
                  <RadioGroup onChange={this.onChangeRadio} value={this.state.subjectType}>
                    <Radio.Button value={0}>返现</Radio.Button>
                    <Radio.Button value={1}>全返</Radio.Button>
                  </RadioGroup>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24} >
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="商品类型">
                {
                  <RadioGroup onChange={this.onChangeBelowOnline} value={this.state.isBelowOnline} >
                    <Radio.Button value={0}>线上商品</Radio.Button>
                    <Radio.Button value={1}>线下商品</Radio.Button>
                    <Radio.Button value={2}>既是线上也是线下</Radio.Button>
                  </RadioGroup>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24} >
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 10 }} label="显示设置" >
                {
                  <RadioGroup onChange={this.onChangeOnlinePlatform} value={this.state.isOnlinePlatform}>
                    <Radio.Button value={1}>上线到平台</Radio.Button>
                    <Radio.Button value={0}>不上线到平台</Radio.Button>
                  </RadioGroup>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="规格信息">
                {
                  <div>
                    <br />
                    <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)', marginLeft: -70 }}>
                      {
                        columns.length === 0 ? <div id="skuDivId"></div> :
                          <div id="skuDivId">
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
                    </div>
                  </div>
                }
              </FormItem>
            </Col>
            <Col md={1} sm={1}></Col>
            {this.showCustomizeAttr()}
            <Col md={24} sm={24}>
              <br />
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品主图">
                {
                  <div className="clearfix">
                    <Upload
                      action="/ise-svr/ise/upload"
                      // action="http://192.168.1.3:20180/ise/upload"
                      listType="picture-card"
                      fileList={fileList}
                      name="multipartFile"
                      data={uploadData}
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
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品轮播图">
                {
                  <div className="clearfix">
                    <Upload
                      action="/ise-svr/ise/upload"
                      // action="http://192.168.1.3:20180/ise/upload"
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
                      <img alt="example" src={previewImages} />
                    </Modal>
                  </div>
                }
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label="商品详情">
                {
                  <div>
                    <br />
                    <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                      <BraftEditor {...editorProps} ref={instance => (this.editorInstance = instance)} />
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
