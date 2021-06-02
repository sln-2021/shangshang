import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;  // 验证码备用
}

export async function userLogin(params: LoginParamsType) {
  const { userName, password } = params
  return request('/api/administrator/login', {
    method: 'POST',
    requestType: 'json',
    data: { username: userName, password },
  });
}

export async function logout() {
  return request('/api/administrator/logout');
}