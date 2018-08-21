import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/kdi-svr/kdi/eorder?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/kdi-svr/kdi/eorder/getbyid?${stringify(params)}`);
}

export async function eorder(params) {
  return request('/kdi-svr/kdi/eorder', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/kdi-svr/kdi/eorder', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/kdi-svr/kdi/eorder?${stringify(params)}`, {
    method: 'DELETE',
  });
}
