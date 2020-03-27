/**
 * 可编辑的表格
 */
import { Button, Divider, Input, Popconfirm, Tooltip } from 'antd';
import { Fragment, PureComponent } from 'react';
import ArrayUtils from '../../../utils/ArrayUtils';
import ObjectUtils from '../../../utils/ObjectUtils';

/**
 * 可编辑的表格
 */
export default class EditableTable extends PureComponent {
  state = {
    editType: 'none', // 编辑类型，默认 none-浏览，还可以是 add-添加, modify-修改
    editRecord: undefined, // 当前编辑的记录
    editRowIndex: undefined, // 记录当前编辑的行
  };

  /**
   * 初始化表格的列
   */
  initColums = () => {
    const { children } = this.props;
    const columns = children.props.columns;
    // 给每列加上渲染方法
    columns.forEach(item => {
      item.render = (text, record, index) => {
        const { editRowIndex } = this.state;
        // 渲染浏览状态的数据列
        if (this.state.editType === 'none' || editRowIndex !== index) return text;
        else {
          // 渲染可编辑状态的数据列
          return (
            <Input
              defaultValue={text}
              placeholder={item.title}
              onChange={e => this.handleFieldChange(item.dataIndex, e.target.value)}
              onKeyPress={e => {
                return this.handleKeyPress(e, item);
              }}
            />
          );
        }
      };
    });

    // 添加排序列
    columns.push({
      title: '排序',
      align: 'center',
      width: '100px',
      render: (text, record, index) => {
        // 渲染浏览状态的排序列
        if (this.state.editType === 'none') return this.renderSortColumn(index);
      },
    });

    // 添加操作列
    columns.push({
      title: '操作',
      align: 'center',
      width: 120,
      render: (text, record, index) => {
        const { editRowIndex } = this.state;
        // 渲染浏览状态的操作列或可编辑状态时编辑行不是当前行)
        if (this.state.editType === 'none' || editRowIndex !== index) return this.renderActionColumnOfBrowsable(index);
        else
          // 渲染可编辑状态的操作列
          return this.renderActionColumnOfEditable();
      },
    });
  };

  /**
   * 处理上移事件
   */
  handleUp = rowIndex => {
    const { children } = this.props;
    const { dataSource: records } = children.props;
    ArrayUtils.removeUp(records, rowIndex);
    this.forceUpdate();
  };

  /**
   * 处理下移事件
   */
  handleDown = rowIndex => {
    const { children } = this.props;
    const { dataSource: records } = children.props;
    ArrayUtils.removeDown(records, rowIndex);
    this.forceUpdate();
  };

  /**
   * 新记录
   */
  newRecord = () => {
    const { children } = this.props;
    const { dataSource: records } = children.props;
    const record = { id: new Date().getTime() };
    records.push(record);
    return record;
  };

  /**
   * 处理添加新记录事件
   */
  handleAdd = () => {
    const { editType } = this.state;
    const { children } = this.props;
    const { dataSource: records } = children.props;
    if (editType === 'modify') {
      if (!this.ok()) return;
    }
    const record = this.newRecord();
    this.setState({
      editType: 'add',
      editRowIndex: records.length - 1,
      editRecord: { ...record }, // 深一层复制
    });
  };

  /**
   * 处理编辑事件
   */
  handleEdit = rowIndex => {
    const { editType, editRecord, editRowIndex } = this.state;
    const { children } = this.props;
    const { dataSource: records } = children.props;
    if (editType === 'add') {
      if (ObjectUtils.equals(editRecord, records[editRowIndex])) {
        this.handleCancel();
      } else {
        if (!this.ok()) return;
      }
    } else if (editType === 'modify') {
      if (!this.ok()) return;
    }
    this.setState({
      editType: 'modify',
      editRowIndex: rowIndex,
      editRecord: { ...records[rowIndex] }, // 深一层复制
    });
  };

  /**
   * 处理删除事件
   */
  handleDel = rowIndex => {
    const { editType, editRecord, editRowIndex } = this.state;
    const { children } = this.props;
    const { dataSource: records } = children.props;
    if (editType === 'add') {
      if (ObjectUtils.equals(editRecord, records[editRowIndex])) {
        this.handleCancel();
      } else {
        if (!this.ok()) return;
      }
    } else if (editType === 'modify') {
      if (!this.ok()) return;
    }
    ArrayUtils.delByIndex(records, rowIndex);
    this.forceUpdate();
  };

