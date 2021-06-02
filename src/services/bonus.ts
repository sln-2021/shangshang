import request from '@/utils/request';
import _ from 'lodash';

export interface BonusListParamsType {
  /**
   * 状态：0：未审核。1：审核。2, 拒绝，添加默认为0未审核
   */
  pageSize: number;
  pageNum: number;
  status?: 0 | 1 | 2;
}

export interface BonusParamsType {
  /**
   * ID
   * 缴纳金额
   * 协办方 / 渠道ID
   * 状态：0，未审核。1：审核。2, 拒绝，添加默认为0未审核
   * 所属类型：0，协办方。1，渠道
   */
  id?: Number;
  bonusTotal?: Number;
  ccId: Number;
  status?: 0 | 1 | 2;
  type: 0 | 1;
  file?: any;
}

export interface DeleteOrDetailBonusParamsType {
  id: Number;
}

export interface BonusTotalForMonth {
  month: Number;
}

export async function fetchBonus(params: BonusListParamsType) {
  return request(`/api/rewardPool/getAllRewardPools`, {
    params: { ...params },
  });
}

export async function updateBonus(params: BonusParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/rewardPool/updateRewardPool`, {
    method: 'PUT',
    data: formData,
  });
}

export async function addBonus(params: BonusParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/rewardPool/addRewardPool`, {
    method: 'POST',
    data: formData,
  });
}

export async function deleteBonus(params: DeleteOrDetailBonusParamsType) {
  const { id } = params;
  return request(`/api/rewardPool/deleteRewardPool/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchBonusDetail(params: DeleteOrDetailBonusParamsType) {
  const { id } = params;
  return request(`/api/rewardPool/getRewardPoolById/${id}`);
}

// 获取各组织兑换券池金额统计记录,角色可查看个人，root可查看全部
export async function fetchBonusTotal() {
  return request(`/api/rewardPool/getGroupTotalRewardPool`);
}

// 获取各组织兑换券池金额统计记录,角色可查看个人，root可查看全部 筛选条件为月份
export async function fetchAccountStatement(params: BonusTotalForMonth) {
  return request(`/api/rewardPool/getGroupTotalRewardPoolByMonth`, {
    params: { ...params },
  });
}

export async function fetchAccountStatementForMyself(params: BonusListParamsType) {
  return request(`/api/rewardPool/getGroupRewardPoolS`, {
    params: { ...params },
  });
}

export async function fetcAccountStatementForSubordinate(params: BonusListParamsType) {
  return request(`/api/rewardPool/getGroupRewardPoolSByGroup`, {
    params: { ...params },
  });
}
