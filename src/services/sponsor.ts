
import request from '@/utils/request';
import _ from "lodash";

export interface SponsorListParamsType {
    /**
    * 状态：0：未审核。1：审核。2, 拒绝
    */
    pageSize: number;
    pageNum: number;
    status?: 0 | 1 | 2;
}


export interface SponsorParamsType {
    /**
     * ID 
     * logo文件
     * 主办方名称
     */
    id: number;
    logoFile: any;
    name: string;
}

export interface DetailSponsorParamsType {
    id: number;
}


// 获取主办方列表
export async function fetchSponsor(params: SponsorListParamsType) {
    return request(`/api/league/getAllLeagues`,
        { params: { ...params } }
    );
}

// 修改主办方信息
export async function changeSponsor(params: SponsorParamsType) {
    const formData = new FormData();
    // 循环添加到formData中
    _(params).forEach((value, key) => {
        if (typeof (value) !== 'function') formData.append(key, value);
    })
    return request(`/api/league/updateLeague`, {
        method: 'PUT',
        data: formData
    });
}

// 获取主办方下拉列表
export async function fetchSponsorSelect() {
    return request(`/api/league/getLeagueNames`);
}

// 添加主办方
export async function addSponsor(params: SponsorParamsType) {
    const formData = new FormData();
    // 循环添加到formData中
    _(params).forEach((value, key) => {
        if (typeof (value) !== 'function') formData.append(key, value);
    })
    return request(`/api/league/addLeague`, {
        method: 'POST',
        data: formData
    });
}


// 获取主办方详情
export async function fetchSponsorDetail(params: DetailSponsorParamsType) {
    const { id } = params
    return request(`/api/league/getLeague/${id}`);
}
