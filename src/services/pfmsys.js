import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/pfm-svr/pfm/sys`);
}

export async function getById(params) {
  return request(`/pfm-svr/pfm/sys/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/pfm-svr/pfm/sys', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/pfm-svr/pfm/sys', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request('/pfm-svr/pfm/sys', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}
