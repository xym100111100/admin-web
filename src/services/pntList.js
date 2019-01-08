import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pnt-svr/pnt/account?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/pnt-svr/pnt/account/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/pnt-svr/pnt/account', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/pnt-svr/pnt/account', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/pnt-svr/pnt/account?${stringify(params)}`, {
    method: 'DELETE',
  });

 
}

export async function listByAccountId(params) {
  return request(`/pnt-svr/pnt/listByAccountId?${stringify(params)}`);
}