export default class ArrayUtils {
  static delByIndex(array, index) {
    array.splice(index, 1);
  }

  static delById(array, delId) {
    const removedIndex = array.findIndex(item => item.id === delId);
    if (removedIndex !== -1) {
      // array.splice(removedIndex, 1);
      this.delByIndex(array, removedIndex);
      return true;
    } else {
      return false;
    }
  }

  // 指定元素上移
  static removeUp(array, rowIndex) {
    if (rowIndex === 0) return;
    const temp = array[rowIndex - 1];
    array[rowIndex - 1] = array[rowIndex];
    array[rowIndex] = temp;
  }

  // 指定元素下移
  static removeDown(array, rowIndex) {
    if (rowIndex === array.length - 1) return;
    const temp = array[rowIndex + 1];
    array[rowIndex + 1] = array[rowIndex];
    array[rowIndex] = temp;
  }
}
