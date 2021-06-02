import request from '@/utils/request';
import _ from 'lodash';


function addForm(params) {
  const formData = new FormData();
  // 循环添加到formData中
  _(params).forEach((value, key) => {
    if (typeof value !== 'function') formData.append(key, value);
  });
  return formData;
}


// 创建
export async function addBrandType(params) {
  const formData = addForm(params);
  return request(`/api/lc/brands/addtype`, {
    method: 'POST',
    data: formData,
  });
}

// 集合
export async function fetchBrandType(params) {
  return request(`/api/lc/brands/typelist`, { params: { ...params } });
}

// 集合 分页
export async function fetchBrandTypeList(params) {
  return request(`/api/lc/brands/typepagelist`, { params: { ...params } });
}

// 修改
export async function changeBrandType(params) {
  const formData = addForm(params);
  return request(`/api/lc/brands/updatetype`, {
    method: 'POST',
    data: formData,
  });
}




// 添加
export async function addBrand(params) {
  const formData = addForm(params);
  return request(`/api/lc/brands/add`, {
    method: 'POST',
    data: formData,
  });
}

// 修改
export async function changeBrand(params) {
  const formData = addForm(params);
  return request(`/api/lc/brands/update`, {
    method: 'PUT',
    data: formData,
  });
}

// 子集合
export async function fetchBrand(params) {
  const { typeId } = params
  return request(`/api/lc/brands/list?typeId=${typeId}`);
}


// 分层集合
export async function fetchBrandLevel() {
  return request(`/api/lc/brands/levellist`);
}
