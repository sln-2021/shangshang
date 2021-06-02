import request from '@/utils/request';
import _ from 'lodash';
export interface LoadOnlineParamsType {
    pageSize: number;
    pageNum: number;
}
export interface RealTimeParamsType {

}
export interface loadOnlineNumberType {

}
export async function fetchNewList(params: RealTimeParamsType) {
    return request(`/api/index/getSummary`, { params: { ...params } });
}
export async function fetchOnlineList(params: any) {
    const resp = request(`/c/user/rpcinterface.json?eventname=user.getusercount&argtablestr={}`, {
        params: { ...params },
    })
    console.log(resp, Object.prototype.toString.call(resp))
    return resp
}
