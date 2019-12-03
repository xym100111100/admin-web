import { stringify } from 'qs';
import request from '../utils/request';

export async function listRevenueOfDay(params) {
    return request(`/rep-svr/rep/revenue-daily/list-revenue-of-Day?${stringify(params)}`);
}


export async function listRevenueOfWeek(params) {
    return request(`/rep-svr/rep/revenue-weekly/list-revenue-of-week?${stringify(params)}`);
}


export async function listRevenueOfYear(params) {
    return request(`/rep-svr/rep/revenue-annual/list-revenue-of-year?${stringify(params)}`);
}


export async function listRevenueOfMonth(params) {
    return request(`/rep-svr/rep/revenue-monthly/list-revenue-of-month?${stringify(params)}`);
}


