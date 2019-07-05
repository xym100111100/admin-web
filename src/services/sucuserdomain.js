import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/suc-svr/suc/user/list-by-domain?${stringify(params)}`);
}

export async function listAll() {
  return request(`/suc-svr/suc/org/all`);
}

export async function getById(params) {
  return request(`/suc-svr/suc/org/getbyid?${stringify(params)}`);
}

export async function listByDomainAndKeys(params) {
  return request(`/suc-svr/suc/user/list-by-domain-and-keys?${stringify(params)}`);
}

export async function add(params) {
  return request('/suc-svr/user/reg/by/login/name', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/suc-svr/suc/org', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/suc-svr/suc/org?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function enable(params) {
  return request(`/suc-svr/suc/org/enable?${stringify(params)}`, {
    method: 'PUT',
  });
}
