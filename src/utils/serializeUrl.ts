/* eslint-disable no-restricted-globals */
export const serializeUrl = (str: string): any => {
  const param = {};
  const hash = {};
  const anchor = {};
  const url = str || location.href;
  const arr = /([^?]*)([^#]*)(.*)/.exec(url);
  const ar1 = /^(http|ftp)/.test(arr[1])
    ? /(.*?:)?(?:\/?\/?)([\.\w]*)(:\d*)?(.*?)([^\/]*)$/.exec(arr[1])
    : /(.*?)([^\/]*)$/.exec(arr[1]);
  const ar2 = arr[2].match(/[^?&=]*=[^?&=]*/g);
  const ar3 = arr[3].match(/[^#&=]*=[^#&=]*/g);

  if (ar2) {
    for (let i = 0, l = ar2.length; i < l; i++) {
      const ar22 = /([^=]*)(?:=*)(.*)/.exec(ar2[i]);
      param[ar22[1]] = ar22[2];
    }
  }

  if (ar3) {
    for (let i = 0, l = ar3.length; i < l; i++) {
      let ar33 = /([^=]*)(?:=*)(.*)/.exec(ar3[i]);
      hash[ar33[1]] = ar33[2];
    }
  }

  if (arr[3] && !/[=&]/g.test(arr[3])) {
    anchor = arr[3];
  }

  !/^(http|ftp)/.test(arr[1]) &&
    ar1.splice(1, 0, undefined, undefined, undefined);

  function getUrl() {
    let that = this,
      url = [],
      param = [],
      hash = [];

    url.push(
      that.protocol,
      (that.protocol && '//') || '',
      that.host,
      that.port,
      that.path,
      that.file
    );

    for (let p in that.param) {
      param.push(p + '=' + that.param[p]);
    }

    for (let p in that.hash) {
      hash.push(p + '=' + that.hash[p]);
    }

    url.push((param.length && '?' + param.join('&')) || '');

    if (that.anchor) {
      url.push(that.anchor);
    } else {
      url.push((hash.length && '#' + hash.join('&')) || '');
    }

    return url.join('');
  }

  return {
    href: arr[0],
    protocol: ar1[1],
    host: ar1[2],
    port: ar1[3] || '',
    path: ar1[4],
    file: ar1[5],
    param: param,
    hash: hash,
    anchor: anchor,
    getUrl: getUrl,
  };
};


