import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询所有店铺搜索分类
 * @param {*} params 
 */
export async function list(params) {
  return request(`/slr-svr/slr/searchcategory?${stringify(params)}`);
}

/**
 * 获取单个店铺搜索分类
 * @param {*} params 
 */
export async function getById(params) {
  return request(`/slr-svr/slr/searchcategory/getbyid?${stringify(params)}`);
}

/**
 * 添加店铺搜索分类
 * @param {*} params 
 */
export async function add(params) {
  return request('/slr-svr/slr/searchcategory', {
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
  return request('/slr-svr/slr/searchcategory', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

/**
 * 禁用或启用店铺
 * @param {*} params 
 */
export async function enable(params) {
  return request(`/slr-svr/slr/searchcategory/enable`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

