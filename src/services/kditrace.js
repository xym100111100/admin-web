import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/kdi-svr/kdi/trace?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/kdi-svr/kdi/trace/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/kdi-svr/kdi/trace', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/kdi-svr/kdi/trace', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/kdi-svr/kdi/trace?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function setDefaultTrace(params) {
  return request('/kdi-svr/kdi/trace/default', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
