import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/suc-svr/suc/domain`);
}

export async function getById(params) {
  return request(`/suc-svr/suc/domain/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/suc-svr/suc/domain', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/suc-svr/suc/domain', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/suc-svr/suc/domain?${stringify(params)}`, {
    method: 'DELETE',
  });
}
