import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/kdi-svr/kdi/template?${stringify(params)}`);
}

export async function listTemplate(params) {
  return request(`/kdi-svr/kdi/templatedic?${stringify(params)}`);
}
export async function getById(params) {
  return request(`/kdi-svr/kdi/template/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/kdi-svr/kdi/template', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/kdi-svr/kdi/template', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
export async function setDefualt(params) {
  return request('/kdi-svr/kdi/template/setDefualt', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
export async function del(params) {
  return request(`/kdi-svr/kdi/template?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function setDefaultCompany(params) {
  return request('/kdi-svr/kdi/template/default', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
