import { Form, Table } from 'antd';
import OnlyPopupForm from 'components/Rebue/OnlyPopupForm';
import { connect } from 'dva';
import React, { Fragment, PureComponent } from 'react';
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
  };

  componentWillMount() {
    // 刷新系统
    this.props.dispatch({
      type: `onlonline/getById`,
      payload: {
        id: this.props.id,
      },
      callback: onlonline => {
        let fileLists = new Array(); 
        let mainImageUrl;
        for (const pic of onlonline.record.onlinePicList) {
          if (pic.picType === 1) {
            mainImageUrl = '/ise-svr/files' + pic.picPath;
          } else {
            fileLists.push('/ise-svr/files' + pic.picPath);
          }
        }
        const { form, record } = this.props;
        console.log(record.onlineDetail)
        form.setFieldsValue({ onlineName: onlonline.record.onlineTitle });
        this.setState({
          onlOnlineSpec: Array.from(onlonline.record.onlineSpecList),
          mainImageUrl,
          fileLists: fileLists,
          editorState: BraftEditor.createEditorState(record.onlineDetail),
        });
      },
    });
  }
  render() {
    const { record } = this.props;
    const { onlOnlineSpec, mainImageUrl, fileLists, editorState } = this.state;

    const columns = [
      {
        title: '规格名称',
        dataIndex: 'onlineSpec',
      },
      {
        title: '上线价格',
        dataIndex: 'salePrice',
      },
      {
        title: '成本价格',
        dataIndex: 'costPrice',
      },
      {
        title: '上线数量',
        dataIndex: 'currentOnlineCount',
      },
      {
        title: '限购数量',
        dataIndex: 'limitCount',
      },
      {
        title: '单位',
        dataIndex: 'saleUnit',
      },
    ];

    if (record.subjectType === '0' || record.subjectType === 0) {
      columns.splice(3, 0, { title: '返现金额', dataIndex: 'cashbackAmount' });
    }

    // 不在工具栏显示的控件列表
    const excludeControls = [
      'undo', 'redo', 'separator',
      'font-size', 'line-height', 'letter-spacing', 'separator',
      'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
      'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
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
          {<span>{record.subjectType === 0 ? '返现' : '全返'}</span>}
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
                  <BraftEditor value={editorState} readOnly={true} excludeControls={excludeControls}/>
                </div>
            </div>
          }
        </FormItem>
      </Fragment>
    );
  }
}
