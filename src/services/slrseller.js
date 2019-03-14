import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询所有店铺信息
 * @param {*} params 
 */
export async function list(params) {
  return request(`/slr-svr/slr/seller?${stringify(params)}`);
}

/**
 * 获取单个店铺信息
 * @param {*} params 
 */
export async function getById(params) {
  return request(`/slr-svr/slr/seller/getbyid?${stringify(params)}`);
}

/**
 * 添加店铺信息
 * @param {*} params 
 */
export async function add(params) {
  return request('/slr-svr/slr/seller', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 修改店铺信息
 * @param {*} params 
 */
export async function modify(params) {
  return request('/slr-svr/slr/seller', {
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
  return request(`/slr-svr/slr/seller/enable?${stringify(params)}`, {
    method: 'PUT',
  });
}
