import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import style from './index.less';
// import BodyRow from './BodyRow';

const rowSource = {
  // 开始Drag，返回drag的记录添加到item中，之后就可以从monitor的getItem得到的对象中取出来
  beginDrag(props) {
    const { record: dragRecord } = props;
    if (props.beginDrag) props.beginDrag(dragRecord);
    return {
      dragRecord,
    };
  },
  endDrag(props) {
    if (props.endDrag) props.endDrag();
  },
};

const rowTarget = {
  // 判断是否接受drop
  canDrop(props, monitor) {
    const { dragRecord } = monitor.getItem();
    const { record: hoverRecord } = props;
    if (props.canDrop) return props.canDrop(dragRecord, hoverRecord);
    else return true;
  },
  hover(props, monitor) {
    const { dragRecord } = monitor.getItem();
    const { record: hoverRecord } = props;
    hoverRecord.className = 'no-drop';
    if (props.onHover) props.onHover(dragRecord, hoverRecord);
  },
  // 接收到drop
  drop(props, monitor) {
    const { dragRecord } = monitor.getItem();
    const { record: dropRecord } = props;
    // drop事件回调
    if (props.onDrop) props.onDrop(dragRecord, dropRecord);
  },
};

// export default DragableBodyRow;
@DragSource('row', rowSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  dragItem: monitor.getItem(),
  isDragging: monitor.isDragging(),
}))
@DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
}))
export default class DragableBodyRow extends React.PureComponent {
  render() {
    const {
      beginDrag, // 加这一行不会弹出警告React does not recognize the `beginDrag` prop on a DOM element
      endDrag, // 加这一行不会弹出警告React does not recognize the `endDrag` prop on a DOM element
      onHover, // 加这一行不会弹出警告React does not recognize the `onHover` prop on a DOM element
      canDrop, // 加这一行不会弹出警告React does not recognize the `canDrop` prop on a DOM element
      onDrop, // 加这一行不会弹出警告React does not recognize the `onDrop` prop on a DOM element
      isOver,
      dragItem,
      isDragging,
      connectDragSource,
      connectDropTarget,
      differenceFromInitialOffset,
      ...restProps
    } = this.props;

    return connectDragSource(connectDropTarget(<tr {...restProps} />));
  }
}
