import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/kdi-svr/kdi/logistic?${stringify(params)}`);
}

export async function report(params) {
  return request(`/kdi-svr/kdi/logistic/report?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/kdi-svr/kdi/logistic/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/kdi-svr/kdi/logistic', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/kdi-svr/kdi/logistic', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/kdi-svr/kdi/logistic?${stringify(params)}`, {
    method: 'DELETE',
  });
}
