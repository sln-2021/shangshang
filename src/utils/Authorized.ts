import RenderAuthorize from '@/components/Authorized';
import { getAuthorityRole } from './tokenStorage';
import { getAuthority } from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let Authorized = RenderAuthorize(getAuthorityRole());
// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthorityRole());
};

/**
 * hard code
 * block need it。
 */
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
