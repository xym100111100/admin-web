import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/role?${stringify(params)}`);
}

export async function listAll() {
  return request(`/pfm-svr/pfm/role/listAll`);
}

export async function getById(params) {
  return request(`/pfm-svr/pfm/role/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/pfm-svr/pfm/role', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/pfm-svr/pfm/role', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function sort(params) {
  return request('/pfm-svr/pfm/role/sort', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/pfm-svr/pfm/role?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function enable(params) {
  return request('/pfm-svr/pfm/role/enable', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
