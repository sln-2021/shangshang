import request from '@/utils/request';
import _ from 'lodash';
export interface LandBillParamsType {
    pageSize: number;
    pageNum: number;
    type: number;
}
export interface AddBillParamsType {
    amount?: number;
    itemName?: string;
    itemid?: any;
    num?: number;
    rewardType?: string;
    showWeight?: number;
    worth?: string;
}
export interface UpdateBillParamsType {
    amount?: number;
    itemName?: string;
    itemid?: any;
    num?: number;
    rewardType?: string;
    showWeight?: number;
    worth?: string;
}
export interface LandRewardsType {

}
export async function fetchBillList(params: LandBillParamsType) {
    return request(`/api/lc/shop/list`, { params: { ...params } });
}
export async function addBillItems(params: AddBillParamsType) {
    const formData = new FormData();
    // 循环添加到formData中
    _(params).forEach((value, key) => {
        if (typeof value !== 'function') formData.append(key, value);
    });
    return request(`/api/lc/shop/add`, {
        method: 'POST',
        data: formData,
    });
}
export async function updateBillItems(params: UpdateBillParamsType) {
    const formData = new FormData();
    // 循环添加到formData中
    _(params).forEach((value, key) => {
        if (typeof value !== 'function') formData.append(key, value);
    });
    return request(`/api/lc/shop/update`, {
        method: 'PUT',
        data: formData,
    });
}