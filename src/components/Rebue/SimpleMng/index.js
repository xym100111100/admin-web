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
      type: `${this.moduleCode}/list`,
      payload,
    });
  }

  // 显示新建表单
  showAddForm(params) {
    const defaultParams = {
      editFormType: 'add',
      editForm: undefined,
      editFormTitle: undefined,
      editFormRecord: {},
    };
    this.setState(Object.assign(defaultParams, params));
  }

  // 显示编辑表单
  showEditForm(params) {
    const defaultParams = {
      id: undefined,
      moduleCode: this.moduleCode,
      editFormType: 'edit',
      editForm: undefined,
      editFormTitle: undefined,
    };
    const { id, moduleCode, ...state } = Object.assign(defaultParams, params);

    this.props.dispatch({
      type: `${moduleCode}/getById`,
      payload: { id },
      callback: data => {
        state.editFormRecord = data.record;
        this.setState(state);
      },
    });
  }

  // 请求保存(添加或修改)
  handleSave(params) {
    const defaultParams = {
      fields: undefined,
      moduleCode: this.moduleCode,
    };

    const { moduleCode, fields } = Object.assign(defaultParams, params);

    this.setState({ editFormRecord: fields });
    let dispatchType;
    if (this.state.editFormType === 'add') {
      dispatchType = `${moduleCode}/add`;
    } else {
      dispatchType = `${moduleCode}/modify`;
    }
    this.props.dispatch({
      type: dispatchType,
      payload: { ...fields },
      callback: () => {
        this.handleReload();
        // 关闭窗口
        this.setState({ editForm: undefined });
      },
    });
  }

  // 删除
  handleDel(record, moduleCode = this.moduleCode) {
    this.props.dispatch({
      type: `${moduleCode}/del`,
      payload: { id: record.id },
      callback: () => {
        this.handleReload();
      },
    });
  }
}
