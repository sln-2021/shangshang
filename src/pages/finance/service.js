import request from '@/utils/request';
import _ from 'lodash';

// 获取金币产出
export async function queryGoldList(params) {
    return request('/api/gold', { params })
}

// 获取平台钻石产出
export async function queryRoomcardList(params) {
    return request('/api/roomcard', { params })
}

// 平台奖券产出
export async function queryTicketList(params) {
    return request('/api/matchticket', { params })
}

