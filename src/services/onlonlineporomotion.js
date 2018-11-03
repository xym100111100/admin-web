import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/onl-svr/pfm/sys`);
}

export async function getById(params) {
  return request(`/onl-svr/pfm/sys/getbyid?${stringify(params)}`);
}

export async function add(params) {
  console.log(params);
  return request('/onl-svr/onl/onlinepromotion', {
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
  return request(`/onl-svr/pfm/sys?${stringify(params)}`, {
    method: 'DELETE',
  });
}
