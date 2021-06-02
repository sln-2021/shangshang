import request from '@/utils/request';
import _ from 'lodash';


// 广告
// 获取广告配置
export async function fetchSystemAd() {
  return request(`/api/ad/getSystemAd`);
}

// 修改
export async function changeSystemAd(params) {
  return request(`/api/ad/updateAd`, {
    method: 'PUT',
    data: params,
  });
}


// 
// 获取绑定手机和下载登录奖励设置
export async function fetchLcsz() {
  return request(`/api/lc/sz/getlcsz`);
}

// 修改绑定手机和下载登录奖励设置
export async function changeLcsz(params) {
  return request(`/api/lc/sz/updatelcsz`, {
    method: 'PUT',
    data: params,
  });
}

