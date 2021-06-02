import request from '@/utils/request';
import _ from 'lodash';

export interface MailAndPropParamsType {
  /**
   * propType:道具类型
   *       1.金币  2.比赛券  1003.文字内容
   *   type: 收件人类型
   *       0.俱乐部 1.分赛区 2.选手ID集合
   * */
  propType: 1 | 2 | 10003;
  propNum: number;
  type: 0 | 1 | 2;
  content: string;
  title: string;
  recipientIds?: string;
  recipientConferenceIds?: string;
  recipientClubIds?: string;
}

export interface MailAndPropParamsList {
  pageSize: number;
  pageNum: number;
}

export interface MailAndPropParamsDetail {
  id: number;
}

export async function addMailAndProp(params: MailAndPropParamsType) {
  // const formData = new FormData();
  // // 循环添加到formData中
  // _(params).forEach((value, key) => {
  //     if (typeof (value) !== 'function') formData.append(key, value);
  // })
  return request(`/api/mailprop/addMailProp`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchMailAndProp(params: MailAndPropParamsList) {
  return request(`/api/mailprop/getMailProps`, {
    params: { ...params },
  });
}

export async function fetchMailAndPropDetail(params: MailAndPropParamsDetail) {
  return request(`/api/mailprop/getMailProps`, {
    params: { ...params },
  });
}

// 根据邮箱ID获取详情
export async function fetchMailDetail(params: any) {
  return request(`/api/mailprop/getMails`, { params });
}
