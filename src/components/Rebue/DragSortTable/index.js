import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DragableBodyRow from './DragableBodyRow';

@DragDropContext(HTML5Backend)
export default class DragSortTable extends React.PureComponent {
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  render() {
    const { children } = this.props;
    const { beginDrag, canDrop, moveRow } = children.props;
    const newChildren = React.cloneElement(children, {
      components: this.components,
      // 设置行属性，将子节点table的属性克隆到新节点行属性上
      onRow: record => {
        return {
          record,
          beginDrag,
          canDrop,
          moveRow,
        };
      },
    });
    // 返回新的克隆的子节点
    return newChildren;
  }
}
