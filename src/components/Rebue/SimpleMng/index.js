import { PureComponent } from 'react';

// 简单的增删改查的管理函数
// 可编辑的管理页面
export default class SimpleMng extends PureComponent {
  state = {
    editFormType: undefined,
    editFormTitle: undefined,
    editFormVisable: false,
    editFormRecord: {},
  };

  componentDidMount() {
    this.handleReload();
  }

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
  showAddForm() {
    this.setState({
      editFormType: 'add',
      editFormRecord: {},
      editFormTitle: `添加新${this.moduleName}`,
      editFormVisable: true,
    });
  }

  // 显示编辑表单
  showEditForm(id) {
    this.props.dispatch({
      type: `${this.moduleCode}/getById`,
      payload: { id },
      callback: data => {
        this.setState({
          editFormType: 'edit',
          editFormRecord: data.record,
          editFormTitle: `编辑${this.moduleName}信息`,
          editFormVisable: true,
        });
      },
    });
  }

  // 请求保存(添加或修改)
  handleSave(fields) {
    this.setState({ editFormRecord: fields });
    let dispatchType;
    if (this.state.editFormType === 'add') {
      dispatchType = `${this.moduleCode}/add`;
    } else {
      dispatchType = `${this.moduleCode}/modify`;
    }
    this.props.dispatch({
      type: dispatchType,
      payload: { ...fields },
      callback: () => {
        this.handleReload();
        // 关闭窗口
        this.setState({ editFormVisable: false });
      },
    });
  }

  // 删除
  handleDel(id) {
    this.props.dispatch({
      type: `${this.moduleCode}/del`,
      payload: { id },
      callback: () => {
        this.handleReload();
        // 关闭窗口
        this.setState({ editFormVisable: false });
      },
    });
  }
}
