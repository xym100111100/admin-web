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
      Object.assign(this.state.options, params);
    }
    const payload = this.state.options;

    // 刷新
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload,
    });
  }

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handleReload({ ...fieldsValue });
    });
  };

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
        state.editFormRecord = data.record || data;
        this.setState(state);
      },
    });
  }

  // 请求保存(添加或修改)
  handleSave(params) {
    const defaultParams = {
      fields: undefined,
      moduleCode: this.moduleCode,
      isReturn: false, // 默认不返回主页面
      isReset: false, // 是否重置
    };

    const { moduleCode, fields, isReturn, isReset } = Object.assign(defaultParams, params);

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
        if (isReset) {
          this.handelReset();
        }
        if (isReturn)
          // 关闭窗口
          this.setState({ editForm: undefined });
      },
    });
  }

  // 请求保存并开始添加下一条
  handleNext(params) {
    const temp = params;
    temp.isReturn = true;
    this.handleSave(temp);
  }

  // 请求保存提交(添加或修改)
  handleSubmit(params) {
    const temp = params;
    temp.isReturn = true;
    this.handleSave(temp);
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