  /**
   * 反向绑定编辑框改变的值到state
   */
  handleFieldChange = (fieldName, fieldValue) => {
    const { editRecord } = this.state;
    editRecord[fieldName] = fieldValue;
  };

  /**
   * 处理编辑框按键（回车保存）
   */
  handleKeyPress = (e, col) => {
    if (e.key === 'Enter') {
      this.handleOk(col);
    }
  };

  /**
   * 处理确认事件(由回车键或鼠标点击确认按钮触发的事件)
   */
  handleOk = col => {
    if (!this.ok(col)) return;
    // 继续添加
    this.handleAdd();
  };

  /**
   * 确认
   */
  ok = col => {
    const { onCheck } = this.props;
    const { editRecord, editRowIndex } = this.state;
    const { children } = this.props;
    const { dataSource: records } = children.props;

    // 检查数据是否正确
    if (!onCheck(editRecord, col)) return false;
    // 将编辑的记录赋值改变真正的记录
    records[editRowIndex] = { ...editRecord }; // 深一层复制

    this.setState({
      editType: 'none',
      editRecord: undefined,
      editRowIndex: undefined,
    });
    return true;
  };

  /**
   * 处理取消事件
   */
  handleCancel = () => {
    const { editType, editRowIndex } = this.state;
    const { children } = this.props;
    const { dataSource: records } = children.props;
    if (editType === 'add') {
      ArrayUtils.delByIndex(records, editRowIndex);
    }
    this.setState({
      editType: 'none',
      editRecord: undefined,
      editRowIndex: undefined,
    });
  };

  /**
   * 获取数据
   */
  getRecords = () => {
    const { editType, editRecord, editRowIndex } = this.state;
    const { children } = this.props;
    const { dataSource: records } = children.props;
    if (editType === 'add') {
      if (ObjectUtils.equals(editRecord, records[editRowIndex])) {
        this.handleCancel();
      } else {
        if (!this.ok()) return undefined;
      }
    } else if (editType === 'modify') {
      if (!this.ok()) return undefined;
    }
    return records;
  };

  /**
   * 渲染排序列
   */
  renderSortColumn = rowIndex => {
    return (
      <Fragment>
        <Tooltip title="上移">
          <Button icon="arrow-up" onClick={() => this.handleUp(rowIndex)} />
        </Tooltip>&nbsp;
        <Tooltip title="下移">
          <Button icon="arrow-down" onClick={() => this.handleDown(rowIndex)} />
        </Tooltip>
      </Fragment>
    );
  };

  /**
   * 渲染浏览状态的操作列
   */
  renderActionColumnOfBrowsable = rowIndex => {
    return (
      <Fragment>
        <Tooltip title="编辑">
          <Button onClick={() => this.handleEdit(rowIndex)} icon="edit" />
        </Tooltip>
        <Divider type="vertical" />
        <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDel(rowIndex)}>
          <Tooltip title="删除">
            <Button icon="delete" />
          </Tooltip>
        </Popconfirm>
      </Fragment>
    );
  };

  /**
   * 渲染可编辑状态的操作列
   */
  renderActionColumnOfEditable = () => {
    return (
      <Fragment>
        <Tooltip title="确定">
          <Button icon="check" onClick={this.handleOk} />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="取消">
          <Button icon="close" onClick={this.handleCancel} />
        </Tooltip>
      </Fragment>
    );
  };

  /**
   * 渲染添加按钮
   */
  renderAddButton = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button style={{ marginRight: 24 }} type="primary" onClick={this.handleAdd} icon="plus">
          新增
        </Button>
      </div>
    );
  };

  render() {
    const { children } = this.props;
    // 初始化列
    if (!children.props.columns[0].render) this.initColums();

    const newChildren = React.cloneElement(children, {
      editType: this.state.editType, // 让子组件也由父组件的editType状态的变化而重新渲染
    });

    // 如果没有记录，添加一条新纪录
    // if (records.length === 0) {
    //     const record = this.newRecord();
    //     this.state.editType = 'add';
    //     this.state.editRowIndex = records.length - 1;
    //     this.state.editRecord = { ...record }; // 深一层复制
    // }

    return (
      <Fragment>
        {newChildren}
        {this.state.editType !== 'add' && this.renderAddButton()}
      </Fragment>
    );
  }
}
