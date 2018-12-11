import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/dumai-svr/dumai/index`);
}

export async function getById(params) {
  return request(`/dumai-svr/dumai/index/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/dumai-svr/dumai/index', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/dumai-svr/dumai/index', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/dumai-svr/dumai/index?${stringify(params)}`, {
    method: 'DELETE',
  });
}
