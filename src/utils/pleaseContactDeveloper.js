// @ts-check
// <reference path="../types.d.ts" />

import { notification } from "antd";

/**
 * @param {string} why
 */
export function pleaseContactDeveloper(why) {
  why = String(why);

  try {
    localStorage.setItem(`oops.last.error.date`, new Date().toJSON());
    localStorage.setItem(`oops.last.error.why`, why);
  } catch (storageError) {
    // eslint-disable-next-line
    console.error(`Could not storage last error!`, storageError);
  }

  try {
    notification.error({
      // eslint-disable-next-line no-restricted-globals
      message: `错误 ${status}`,
      description: `错误原因: ${why}\n系统内部故障, 请联系开发人员维护.`,
      placement: 'bottomRight',
      duration: null,
    });
  } catch (antError) {
    // eslint-disable-next-line
    console.error(`Could not notify error!`, antError);
  }

  // eslint-disable-next-line
  alert(`系统内部故障, 请联系开发人员维护!\n` +
    `Inner exception, Please contact developer for maintenance!\n\n` +
    `原因(Reason):\n  ${why}`);
}

