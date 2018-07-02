import { PureComponent } from 'react';
import TreeUtils from '../../../utils/TreeUtils';

// 可编辑的管理页面
export default class EditMng extends PureComponent {
  componentDidMount() {
    this.handleReload();
  }

  // 刷新
  handleReload(params) {
    this.setState({
      editType: 'none', // 'add','edit'
      editRecord: undefined,
    });

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

  // 反向绑定编辑框改变的值到state
  handleFieldChange(fieldName, fieldValue) {
    const { editRecord } = this.state;
    editRecord[fieldName] = fieldValue;
  }

  // 处理编辑框按键（回车保存）
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSave();
    }
  }

  cancelEdit() {
    const { editType, editRecord } = this.state;
    if (editType === 'add') {
      // 克隆新数组
      TreeUtils.delById(this.getList(), editRecord.id);
    }

    this.setState({
      editType: 'none',
      editRecord: undefined,
    });
  }

  // 请求保存(添加或修改)
  handleSave() {
    const { editType, editRecord } = this.state;
    if (!this.validate()) return;
    let dispatchType;
    if (editType === 'add') {
      dispatchType = `${this.moduleCode}/add`;
    } else {
      dispatchType = `${this.moduleCode}/modify`;
    }
    this.props.dispatch({
      type: dispatchType,
      payload: { ...editRecord },
      callback: () => {
        this.handleReload();
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
      },
    });
  }
}
