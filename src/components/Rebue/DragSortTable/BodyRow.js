import React from 'react';
import style from './index.less';

export default class BodyRow extends React.PureComponent {
  render() {
    const {
      beginDrag, // 加这一行不会弹出警告React does not recognize the `beginDrag` prop on a DOM element
      canDrop, // 加这一行不会弹出警告React does not recognize the `canDrop` prop on a DOM element
      moveRow, // 加这一行不会弹出警告React does not recognize the `moveRow` prop on a DOM element
      isOver,
      isDragging,
      dragItem,
      connectDragSource,
      connectDropTarget,
      differenceFromInitialOffset,
      ...restProps
    } = this.props;

    let { className } = restProps;
    const tempStyle = { ...restProps.style };
    // 如果渲染的是drag的row
    if (isDragging) {
      const { dragRecord, hoverRecord } = dragItem;
      if (!hoverRecord || (canDrop && hoverRecord && !canDrop(dragRecord, hoverRecord))) {
        tempStyle.cursor = 'no-drop';
      } else {
        tempStyle.cursor = 'move';
      }
    } else if (isOver) {
      // 如果渲染的是hover的row
      className += differenceFromInitialOffset.y > 0 ? ` ${style.dropOverDownward}` : ` ${style.dropOverUpward}`;
    } else {
      // 如果渲染的是其它一般的row
      tempStyle.cursor = 'move';
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={tempStyle} />));
  }
}
