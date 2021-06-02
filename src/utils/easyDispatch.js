// @ts-check

/*
  一个用于简单快速 Dispatch 的
*/

// @ts-ignore
import { routerRedux } from 'dva';

/**
 * 这种注入方法到类里面的形式，推荐作为修饰符来使用:
 * Example:
 *
 * \@initEasyDispatch()
 * export default class TestComponent {
 *  ...
 */
export function initEasyDispatch() {
  return function createEasyDispatchComponent(Component) {
    Component.prototype.easyDispatch = function _easyDispatch(type, payload) {
      this.props.dispatch({ type, payload });
    };
    Component.prototype.easyRouteTo = function _easyRouteTo(routePath) {
      this.props.dispatch(routerRedux.push(routePath));
    };
    return Component;
  }
}

/**
 * 使用方法(this 必须含有 props.dispatch 方法):
 * easyDispatch(this, 'global/fetchUser', {onError: ...});
 *
 * @param {any} thisContext
 * @param {string} type
 * @param {any} payload
 */
export async function easyDispatch(thisContext, type, payload = {}) {
  return new Promise((resolve, reject) => resolve(thisContext.props.dispatch({ type, payload })));
}

/**
 * 使用方法(this 必须含有 props.dispatch 方法):
 * easyRouteTo(this, 'user/login');
 *
 * @param {any} thisContext
 * @param {string} routePath
 */
export function easyRouteTo(thisContext, routePath) {
  thisContext.props.dispatch(routerRedux.push(routePath));
}
