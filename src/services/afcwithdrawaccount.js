import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/afc-svr/afc/withdrawaccount?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/afc-svr/suc/org/getbyid?${stringify(params)}`);
}
