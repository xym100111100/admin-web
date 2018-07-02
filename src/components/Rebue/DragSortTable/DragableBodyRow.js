import { DragSource, DropTarget } from 'react-dnd';
import BodyRow from './BodyRow';

const rowSource = {
  // 开始Drag，返回drag的记录添加到props中，之后就可以从monitor的getItem得到的对象中取出来
  beginDrag(props) {
    if (props.beginDrag) props.beginDrag(props.record);
    return {
      dragRecord: props.record,
    };
  },
};

const rowTarget = {
  // 判断是否接受drop
  canDrop(props, monitor) {
    if (props.canDrop) {
      const { dragRecord } = monitor.getItem();
      const hoverRecord = props.record;
      return props.canDrop(dragRecord, hoverRecord);
    }
    return true;
  },
  hover(props, monitor) {
    const hoverRecord = props.record;
    const dragItem = monitor.getItem();
    dragItem.hoverRecord = hoverRecord;
  },
  // 接收到drop
  drop(props, monitor) {
    const { dragRecord } = monitor.getItem();
    const dropRecord = props.record;
    // 移动行
    props.moveRow(dragRecord, dropRecord);
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragItem: monitor.getItem(),
    isDragging: monitor.isDragging(),
  }))(BodyRow)
);

export default DragableBodyRow;
