import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/prd-svr/prd/productpic?${stringify(params)}`);
}

