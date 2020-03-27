import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/xyz-svr/xyz/area`);
}
export async function listUnaddedOrgs(params) {
  return request(`/xyz-svr/xyz/areamngorg/listUnaddedOrgs?${stringify(params)}`);
}
export async function listAddedOrgs(params) {
  return request(`/xyz-svr/xyz/areamngorg/listAddedOrgs?${stringify(params)}`);
}


export async function getById(params) {
  return request(`/xyz-svr/xyz/area/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/xyz-svr/xyz/area', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addOrgs(params) {
  return request('/xyz-svr/xyz/addOrgs', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delOrgs(params) {
  return request('/xyz-svr/xyz/delOrgs', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/xyz-svr/xyz/area', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
/**
 * 查询已添加与未添加的用户
 */
export async function listAddedAndUnaddedOrgs(params) {
  return request(`/xyz-svr/xyz/areamngorg/listaddedandunaddedorgs?${stringify(params)}`);
}

export async function del(params) {
  return request(`/xyz-svr/xyz/area?${stringify(params)}`, {
    method: 'DELETE',
  });
}

