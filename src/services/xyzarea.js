import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/xyz-svr/xyz/area`);
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

export async function modify(params) {
  return request('/xyz-svr/xyz/area', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/xyz-svr/xyz/area?${stringify(params)}`, {
    method: 'DELETE',
  });
}
