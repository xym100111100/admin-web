import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/prm-svr/prm/partner?${stringify(params)}`);
}

/**
 * 获取产品分类树
 */
export async function getCategoryTree() {
  return request(`/prd-svr/prd/productcategory/tree`);
}
