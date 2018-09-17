import React from 'react';
import { Tree, Tooltip } from 'antd';
import ArrayUtils from './ArrayUtils';

const { TreeNode } = Tree;


export default class IdUtils {
  static i = 0;

  static getI() {
    this.i = this.i < 99999 ? this.i + 1 : 0;
    return this.i.toString().padStart(5, '0');
  }
  /**
   * 生成ID
   */
  static genId() {
    const now = new Date().getTime();
    return now + this.getI();
  }
}