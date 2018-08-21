import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/kdi-svr/kdi/sender?${stringify(params)}`);
}

export async function alllist(params) {
  return request(`/kdi-svr/kdi/sender/alllist`);
}

export async function getById(params) {
  return request(`/kdi-svr/kdi/sender/getbyid?${stringify(params)}`);
}

export async function getDefaultSender(params) {
  return request(`/kdi-svr/kdi/sender/default?${stringify(params)}`);
}

export async function add(params) {
  return request('/kdi-svr/kdi/sender', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/kdi-svr/kdi/sender', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/kdi-svr/kdi/sender?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function setDefaultSender(params) {
  return request('/kdi-svr/kdi/sender/default', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function addSender(params) {
  return request('/kdi-svr/kdi/sender/add', {
    method: 'Post',
    body: {
      ...params,
    },
  });
}
