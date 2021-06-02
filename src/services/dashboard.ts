
import request from '@/utils/request';
import _ from "lodash";

export interface DashboardParamsType {
    startTime: string;
    stopTime: string;
}

// 获取首页展示数据
export async function fetchStatistics(params: DashboardParamsType) {
    return request(`/api/index/getGroupSummary`,
        { params: { ...params } }
    );
}




