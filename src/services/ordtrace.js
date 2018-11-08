import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/ord-svr/ord/trace?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/ord-svr/ord/trace/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/ord-svr/ord/trace', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/ord-svr/ord/trace', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/ord-svr/ord/trace?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function setDefaultTrace(params) {
  return request('/ord-svr/ord/trace/default', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
