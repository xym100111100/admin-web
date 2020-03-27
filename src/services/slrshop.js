import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询所有店铺信息
 * @param {*} params 
 */
export async function list(params) {
  return request(`/slr-svr/slr/shop/listshop?${stringify(params)}`);
}

/**
 * 获取单个店铺信息
 * @param {*} params 
 */
export async function getById(params) {
  return request(`/slr-svr/slr/shop/getbyid?${stringify(params)}`);
}

/**
 * 添加店铺信息
 * @param {*} params 
 */
export async function add(params) {
  return request('/slr-svr/slr/shop/addshop', {
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
  return request('/slr-svr/slr/shop', {
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
  return request(`/slr-svr/slr/shop/enable?${stringify(params)}`, {
    method: 'PUT',
  });
}

/**
 * 根据卖家查询所有店铺信息
 * @param {*} params 
 */
export async function shopList(params) {
  return request(`/slr-svr/slr/shop/byseller`);
}

