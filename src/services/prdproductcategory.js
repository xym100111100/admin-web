import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/prd-svr/prd/productcategory?${stringify(params)}`);
}

/**
 * 获取产品分类树
 */
export async function getCategoryTree() {
  return request(`/prd-svr/prd/productcategory/tree`);
}

/**
 * 添加店铺搜索分类
 * @param {*} params 
 */
export async function add(params) {
  return request('/prd-svr/prd/productcategory', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 修改店铺搜索分类
 * @param {*} params 
 */
export async function modify(params) {
  return request('/prd-svr/prd/productcategory', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

/**
 * 禁用或启用店铺
 */
export async function enable(params) {
  return request(`/prd-svr/prd/productcategory/enable`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}