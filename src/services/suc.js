import request from '../utils/request';

export async function fakeAccountLogin(params) {
  return request('/suc-svr/user/login/by/user/name', {
    method: 'POST',
    body: params,
  });
}
