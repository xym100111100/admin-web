import { stringify } from 'qs';
import request from '../utils/request';

export async function listAreaSendOrgs(params) {
  return request(`/xyz-svr/xyz/areasendorg/listAreaSendOrgs?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function getById(params) {
  return request(`/xyz-svr/xyz/areasendorg/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/xyz-svr/xyz/areasendorg', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/xyz-svr/xyz/areasendorg', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/xyz-svr/xyz/areasendorg?${stringify(params)}`, {
    method: 'DELETE',
  });
}
