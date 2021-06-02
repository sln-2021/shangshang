import request from '@/utils/request';
import _ from 'lodash';
import { CreateType, UpdateType } from './type/activity.d';

export async function fetchActivity(params: { type: 1 | 2 }) {
  return request(`/api/activity`, {
    params: { ...params },
  });
}

export async function addActivity(params: CreateType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/activity`, {
    method: 'POST',
    data: formData,
  });
}

export async function updateActivity(params: UpdateType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/activity`, {
    method: 'PUT',
    data: formData,
  });
}

export async function deleteActivity(id: number) {
  return request(`/api/activity?id=${id}`, {
    method: 'DELETE',
  });
}
