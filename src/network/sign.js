import * as crypto from "crypto";


function joint(obj = {}, ignoreSign = true) {
  return Object.keys(obj).sort().reduce((str, key) => {
      if (ignoreSign && (key == 'sign')) {
          return str;
      }

      str = str + (str.length > 0 ? '&' : '');
      const value = obj[key];

      if (Array.isArray(value)) {
          str = str + `${key}=${value.join(',')}`;
      } else if ((typeof value) == 'object') {
          str = str + joint(value, false);
      } else {
          str = str + `${key}=${value}`;
      }

      return str;
  }, '');
}

function md5(origin) {
  return crypto.createHash('md5').update(origin).digest('hex');
}

export function signature(obj) {
  let string = joint(obj);
  string = 'oj)$&!@' + string + '@#jfanb*(.&%$s';
  let sign = md5(string);
  return sign;
}

export const __HY__TEST__ = '!HGRS%4*(GH*(%3HKP}W||Ghc^$%Wch96';

// const LZString = require("lz-string");
import LZString from 'lz-string'
export function zipUtf16(str) {
  return JSON.parse(LZString.decompressFromUTF16(str));
}