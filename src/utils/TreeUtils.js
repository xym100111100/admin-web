import React from 'react';
import { Tree } from 'antd';
import ArrayUtils from './ArrayUtils';

const { TreeNode } = Tree;

export default class TreeUtils {
  // 渲染AntDesign的Tree控件的节点
  static renderTreeNodes(treeData) {
    if (treeData.length > 0) {
      return treeData.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.id} title={item.name} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={item.name} dataRef={item} />;
      });
    }
  }

  // 通过ID查找元素
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

  // 通过ID删除元素
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

// 递归删除的内部函数
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
