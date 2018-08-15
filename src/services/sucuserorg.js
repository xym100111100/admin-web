import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/suc-svr/suc/user/listbyorgid?${stringify(params)}`);
}

export async function add(params) {
  console.log(params);
  return request(`/suc-svr/suc/user/adduserorg?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function del(params) {
  return request(`/suc-svr/suc/user/deluserorgbyid?${stringify(params)}`, {
    method: 'PUT',
  });
}
