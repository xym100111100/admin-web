import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/afc-svr/afc/withdrawaccountbindflow?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/afc-svr/suc/org/getbyid?${stringify(params)}`);
}

export async function reject(params) {
  return request(`/afc-svr/afc/withdrawaccountbindflow/reject?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function review(params) {
  return request(`/afc-svr/afc/withdrawaccountbindflow/review?${stringify(params)}`, {
    method: 'PUT',
  });
}
//获取单个账户信息，供应商调用
export async function getOneAccount(params) {
  return request(`/afc-svr/afc/account/getbyid?${stringify(params)}`);
}
