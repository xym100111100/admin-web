import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/acti?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/pfm-svr/pfm/acti/${params.id}`);
}

export async function add(params) {
  return request('/pfm-svr/pfm/acti', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/pfm-svr/pfm/acti', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function sort(params) {
  return request('/pfm-svr/pfm/acti/sort', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request('/pfm-svr/pfm/acti', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function auth(params) {
  return request('/pfm-svr/pfm/acti/auth', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  return request('/pfm-svr/pfm/acti/enable', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
