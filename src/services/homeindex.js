import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/home-svr/home/index`);
}

export async function getById(params) {
  return request(`/home-svr/home/index/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/home-svr/home/index', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/home-svr/home/index', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/home-svr/home/index?${stringify(params)}`, {
    method: 'DELETE',
  });
}
