export default class ArrayUtils {
  static delById(array, delId) {
    const removedIndex = array.findIndex(item => item.id === delId);
    if (removedIndex !== -1) {
      array.splice(removedIndex, 1);
      return true;
    } else {
      return false;
    }
  }
}
