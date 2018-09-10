import React from 'react';
import { Tree, Tooltip } from 'antd';
import ArrayUtils from './ArrayUtils';

const { TreeNode } = Tree;

export default class TreeUtils {
  /**
   * 渲染AntDesign的Tree控件的节点
   */
  static renderTreeNodes(treeData) {
    if (treeData.length > 0) {
      let treeNode;
      return treeData.map(item => {
        // 节点标题
        const nodeTitle =
          item.tip || item.remark ? (
            <Tooltip title={item.tip || item.remark} placement="right">
              {item.name}
            </Tooltip>
          ) : (
            item.name
          );
        // 节点属性
        const nodeProps = {
          key: item.key ? item.key : item.id,
          title: nodeTitle,
          dataRef: item,
        };
        // 如果有子节点，递归渲染子节点
        if (item.children) {
          treeNode = <TreeNode {...nodeProps}>{this.renderTreeNodes(item.children)}</TreeNode>;
        } else {
          // 如果没有子节点，只渲染本级节点
          treeNode = <TreeNode {...nodeProps} />;
        }
        return treeNode;
      });
    }
  }

  /**
   * 转换flat的数组成为AntDesign的Tree结构
   */
  static convertFlatToTree(flatArray) {
    const result = [];
    flatArray.forEach(item => {
      const { code } = item;
      const { length } = code;
      if (length === 2) {
        result.push(item);
      } else {
        const count = length / 2;
        let sEval = `result[${getIndexAtLevel(code, 1)}]`;
        for (let level = 2; level < count; level++) {
          const index = getIndexAtLevel(code, level);
          sEval += `.children[${index}]`;
        }
        sEval += `.children`;
        eval(`if (!${sEval}) ${sEval}=[];`);
        eval(`${sEval}.push(item);`);
      }
    });
    return result;
  }

  /**
   * 转换AntDesign的Tree结构成为flat的数组
   */
  static convertTreeToFlat(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys.push({ ...item });
        keys = [...keys, ...this.convertTreeToFlat(item.children)];
      } else {
        keys.push({ ...item });
      }
    });
    return keys;
  }

  /**
   * 通过ID查找元素
   */
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

  /**
   * 通过属性查找元素
   *
   * @param {[]} treeList 树形数据
   * @param {string} propName 属性名
   * @param {*} propVal 属性值
   */
  static findByProp(treeList, propName, propVal) {
    for (const item of treeList) {
      if (item[propName] && item[propName] === propVal) return item;
      if (item.children) {
        const result = TreeUtils.findByProp(item.children, propName, propVal);
        if (result) return result;
      }
    }
    return undefined;
  }

  /**
   * 通过ID删除元素
   */
  static delById(treeList, findId) {
    const result = delById0(treeList, findId);
    if (result) {
      if (result instanceof Object) {
        ArrayUtils.delById(treeList, findId);
      }
      return true;
    }
    return result;
  }
}

/**
 * 得到在第几级上的索引
 * @param {*} code 树编码
 * @param {*} level 第几级(1..n)
 * @param {*} levelLength 第一级的长度，默认为2
 */
function getIndexAtLevel(code, level, levelLength = 2) {
  return code.substr((level - 1) * 2, levelLength) - 0;
}

/**
 * 递归删除的内部函数
 */
function delById0(treeList, findId) {
  for (const item of treeList) {
    if (item.id && item.id === findId) {
      return item;
    }
    if (item.children) {
      const result = delById0(item.children, findId);
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
