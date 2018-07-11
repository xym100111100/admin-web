import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/menu?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/pfm-svr/pfm/menu/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/pfm-svr/pfm/menu', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/pfm-svr/pfm/menu', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function sort(params) {
  return request('/pfm-svr/pfm/menu/sort', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/pfm-svr/pfm/menu?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function enable(params) {
  return request('/pfm-svr/pfm/menu/enable', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
