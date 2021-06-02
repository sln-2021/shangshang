// @ts-check

/*
  存储 Token 的模块
*/
import _ from 'lodash';
import { debugEcho } from './debug';

export interface TokenInfoType {
  /** 详细解释请看根目录下 NOTES.md */
  bz: string;
  clubId: number;
  conferenceId: number;
  id: number;
  leagueId: number;
  userStatus: -1 | 1 | 2 | 3 | 4 | 5 | 6;
  userType:
    | 'root'
    | 'superAdmin'
    | 'admin'
    | 'superOrganizers'
    | 'organizers'
    | 'superClub'
    | 'club'
    | 'playeradmin'
    | 'UNAUTHCONFERENCEUSER'
    | 'UNAUTHCLUBUSER'
    | 'UNAUTHCONFERENCEUSERSUBMIT'
    | 'UNAUTHCLUBUSERSUBMIT';
  username: string;
}

const key: string = 'I.am.a.key.for.msl.token';
let tokenInfo: TokenInfoType | null = null;
const roleGuest: string = 'guest';

function fatal(reason: string): void {
  // eslint-disable-next-line
  alert(
    `系统内部故障, 请联系开发人员维护!\n` +
      `Inner exception, Please contact developer for maintenance!\n\n` +
      `原因(Reason):\n  ${reason}`,
  );
}

function loadFromLocalStorage(): TokenInfoType | null {
  const json: string | null = localStorage.getItem(key);
  if (!json) return null;
  try {
    tokenInfo = JSON.parse(json);
  } catch (ex) {
    fatal(`localStorage 存储异常 (非有效JSON)`);
    localStorage.removeItem(key);
    return null;
  }
  console.log(tokenInfo,'takeinfo')
  return tokenInfo;
}

export function clearTokenInfo(): void {
  tokenInfo = null;
  localStorage.removeItem(key);
}

export function saveTokenInfo(info: TokenInfoType) {
  // 验证 tokenInfo
  if (!info) return fatal(`tokenInfo 是空的`);
  if (!info.userType) return fatal(`tokenInfo.userType 是空的`);
  //eslint-disable-next-line
  localStorage.setItem(key, JSON.stringify(info));
  tokenInfo = info;
}

export function getAuthorityRole() {
  if (!tokenInfo) loadFromLocalStorage();
  if (!tokenInfo) return roleGuest;
  return debugEcho(`${tokenInfo.userType}`);
}

export function getUserType(): string | null {
  if (!tokenInfo) loadFromLocalStorage();
  if (!tokenInfo) return null;
  return debugEcho(`${tokenInfo.userType}`);
}

export function getUserStatus(): string | null {
  if (!tokenInfo) loadFromLocalStorage();
  if (!tokenInfo) return null;
  return debugEcho(`${tokenInfo.userStatus}`);
}

export function getId(type: string): string | null {
  if (!tokenInfo) loadFromLocalStorage();
  if (!tokenInfo) return null;
  return debugEcho(`${tokenInfo[type]}`);
}
