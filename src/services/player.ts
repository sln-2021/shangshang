import request from '@/utils/request';
import _ from 'lodash';

export interface PlayerListParamsType {
  /**
   * 0:协办方 1:渠道 2:主办方
   */
  pageSize: number;
  pageNum: number;
  groupId?: number;
  groupType?: 0 | 1 | 2;
}

export interface PlayerParamsType {
  id: number;
  username?: string;
  leagueId?: number;
  conferenceId?: number;
  clubId?: number;
  oldPassword?: string;
  newPassword?: string;
  bz?: string;
}

export interface AdddPlayerParamsType {
  /**
   *  - 1：禁止登录，
   *    0：渠道游客待认证，（主办方添加渠道用户账号时）
   *    1：正常状态用户(主办方，渠道，协办方添加账户时)
   *    2.协办方游客待认证（渠道添加协办方用户账号时）
   */
  username: string;
  password: string;
  bz?: string;
  userStatus: -1 | 0 | 1 | 2;
  authFee?: number;
}

export interface DeleteOrDetailPlayerParamsType {
  clubId: number;
}

// 获取玩家列表
export async function fetchPlayer(params: PlayerListParamsType) {
  return request(`/api/player/getPlayers`, { params: { ...params } });
}

// 获取玩家邀请列表
export async function fetchInvite(params: PlayerListParamsType) {
  return request(`/api/player/countUserList`, { params: { ...params } });
}

// 修改玩家信息
export async function changePlayer(params: PlayerParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/player/updatePlayer`, {
    method: 'PUT',
    data: formData,
  });
}

// 添加玩家
export async function addPlayer(params: PlayerParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/user/registration`, {
    method: 'POST',
    data: formData,
  });
}

export async function deletePlayer(params: DeleteOrDetailPlayerParamsType) {
  const { clubId } = params;
  return request(`/api/conference/deleteConference/${clubId}`, {
    method: 'DELETE',
  });
}

export async function fetchPlayerDetail(params: DeleteOrDetailPlayerParamsType) {
  const { clubId } = params;
  return request(`/api/player/getPlayer/${clubId}`);
}

// 获取下线数量 len , 下线充值总数 sumpay 单位元
export async function fetchPlayerById(params: { id: number }) {
  const { id } = params;
  return request(`/c/user/getidslist?id=${id}`);
}

// 获取玩家充值集合
export async function fetchRecord(params: { playerId: number }) {
  return request(`/api/pay`, { params: { ...params } });
}
