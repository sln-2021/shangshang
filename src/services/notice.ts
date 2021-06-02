
import request from '@/utils/request';
import _ from "lodash";

export interface ProvisionalNoticeListParamsType {
    id: number;
    dateTime: string;
    rollingTimes: number;
    content: string;
    status: number;
    cludIds: string;
    conferenceIds: string;
    dateTimeL: string;
}

export interface NoticeListParamsType {
    id: number;
    message: string;
}


export interface NoticeParamsType {
    content: string;
}

export interface AddProvisionalNoticeParamsType {
    content: string;
    rollingTimes: number;
    dateTimeL: string;
}

export interface DeleteOrDetailProvisionalNoticeParamsType {
    clubId: number;
}


// 获取临时公告列表 
export async function fetchProvisionalNotice(params: ProvisionalNoticeListParamsType) {
    return request(`/api/message/getMessageTexts`,
        { params: { ...params } }
    );
}

// 获取默认公告
export async function fetchNotice(params: NoticeListParamsType) {
    return request(`/api/message/messageDefault/${params.id}`);
}

// 获取单个公告详情
export async function fetchNoticeDetail(params: DeleteOrDetailProvisionalNoticeParamsType) {
    const { id } = params
    return request(`/api/message/getMessageText/${id}`);
}

// 添加临时公告
export async function addProvisionalNotice(params: AddProvisionalNoticeParamsType) {
    const formData = new FormData();
    // 循环添加到formData中
    _(params).forEach((value, key) => {
        if (typeof (value) !== 'function') formData.append(key, value);
    })
    return request(`/api/message/addMessageText`, {
        method: 'POST',
        data: params
    });
}

// 修改默认公告
export async function changeNotice(params: NoticeParamsType) {
    const formData = new FormData();
    // 循环添加到formData中
    _(params).forEach((value, key) => {
        if (typeof (value) !== 'function') formData.append(key, value);
    })
    return request(`/api/message/updateMessageText`, {
        method: 'PUT',
        data: formData
    });
}






