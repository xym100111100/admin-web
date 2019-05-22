import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询产品信息
 */
export async function list(params) {
  return request(`/prd-svr/prd/product?${stringify(params)}`);
}

/**
 * 查询单个产品信息
 */
export async function getById(params) {
  return request(`/prd-svr/prd/product/getbyid?${stringify(params)}`);
}

/**
 * 添加产品
 */
export async function add(params) {
  return request('/prd-svr/prd/product', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 修改产品信息
 */
export async function modify(params) {
  return request('/prd-svr/prd/product', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

/**
 * 禁用或启用产品
 */
export async function enable(params) {
  return request(`/prd-svr/prd/product/enable?${stringify(params)}`, {
    method: 'PUT',
  });
}
