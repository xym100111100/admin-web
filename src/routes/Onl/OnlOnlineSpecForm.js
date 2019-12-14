import { Form, Table } from 'antd';
import OnlyPopupForm from 'components/Rebue/OnlyPopupForm';
import { connect } from 'dva';
import React, { Fragment, PureComponent, Divider } from 'react';
import styles from './OnlOnlineSpecFrom.less';
// 引入编辑器以及EditorState子模块
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ onlonline }) => ({
  onlonline,
}))
@OnlyPopupForm
export default class OnlOnlineSpecForm extends PureComponent {
  state = {
    onlOnlineSpec: [], // 规格列表
    mainImageUrl: undefined, // 主图
    fileLists: [], // 轮播图
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
    classification: '',
  };

  componentWillMount() {
    // 刷新系统
    this.props.dispatch({
      type: `onlonline/getById`,
      payload: {
        id: this.props.id,
      },
      callback: onlonline => {
        console.log('record', onlonline);
        let fileLists = new Array();
        let mainImageUrl;
        for (const pic of onlonline.record.onlinePicList) {
          if (pic.picType === 1) {
            mainImageUrl = '/ise-svr/files' + pic.picPath;
          } else {
            fileLists.push('/ise-svr/files' + pic.picPath);
          }
        }
        //整理属性名
        let attrNames = [];
        const onlineSpecAttrList = onlonline.record.onlOnlineSpecAttrList;
        for (let i = 0; i < onlineSpecAttrList.length; i++) {
          const attrName = onlineSpecAttrList[i].attrName;
          if (attrNames.indexOf(attrName) == -1) {
            attrNames.push(attrName);
          }
        }
        console.log('322333', attrNames);
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
        // console.log('1111', onlineSpecList);
        
        if (onlonline.record.subjectType === 2) {
          for (let i = 0; i < onlineSpecList.length; i++) {
            let buyPoint = onlineSpecList[i].buyPoint / 10;
            onlineSpecList[i].cashbackAmount = buyPoint;
          }
        }
        //确认商品类型
        let isBelowOnline ;
        const isBelow = onlonline.record.isBelow;
        const isOnline = onlonline.record.isOnline;
        if( isBelow ===0 && isOnline ===1){
          isBelowOnline = '线上';
        }else if(isBelow ===1 && isOnline ===0){
          isBelowOnline = '线下';
        }else if(isBelow ===1 && isOnline ===1){
          isBelowOnline = '既是线下也是线上'
        }
        //确认商品分类
        const searchCategoryMo = onlonline.record.searchCategoryMo;
        for (let i = 0; i < searchCategoryMo.length; i++) {
          this.getShopNames(searchCategoryMo[i]);
        }
        
        const { form, record } = this.props;
        //console.log(record.onlineDetail)
        form.setFieldsValue({ onlineName: onlonline.record.onlineTitle });
        this.setState({
          onlOnlineSpec: onlineSpecList,
          mainImageUrl,
          fileLists: fileLists,
          editorState: BraftEditor.createEditorState(record.onlineDetail),
          isBelowOnline: isBelowOnline,
          isOnlinePlatform: onlonline.record.isOnlinePlatform,
          attrNames: attrNames,
          isWeighGoods: onlonline.record.isWeighGoods,
        });
        this.onlineSpecColumn();
      },
    });
  }

  getShopNames = shopMessage => {
    //console.log('shopMessage', shopMessage);
    this.props.dispatch({
      type: 'slrshop/getById',
      payload: {
        id: shopMessage.shopId
      },
      callback: record => {
        //console.log('messageRecord', record);
        let classificationArr = { value: record.id, label: record.shopName };
        this.getClassifications(shopMessage,classificationArr);
      }
    });
  }

  getClassifications = (classification,classificationArr) => {
    //console.log("classification", classification);
    this.props.dispatch({
      type: 'onlonline/getTreeByShopId',
      payload: {
        shopId: classification.shopId
      },
      callback: record => {
        //console.log('record', record);
        let classificationNode = [];
        for (let i = 0; i < record.length; i++) {
          if (record[i].id === classification.id) {
            classificationNode.push(classificationArr);
            classificationNode.push({ value: record[i].id, label: record[i].name });
            break;
          }
          const rootNode = record[i].categoryList;
          let child = [];
          if (rootNode !== undefined) {
            child = this.checkChildNodes(rootNode, classification.id);
          }
          if (child !== undefined ) {
            classificationNode.push(classificationArr);
            classificationNode.push({ value: record[i].id, label: record[i].name });
            classificationNode=classificationNode.concat(child);
          }
        }
        //console.log("classificationArr02", classificationNode);
        this.setState({
          classificationArr:classificationNode
        });
        this.addClassification();
      }
    });
  }

