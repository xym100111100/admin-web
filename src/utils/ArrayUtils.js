export default class ArrayUtils {
  /**
   * 查找数组中的元素
   * @param {Array} array 数组
   * @param {*} val 元素的值
   * @returns 返回数组的索引，如果没有找到返回-1
   */
  static find(array, val) {
    return array.findIndex(item => item === val);
  }

  /**
   * 通过索引删除数组中的元素
   * @param {Array} array 数组
   * @param {Number} index 数组的索引
   */
  static delByIndex(array, index) {
    array.splice(index, 1);
  }

  /**
   * 通过元素的id删除数组中的元素
   * @param {Array} array 数组
   * @param {Number} id 元素的ID
   * @returns 返回是否找到元素并删除成功
   */
  static delById(array, id) {
    const removedIndex = array.findIndex(item => item.id === id);
    if (removedIndex !== -1) {
      this.delByIndex(array, removedIndex);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 指定元素上移
   * @param {Array} array 数组
   * @param {Number} index 数组的索引
   */
  static removeUp(array, index) {
    if (index === 0) return;
    const temp = array[index - 1];
    array[index - 1] = array[index];
    array[index] = temp;
  }

  /**
   * 指定元素下移
   * @param {Array} array 数组
   * @param {Number} index 数组的索引
   */
  static removeDown(array, index) {
    if (index === array.length - 1) return;
    const temp = array[index + 1];
    array[index + 1] = array[index];
    array[index] = temp;
  }
}
