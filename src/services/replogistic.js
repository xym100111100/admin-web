import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/rep-svr/kdi/logistic/report?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/rep-svr/rep/replogistic/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/rep-svr/rep/replogistic', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/rep-svr/rep/replogistic', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/rep-svr/rep/replogistic?${stringify(params)}`, {
    method: 'DELETE',
  });
}
