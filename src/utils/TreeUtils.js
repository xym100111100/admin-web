import ArrayUtils from './ArrayUtils';

export default class TreeUtils {
  static findById(treeList, findId) {
    for (const item of treeList) {
      if (item.id && item.id === findId) return item;
      if (item.children) {
        const result = TreeUtils.findById(item.children, findId);
        if (result) return result;
      }
    }
    return undefined;
  }

  static delById(treeList, findId) {
    const result = delById1(treeList, findId);
    if (result) {
      if (result instanceof Object) {
        ArrayUtils.delById(treeList, findId);
      }
      return true;
    }
    return result;
  }
}

function delById1(treeList, findId) {
  for (const item of treeList) {
    if (item.id && item.id === findId) {
      return item;
    }
    if (item.children) {
      const result = delById1(item.children, findId);
      if (result) {
        if (result instanceof Object) {
          ArrayUtils.delById(item.children, findId);
          if (item.children.length === 0) {
            item.children = undefined;
          }
        }
        return true;
      }
    }
  }
  return false;
}
