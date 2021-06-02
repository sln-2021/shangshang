import request from '@/utils/request';
import _ from 'lodash';

export interface AddRewardParamsType {
  file?: string;
  type?: number;
  itemid?: number;
  itemName?: string;
  name?: string;
}

export interface UpdateRewardParamsType {
  type?: number;
  id: string;
  itemid?: number;
  itemName?: string;
  name?: string;
  file?: string;
}

type RewardItemsParamsType = {
  typeId: number;
};

/**
 * 获取奖励类型
 */
export async function fetchRewards(): Promise<any> {
  return request(`/api/lc/match/reward/levellist`);
}

/**
 * 添加奖励类型
 */
export async function addReward(params: { name: string, cardType: number }): Promise<any> {
  const { name, cardType } = params;
  return request(`/api/lc/match/reward/addtype`, {
    method: 'POST',
    data: { name, cardType },
  });
}

/**
 * 获取奖励列表 by 奖励类型ID
 */
export async function fetchRewardItems(params: RewardItemsParamsType): Promise<any> {
  return request(`/api/lc/match/reward/list`, { params: { ...params } });
}

/**
 * 添加奖励 by 奖励类型ID
 */
export async function addRewardItems(params: AddRewardParamsType): Promise<any> {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/lc/match/reward/add`, {
    method: 'POST',
    data: formData,
  });
}

/**
 * 更新奖励 by 奖励类型ID
 */
export async function updateRewardItem(params: UpdateRewardParamsType): Promise<any> {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/lc/match/reward/update`, {
    method: 'PUT',
    data: formData,
  });
}
