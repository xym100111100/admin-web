import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/suc-svr/suc/user/listbyorgid?${stringify(params)}`);
}

/**
 * 列出已添加的用户
 */
export async function listAddedUsers(params) {
  return request(`/suc-svr/suc/userorg/listaddedusers?${stringify(params)}`);
}

/**
 * 列出未添加的用户
 */
export async function listUnaddedUsers(params) {
  return request(`/suc-svr/suc/userorg/listunaddedusers?${stringify(params)}`);
}

/**
 * 列出已添加与未添加的用户
 */
export async function listAddedAndUnaddedUsers(params) {
  return request(`/suc-svr/suc/userorg/listaddedandunaddedusers?${stringify(params)}`);
}

/**
 * 添加用户到组织中
 */
export async function addUsers(params) {
  return request('/suc-svr/suc/userorg', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/**
 * 从组织中移除用户
 */
export async function removeUsers(params) {
  return request('/suc-svr/suc/userorg', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function add(params) {
  return request(`/suc-svr/suc/user/adduserorg?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function del(params) {
  return request(`/suc-svr/suc/user/deluserorgbyid?${stringify(params)}`, {
    method: 'PUT',
  });
}
