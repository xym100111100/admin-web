import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/hlw-svr/hlw/student`);
}

export async function getById(params) {
  return request(`/hlw-svr/hlw/student/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/hlw-svr/hlw/student', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/hlw-svr/hlw/student', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/hlw-svr/hlw/student?${stringify(params)}`, {
    method: 'DELETE',
  });
}
