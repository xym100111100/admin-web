import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DragableBodyRow from './DragableBodyRow';
import style from './index.less';

@DragDropContext(HTML5Backend)
export default class DragSortTable extends React.PureComponent {
  constructor() {
    super();
    this.state = { dragRecord: undefined, hoverRecord: undefined };
  }
  onHover = (dragRecord, hoverRecord) => {
    this.setState({ dragRecord, hoverRecord });
  };
  endDrag = () => {
    this.setState({ dragRecord: undefined, hoverRecord: undefined });
  };
  render() {
    const { children, beginDrag, compare, canDrop, onDrop } = this.props;
    const { dragRecord, hoverRecord } = this.state;
    // 克隆子节点table，加上drag/drop特性返回
    const newChildren = React.cloneElement(children, {
      // 覆盖默认的 table 元素
      components: {
        body: {
          row: DragableBodyRow,
        },
      },
      // 设置行的属性，将record以及drag和drop的几个回调函数添加到行属性上
      onRow: record => {
        return {
          record,
          beginDrag,
          endDrag: this.endDrag,
          onHover: this.onHover,
          canDrop,
          onDrop,
        };
      },
      rowClassName: record => {
        // 如果是在dragging状态
        if (dragRecord) {
          // 如果当前行是drag行
          if (dragRecord === record) {
            if (canDrop) {
              if (!canDrop(dragRecord, hoverRecord)) {
                return style.noDrop;
              }
            } else if (dragRecord === hoverRecord) return style.noDrop;
            // 如果当前行是hover行（上面已经排除不是drag行）
          } else if (hoverRecord === record) {
            if (canDrop) {
              if (canDrop(dragRecord, hoverRecord)) {
                return compare(dragRecord, hoverRecord) ? style.dropOverUpward : style.dropOverDownward;
              }
            } else return compare(dragRecord, hoverRecord) ? style.dropOverUpward : style.dropOverDownward;
          }
        }
        // 不是在dragging状态，正常时候尚未开始drag
        return style.move;
      },
    });
    // 返回新的克隆的子节点
    return newChildren;
  }
}
