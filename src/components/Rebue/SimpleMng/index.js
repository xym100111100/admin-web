import { PureComponent } from 'react';

// 简单的增删改查的管理函数
// 可编辑的管理页面
export default class SimpleMng extends PureComponent {
  state = {
    editForm: undefined,
    editFormType: undefined,
    editFormTitle: undefined,
    editFormRecord: {},
  };

  componentDidMount() {
    this.handleReload();
  }

  // 刷新
  handleReload(params) {
    if (params) {
      this.state.options = params;
    }
    const payload = this.state.options;

    // 刷新
    this.props.dispatch({
      type: `${this.moduleCode}/refresh`,
      payload,
    });
  }

  // 显示新建表单
  showAddForm(editForm, editFormTitle, editFormRecord) {
    if (!editFormRecord) editFormRecord = {};
    this.setState({
      editForm,
      editFormType: 'add',
      editFormRecord,
      editFormTitle,
    });
  }

  // 显示编辑表单
  showEditForm(id, moduleCode, editForm, editFormTitle) {
    this.props.dispatch({
      type: `${moduleCode}/getById`,
      payload: { id },
      callback: data => {
        this.setState({
          editForm,
          editFormType: 'edit',
          editFormTitle,
          editFormRecord: data.record,
        });
      },
    });
  }

  // 请求保存(添加或修改)
  handleSave(fields, moduleCode, record) {
    if (!record) record = {};
    Object.assign(record, fields);
    this.setState({ editFormRecord: record });
    let dispatchType;
    if (this.state.editFormType === 'add') {
      dispatchType = `${moduleCode}/add`;
    } else {
      dispatchType = `${moduleCode}/modify`;
    }
    this.props.dispatch({
      type: dispatchType,
      payload: { ...record },
      callback: () => {
        this.handleReload();
        // 关闭窗口
        this.setState({ editForm: undefined });
      },
    });
  }

  // 删除
  handleDel(record, moduleCode) {
    this.props.dispatch({
      type: `${moduleCode}/del`,
      payload: { id: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }
}
