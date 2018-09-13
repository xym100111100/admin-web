import { PureComponent } from 'react';

// 简单的增删改查的管理函数
// 可编辑的管理页面
export default class SimpleMng extends PureComponent {
  state = {
    editForm: undefined,
    editFormType: undefined, // add-添加 edit-编辑
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
    // 如果是查询form的提交
    if (e.preventDefault) {
      e.preventDefault();
      const { form } = this.props;

      form.validateFields((err, fieldsValue) => {
        if (err) return;
        this.handleReload({ ...fieldsValue });
      });
    } else {
      // 否则是直接传值的查询
      this.handleReload({ keys: e });
    }
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
      getByIdMethodName: 'getById', // 初始化的时候通过getById请求获取记录，设undefined不调用
    };
    const { id, moduleCode, getByIdMethodName, ...state } = Object.assign(defaultParams, params);
    if (getByIdMethodName) {
      this.props.dispatch({
        type: `${moduleCode}/${getByIdMethodName}`,
        payload: { id },
        callback: data => {
          state.editFormRecord = data.record || data;
          this.setState(state);
        },
      });
    } else {
      this.setState(state);
    }
  }

  // 请求保存(添加或修改)
  handleSave(params) {
    const defaultParams = {
      fields: undefined,
      moduleCode: this.moduleCode,
      saveMethodName: undefined, // string 保存时调用的方法
      isReload: true, // 默认请求成功后刷新主页面（）
      isReturn: false, // 默认不返回主页面（handleSubmit后需要返回）
      isReset: false, // 默认不重置（handleNext后需要重置）
      callback: undefined, // 保存成功后回调
    };

    const { moduleCode, saveMethodName, fields, isReturn, isReset, callback } = Object.assign(defaultParams, params);

    // this.setState({ editFormRecord: fields });
    let dispatchType;
    if (saveMethodName) {
      dispatchType = `${moduleCode}/${saveMethodName}`;
    } else if (this.state.editFormType === 'add') {
      dispatchType = `${moduleCode}/add`;
    } else if (this.state.editFormType === 'edit') {
      dispatchType = `${moduleCode}/modify`;
    } else {
      throw '不能识别editFormType的类型';
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
        if (callback) callback();
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
