import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/prd-svr/prd/productspec?${stringify(params)}`);
}

/**
 * 校验产品规格编码
 * @param {*} params 
 */
export async function existSpecCode(params) {
  return request(`/prd-svr/prd/productspeccode/exist?${stringify(params)}`);
}

