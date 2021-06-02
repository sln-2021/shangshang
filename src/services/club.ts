import request from '@/utils/request';
import _ from 'lodash';

export interface ClubListParamsType {
  /**
   * 状态：0：未审核。1：审核。2, 拒绝
   */
  pageSize: number;
  pageNum: number;
  status?: 0 | 1 | 2;
}

export interface UnverifiedListParamsType {
  /**
   * 状态：0：未审核。1：审核。2, 拒绝
   */
  pageSize: number;
  pageNum: number;
  status?: 0 | 1 | 2;
}

export interface ClubParamsType {
  /**
   * 协办方状态: 0.未认证。1.认证。2.拒绝。
   */
  id: number;
  accountNumber: string;
  authTime: number;
  bonusTotal: number;
  bankBranch: string;
  bankName: string;
  businessLicenseFile: any;
  corporateAddress: string;
  corporateEmail: string;
  corporateId: string;
  corporateName: string;
  corporateFile: any;
  latitude: number;
  leagueId: number;
  conferenceId: number;
  logoFile: any;
  longitude: number;
  name: string;
  status?: 0 | 1 | 2;
}

export interface DeleteOrDetailClubParamsType {
  id: number;
}

// 获取协办方列表（带排名）
export async function fetchClub(params: ClubListParamsType) {
  return request(`/api/club/getAllClubsByOrder`, { params: { ...params } });
}

// 获取未认证列表
export async function fetchUnverified(params: UnverifiedListParamsType) {
  return request(`/api/club/getAllClubs`, { params: { ...params } });
}

// 修改协办方信息
export async function changeClub(params: ClubParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/club/updateClub`, {
    method: 'PUT',
    data: formData,
  });
}

// 获取协办方下拉列表
export async function fetchClubSelect() {
  return request(`/api/club/getClubNames`);
}

// 添加协办方
export async function addClub(params: ClubParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/club/addClub`, {
    method: 'POST',
    data: formData,
  });
}

export async function deleteClub(params: DeleteOrDetailClubParamsType) {
  const { id } = params;
  return request(`/api/club/deleteClub/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchClubDetail(params: DeleteOrDetailClubParamsType) {
  const { id } = params;
  return request(`/api/club/getClub/${id}`);
}

export async function fetchClubNumber() {
  return request(`/api/club/clubNumber`);
}
