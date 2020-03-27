import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/rna-svr/rna/realname?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/rna-svr/rna/realname/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/rna-svr/rna/realname', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/rna-svr/rna/realname', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/rna-svr/rna/realname?${stringify(params)}`, {
    method: 'DELETE',
  });
}
