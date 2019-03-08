import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询所有店铺信息
 * @param {*} params 
 */
export async function list(params) {
  return request(`/shp-svr/shp/shop/listshop?${stringify(params)}`);
}

/**
 * 获取单个店铺信息
 * @param {*} params 
 */
export async function getById(params) {
  return request(`/shp-svr/shp/shop/getbyid?${stringify(params)}`);
}

/**
 * 添加店铺信息
 * @param {*} params 
 */
export async function add(params) {
  return request('/shp-svr/shp/shop/addshop', {
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
  return request('/shp-svr/shp/shop', {
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
  return request(`/shp-svr/shp/shop/enable?${stringify(params)}`, {
    method: 'PUT',
  });
}

/**
 * 查询已添加和未添加的店铺账号
 * @param {*} params 
 */
export async function getShopAccountList(params) {
  return request(`/shp-svr/shp/shopaccount/listaddedAndunaddedusers?${stringify(params)}`);
}

/**
 * 查询未添加的店铺账号
 * @param {*} params 
 */
export async function listUnaddedAccounts(params) {
  return request(`/shp-svr/shp/shopaccount/listunaddedusers?${stringify(params)}`);
}

/**
 * 查询已添加的店铺账号
 * @param {*} params 
 */
export async function listAddedAccounts(params) {
  return request(`/shp-svr/shp/shopaccount/listaddedusers?${stringify(params)}`);
}

/**
 * 删除店铺账号
 */
export async function delAccounts(params) {
  return request('/suc-svr/shp/shopaccount', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

/**
 * 添加店铺账号
 * @param {*} params 
 */
export async function addAccounts(params) {
  return request(`/shp-svr/shp/shopaccount`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
