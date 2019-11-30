import { stringify } from 'qs';
import request from '../utils/request';

export async function listRevenueOfDay(params) {
    return request(`/rep-svr/rep/revenue-daily/list-revenue-of-Day?${stringify(params)}`);
}


export async function listRevenueOfWeek(params) {
    return request(`/rep-svr/rep/list-revenue-of-Week?${stringify(params)}`);
}


export async function listRevenueOfYear(params) {
    return request(`/rep-svr/rep/list-revenue-of-Year?${stringify(params)}`);
}


export async function listRevenueOfMonth(params) {
    return request(`/rep-svr/rep/list-revenue-of-month?${stringify(params)}`);
}


