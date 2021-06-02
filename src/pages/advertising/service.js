import { Form } from '@ant-design/compatible';
import request from '@/utils/request';
import _ from 'lodash';

// 获取列表
export async function queryList(params) {
    return request('/api/ad', { params })
}

// 添加
export async function addAdvertising(params) {
    const formData = new FormData();
    _(params).forEach((value, key) => {
        formData.append(key, value);
    })
    return request.post('/api/ad', { data: formData })
}

// 修改
export async function updateAdvertising(params) {
    const formData = new FormData();
    _(params).forEach((value, key) => {
        formData.append(key, value);
    })
    return request.put('/api/ad', { data: formData })
}

// 删除
export async function deleteAdvertising(params) {
    return request.delete('/api/ad', { params })
}

// 获取品牌列表
export async function querybrandList() {
    return request('/api/lc/brands/namelist')
}