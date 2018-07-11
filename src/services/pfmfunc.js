import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/func?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/pfm-svr/pfm/func/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/pfm-svr/pfm/func', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/pfm-svr/pfm/func', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function sort(params) {
  return request('/pfm-svr/pfm/func/sort', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/pfm-svr/pfm/func?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function enable(params) {
  return request('/pfm-svr/pfm/func/enable', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
