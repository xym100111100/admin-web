import request from '../utils/request';

export async function login(params) {
  return request('/pfm-svr/user/login/by/user/name', {
    method: 'POST',
    body: params,
  });
}

export async function queryCurrent() {
  return request('/pfm-svr/user/currentuser');
}
