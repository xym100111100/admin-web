import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/afc-svr/afc/orgAccount?${stringify(params)}`);
}

export async function listAll() {
  return request(`/afc-svr/afc/org/all`);
}

export async function getById(params) {
  return request(`/afc-svr/afc/org/getbyid?${stringify(params)}`);
}

export async function getByName(params) {
  return request(`/afc-svr/afc/org/selectbyname?${stringify(params)}`);
}

export async function add(params) {
  return request('/afc-svr/afc/org', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/afc-svr/afc/org', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/afc-svr/afc/org?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function enable(params) {
  return request(`/afc-svr/afc/org/enable?${stringify(params)}`, {
    method: 'PUT',
  });
}
