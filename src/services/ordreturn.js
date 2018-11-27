import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/ord-svr/ord/return?${stringify(params)}`);
}

export async function modify(params) {
  return request('/ord-svr/ord/return/agreetoarefund', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function refund(params) {
  return request('/ord-svr/ord/return/agreetoarefund', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reject(params) {
  return request('/ord-svr/ord/return/reject', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function agreeReturn(params) {
  return request('/ord-svr/ord/return/agreereturn', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}


export async function getById(params) {
  return request(`/ord-svr/ord/return/getbyid?${stringify(params)}`);
}

