import request from '@/utils/request';
import _ from 'lodash';

// 创建
export async function addRedeemCode(params) {
  // const formData = addForm(params);
  return request(`/api/lc/code/add`, {
    method: 'POST',
    data: params,
  });
}

//  集合 分页
export async function fetchRedeemCode(params) {
  return request(`/api/lc/code/list`, { params: { ...params } });
}


// 修改
export async function changeRedeemCode(params) {
  return request(`/api/lc/code/update`, {
    method: 'PUT',
    data: params,
  });
}

// 删除
export async function deleteRedeemCode(id) {
  return request(`/api/lc/code/del?id=${id}`, {
    method: 'DELETE',
  });
}
