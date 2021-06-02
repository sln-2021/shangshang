import request from '@/utils/request';
import _ from 'lodash';

export interface LandlordsMatchParamsType {
  pageSize: number;
  pageNum: number;
  beginTime: number;
  endTime: number;
  findStr: string;
  type: string;
  status: string;
}

export interface LandlordsCommonParamsType {
  pageSiz?: number;
  pageNum?: number;
  matchType?: number;
  name?: string;
  gamename?: string;
}

export interface MatchStatesParamsType {
  id: number;
  status: string;
}

export interface MatchParamsType {
  file?: string;
  matchRankRewardPolist?: any;
  rankRewardType?: 0 | 1;
  beginTime: number;
  bonus: number;
  clubId: number;
  competitionCharter: string; // 赛事章程
  competitionInstructions: string; // 比赛须知
  conferenceId: number; // 渠道ID
  displayTime: number; // 比赛展示时间
  endTime: number; // 比赛结束时间
  integralRequirement: string; //	积分要求
  name: string; // 比赛名称
  numberCompetitors: number; //	比赛人数
  numberMatches: number; //	单场对局数
  registrationFee: number; // 报名费用
  registrationNote: string; //	报名说明
  registrationStartTime: number; //	每日比赛报名开始时间
  registrationStopTime: number; //	每日比赛报名结束时间
  repeatCount: number; //	比赛次数
  repeatInterval: number; //	按时开赛时间间隔
  rewardTime: number; //	发奖时间
  rewardWay: string; // 发奖方式
  rotation: number; //	单场轮次
  startTime: number; //	比赛周期开始时间
  status: '0' | '1' | '2'; // 赛事状态0：待审核，1：审核通过按时间显示状态，2：已拒绝
  stopTime: number; //	比赛周期结束时间
  tournamentLevel: string; // 赛事级别
  type: number; //	比赛类型
}

export interface MatchsRefund {
  id: number;
}

export interface MatchSettingsType {
  id: number;
  competitionCharter: string;
  competitionInstructions: string;
  registrationNote: string;
  ticketFee: string;
}

export async function fetchLandlordsMatch(params: LandlordsMatchParamsType) {
  return request(`/api/match/getMatchs`, { params: { ...params } });
}

export async function fetchLandlordsCommon(params: any) {
  return request(`/api/tmatch/list`, { params });
}

export async function updateMatchStates(
  params: MatchStatesParamsType,
): Promise<any> {
  const { id, status } = params;
  const formData = new FormData();
  formData.append('status', status);
  return request(`/api/match/updateMatchByUnCheck/${id}`, {
    method: 'PUT',
    data: formData,
  });
}

export async function changeLandlordsCommon(
  params: MatchSettingsType,
): Promise<any> {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/tmatch/update`, {
    method: 'PUT',
    data: formData,
  });
}

export async function addLandlordsMatch(params: MatchParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/match/addMatch`, {
    method: 'POST',
    data: formData,
  });
}

export async function addLandlordsCommon(params: MatchParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/tmatch/submit`, {
    method: 'POST',
    data: params,
  });
}

export async function changeMatchsRefund(params: MatchsRefund) {
  const { id } = params;
  return request(`/api/auth/refundByMatchScheduleId/${id}`);
}

export async function fetchMatchSettings() {
  return request(`/api/matchSZ/getMatchSZById/1`);
}

export async function updateMatchSettings(params: MatchSettingsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/matchSZ/updateMatchSZ`, {
    method: 'PUT',
    data: formData,
  });
}

export async function fetchReward(): Promise<any> {
  return request(`/api/lc/match/reward/levellist`);
}

// 删除比赛
export async function deleteMatch(params: {
  matchScheduleId: number;
}): Promise<any> {
  return request.delete(
    `/api/match/deleteMatchSchedule?matchScheduleId=${params.matchScheduleId}`,
  );
}
// 暂停比赛场比赛
export async function pauseMatch(params: { matchId: number }): Promise<any> {
  return request(`/api/match/stopMatch/   ${params.matchId}`, {
    method: 'PUT',
    requestType: 'form',
    data: { processStatus: 2 },
  });
}
// 暂停冠名场比赛
export async function pauseGMSMatch(params: { matchId: number }): Promise<any> {
  return request(`/api/naming/match/stopMatch/ ${params.matchId}`, {
    method: 'PUT',
    requestType: 'form',
    data: { processStatus: 2 },
  });
}
// 查询比赛详情
export async function fetchMatchInfo(params: { matchId: number }) {
  return request(`/api/match/getMatchById/${params.matchId}`);
}

// 修改未审核比赛
export async function updateMatch(params: MatchSettingsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/match/updateMatch`, {
    method: 'PUT',
    data: formData,
  });
}

// 查看赛已发奖记录
export async function fetchMatchRankinfo(params: any) {
  return request(`/api/match/rankinfo`, { params: { ...params } });
}

// =======================================================================================
//   _____                     __  __ _                _____       _
//  / ____|                   |  \/  (_)              / ____|     (_)
// | |  __ _   _  __ _ _ __   | \  / |_ _ __   __ _  | (___   __ _ _
// | | |_ | | | |/ _` | '_ \  | |\/| | | '_ \ / _` |  \___ \ / _` | |
// | |__| | |_| | (_| | | | | | |  | | | | | | (_| |  ____) | (_| | |
//  \_____|\__,_|\__,_|_| |_| |_|  |_|_|_| |_|\__, | |_____/ \__,_|_|
//                                            __/ |
//                                           |___/
// 冠名赛
// ========================================================================================
// 创建
export async function addLandlordsGMSMatch(params: any) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/naming/match/addMatch`, {
    method: 'POST',
    data: formData,
  });
}
// 集合
export async function fetchLandlordsGMSMatch(params: any) {
  return request(`/api/naming/match/getMatchs`, { params: { ...params } });
}
// 单个
export async function fetchLandlordsGMSMatchByID(params: { matchId: number }) {
  return request(`/api/naming/match/getMatchById/${params.matchId}`);
}
// 审核
export async function changeLandlordsGMSMatchState(
  params: MatchStatesParamsType,
): Promise<any> {
  const { id, status } = params;
  const formData = new FormData();
  formData.append('status', status);
  return request(`/api/naming/match/updateMatchByUnCheck/${id}`, {
    method: 'PUT',
    data: formData,
  });
}
// 删除
export async function deleteLandlordsGMSMatch(params: {
  matchScheduleId: number;
}): Promise<any> {
  const { matchScheduleId } = params;
  return request.delete(
    `/api/naming/match/deleteMatchSchedule?matchScheduleId=${matchScheduleId}`,
  );
}