  checkChildNodes = (node, nodeId) => {
    //父节点下所有的子节点
    const children = node;
    //console.log('children', children);
    //console.log('nodeId', nodeId);
    let childrenNode = [];
    if (children !== undefined) {
      for (let i = 0; i < children.length; i++) {
        let childNode = { value: children[i].id, label: children[i].name };
        //console.log('childNode', childNode);
        const child = children[i].categoryList;
        if (children[i].id === nodeId) {
          childrenNode=childNode;
          //console.log('childrenNode', childrenNode);
          return childrenNode;
        }
        let childenNode = [];
        if (child !== undefined) {
          childenNode = this.checkChildNodes(child, nodeId);
        }
        if (childenNode !== undefined && childenNode.length !==0) {
          //console.log('childenNode1', childenNode);
          childrenNode.push(childNode);
          childrenNode=childrenNode.concat(childenNode);
          //console.log('childrenNode2', childrenNode);
          return childrenNode;
        }
      }
    }
  }

  addClassification = () => {
    const { classificationArr } = this.state;
    console.log('aa',classificationArr);
    let shopAndClassification = '';
    shopAndClassification = '店铺:'+classificationArr[0].label + '|分类:';
    for (let i = 1; i < classificationArr.length; i++) {
      if (i !== 1) {
        shopAndClassification += '/';
      }
      shopAndClassification += classificationArr[i].label;
    }
    let classifications = this.state.classification;
    classifications +=shopAndClassification+';';
    console.log('classifications', classifications);
    this.setState({
      classification: classifications,
    })
  }


  //上线规格table表格
  onlineSpecColumn = () => {
    const { record } = this.props;
    const attrNames = this.state.attrNames;
    let columns = [
      {
        title: '规格名称',
        dataIndex: 'onlineSpec',
        align: 'center',
      },
      {
        title: '上线价格',
        dataIndex: 'salePrice',
        align: 'center',
      },
      {
        title: '成本价格',
        dataIndex: 'costPrice',
        align: 'center',
      },
      {
        title: '上线数量',
        dataIndex: 'currentOnlineCount',
        align: 'center',
      },
      {
        title: '限购数量',
        dataIndex: 'limitCount',
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'saleUnit',
        align: 'center',
      },
    ];

    if (record.subjectType === '0' || record.subjectType === 0) {
      columns.splice(3, 0, { title: '返现金额', dataIndex: 'cashbackAmount', align: 'center', });
    }

    //columns.splice(1, 0);
    for (let i = 0; i < attrNames.length; i++) {
      let column = {
        title: attrNames[i],
        dataIndex: 'onlineSpec' + (i + 1),
        align: 'center',
      };
      columns.splice(i+1, 0, column);
    }

    this.setState({
      columns: columns
    });
  }

  render() {
    const { record } = this.props;
    const { onlOnlineSpec, mainImageUrl, fileLists, editorState, isBelowOnline, isOnlinePlatform, columns ,shopName,classification,isWeighGoods} = this.state;
    console.log('aaa',isWeighGoods);
    // 不在工具栏显示的控件列表
    const excludeControls = [
      'undo', 'redo', 'separator',
      'font-size', 'line-height', 'letter-spacing', 'separator',
      'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
      'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
      'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
      'link', 'separator', 'hr', 'separator',
      'media', 'separator',
      'clear'
    ];

    return (
      <Fragment>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品名称">
          {<span>{record.onlineTitle}</span>}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上线板块">
          {<span>{record.subjectType === 0 ? '返现' : record.subjectType === 1 ?'全返':'返积分'}</span>}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品分类">
          {<span>{classification}</span>}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品类型">
          {<span>{isBelowOnline }</span>}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否上线到平台">
          {<span>{isOnlinePlatform === 0 ? '不上线' : '上线'}</span>}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品类型">
          {<span>{isWeighGoods === 0?'普通' : '称重'}</span>}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="规格信息">
          {
            <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
              <Table rowKey="id" pagination={false} dataSource={onlOnlineSpec} columns={columns} />
            </div>
          }
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品主图">
          {
            <div style={{ float: 'left', width: '104px', height: '104px', margin: '0 8px 8px 0' }}>
              <img style={{ width: '100%', height: '100%' }} src={mainImageUrl} />
            </div>
          }
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品轮播图">
          <div>
            {fileLists.map(url => {
              return (
                <div key={url} style={{ float: 'left', width: '104px', height: '104px', margin: '0 8px 8px 0' }}>
                  <img style={{ width: '100%', height: '100%' }} src={url} />
                </div>
              );
            })}
          </div>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品详情">
          {
            <div>
              <div style={{ float: 'left', width: '604px', height: '604px', margin: '0 8px 8px 0', border: 'solid 1px rgba(0, 0, 0, 0.25)' }}>
                <BraftEditor value={editorState} readOnly={true} excludeControls={excludeControls} />
              </div>
            </div>
          }
        </FormItem>
      </Fragment>
    );
  }
}
