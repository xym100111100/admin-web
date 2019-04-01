import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询所有店铺搜索分类
 * @param {*} params 
 */
export async function list(params) {
  return request(`/onl-svr/onl/searchcategory?${stringify(params)}`);
}

/**
 * 获取单个店铺搜索分类
 * @param {*} params 
 */
export async function getById(params) {
  return request(`/onl-svr/onl/searchcategory/getbyid?${stringify(params)}`);
}

/**
 * 添加店铺搜索分类
 * @param {*} params 
 */
export async function add(params) {
  return request('/onl-svr/onl/searchcategory', {
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
  return request('/onl-svr/onl/searchcategory', {
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
  return request(`/onl-svr/onl/searchcategory/enable`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

