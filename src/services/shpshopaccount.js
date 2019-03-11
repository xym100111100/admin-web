import { stringify } from 'qs';
import request from '../utils/request';

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
  return request('/shp-svr/shp/shopaccount', {
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
