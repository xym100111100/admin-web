import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/sup-svr/sup/goods`);
}

export async function getById(params) {
  return request(`/sup-svr/sup/goods/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/sup-svr/sup/goods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/sup-svr/sup/goods', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/sup-svr/sup/goods?${stringify(params)}`, {
    method: 'DELETE',
  });
}
