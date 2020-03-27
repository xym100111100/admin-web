import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/script?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/pfm-svr/pfm/script/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/pfm-svr/pfm/script', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/pfm-svr/pfm/script', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/pfm-svr/pfm/script?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function setDefaultCompany(params) {
  return request('/pfm-svr/pfm/script/default', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
