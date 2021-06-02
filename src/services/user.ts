import request from '@/utils/request';
import _ from 'lodash';

export interface UserStatParamsType {
  /**
   * 状态：-1：封停 1：解封
   */
  groupId: number;
  groupType: number;
  status?: -1 | 1;
}

export interface AddUserParamsType {
  /**
   * 用户名
   * 密码
   * 备注
   * 用户类型
   *  - 1：禁止登录，
   *    0：渠道游客待认证，（主办方添加渠道用户账号时）
   *    1：正常状态用户(主办方，渠道，协办方添加账户时)
   *    2.协办方游客待认证（渠道添加协办方用户账号时）
   * 渠道，协办方认证费
   */
  username: string;
  password: string;
  bz: string;
  userStatus: -1 | 0 | 1 | 2;
  authFee?: number;
}

export interface UserInfoParamsType {
  /**
   * 用户id  用户名 主办方id  渠道id 协办方id  旧密码  新密码  开户支行
   */
  id: number;
  username?: string;
  leagueId?: number;
  conferenceId?: number;
  clubId?: number;
  oldPassword?: string;
  newPassword?: string;
  bz?: string;
}

export interface UserListParamsType {
  /**禁止登录 | 游客待认证 |*/
  id: string;
  userName: string;
  userStatus: -1 | 0 | 1;
  bz: string;
}

export interface DeleteOrDetailUserParamsType {
  id: number;
}

export interface SubordinateListParamsType {
  pageSize: number;
  pageNum: number;
  username?: string;
  leagueName?: string;
  conferenceName?: string;
  clubName?: string;
}

// 禁止登录 / 解锁
export async function changeUserState(params: UserStatParamsType) {
  const { groupId } = params;
  return request(`/api/user/updateLoginStatusByGroupId/${groupId}`, {
    method: 'PUT',
    params: { ..._.pick(params, 'groupType', 'status') },
  });
}

// 添加用户
export async function addUsers(params: AddUserParamsType) {
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

// 修改用户信息
export async function changeUserInfo(params: UserInfoParamsType) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return request(`/api/user/updateUserInfomation`, {
    method: 'PUT',
    data: formData,
  });
}

// 获取同级用户列表
export async function fetchAdminUsers(params: UserListParamsType) {
  return request(`/api/user/getUserS`, { params: { ...params } });
}

// 重置用户密码
export async function changeRestPassword(params: DeleteOrDetailUserParamsType) {
  return request(`/api/user/updateUserPassword/${params.id}`, {
    method: 'PUT',
  });
}

// 删除用户
export async function deleteUser(params: DeleteOrDetailUserParamsType) {
  return request(`/api/user/deleteUserById/${params.id}`, {
    method: 'DELETE',
  });
}

// 获取下级协办方/渠道/主办方下所有用户
export async function fetchSubordinate(params: SubordinateListParamsType) {
  return request(`/api/user/getUserSByQuery`, { params: { ...params } });
}

// 添加财务管理员
export async function addFinance(params: { username: string, password: string, bz: string }) {
  return request(`/api/user/addcaiwu`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  })
}
// 添加运营管理员

export async function addPlayer(params: { username: string, password: string, bz: string }) {
  return request(`/api/user/addplayer`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  })
}
export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function queryUserInfo(): Promise<any> {
  return request(`/api/user/getUserInfo`);
}
