import request from '@/utils/request';
import _ from 'lodash';

export interface OrganizerListParamsType {
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

export interface OrganizerParamsType {
  /**
   * ID
   * 缴纳金额
   * 协办方 / 渠道ID
   * 状态：0，未审核。1：审核。2, 拒绝，添加默认为0未审核
   * 所属类型：0，协办方。1，渠道
   */
  id: number; // 渠道id
  accountNumber: string; //	银行账号
  authTime: number; // 认证时间
  bonusTotal: number; // 缴纳金额
  bankBranch: number; //	开户支行
  bankName: string; // 银行名称
  businessLicenseFile: any; //	营业执照文件
  corporateAddress: string; // 公司地址
  corporateEmail: string; // 法人电子邮箱
  corporateId: string; //	法人证件号
  corporateName: string; // 法人名称
  corporateFile: any; // 法人证件文件
  latitude: number; //
  leagueId: number; // 主办方id
  logoFile: any; // logo文件
  longitude: number; //
  name: string; // 渠道名称
  status: string; // 渠道状态: 0.未认证。1.认证。2.拒绝。
}

export interface DeleteOrDetailOrganizerParamsType {
  id: number;
}

// 获取渠道列表（带排名）
export async function fetchOrganizer(params: OrganizerListParamsType) {
  return request(`/api/conference/getAllConferencesByOrder`, { params: { ...params } });
}

// 获取未认证列表
export async function fetchUnverified(params: UnverifiedListParamsType) {
  return request(`/api/conference/getAllConferences`, { params: { ...params } });
}

// 修改渠道信息
export async function changeOrganizer(params: OrganizerParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/conference/updateConference`, {
    method: 'PUT',
    data: formData,
  });
}

// 获取渠道下拉列表
export async function fetchOrganizerSelect() {
  return request(`/api/conference/getConferenceNames`);
}

// 添加渠道
export async function addOrganizer(params: OrganizerParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/conference/addConference`, {
    method: 'POST',
    data: formData,
  });
}

export async function DeleteOrganizer(params: DeleteOrDetailOrganizerParamsType) {
  const { id } = params;
  return request(`/api/conference/deleteConference/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchOrganizerDetail(params: DeleteOrDetailOrganizerParamsType) {
  const { id } = params;
  return request(`/api/conference/getConference/${id}`);
}

export async function fetchOrganizerNumber() {
  return request(`/api/conference/conferenceNumber`);
}

export async function fetchOrganizerTree() {
  return request(`/api/conference/getConferenceNamesByGroupId`);
}
