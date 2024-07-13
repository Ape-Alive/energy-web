// @flow

import queryString from 'query-string';

import JSON5 from 'json5';

import fetch from 'dva/fetch';

// require('fetch-ie8');

// const isomorphicFetch = window.fetch;

export type ResponseType = {
  response: Object | null;
  code: number;
  errorMsg: string | null;
  data: any;
};

const timeout = (ms, promise): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
};

const checkStatus = (response): string | null => {
  if (response.status >= 200 && response.status < 300) {
    return null;
  }

  return `服务器异常:${response.status}`;
};

export default (async function fetchFunction(
  url: string,
  options?: {
    method?: 'POST' | 'GET';
    postType?: null | 'x-www-form-urlencoded';
    headers?: Object;
    body?: any;
    param?: Object; // 参数列表
    dataType?: 'json' | 'text'; // 自动解析格式
    timeout?: number; // 超时时间
  },
): Promise<ResponseType> {
  let urlTemp = url;
  const optionsTemp = { ...(options || {}) };

  optionsTemp.method = optionsTemp.method || 'GET';
  optionsTemp.dataType = optionsTemp.dataType || 'json';
  optionsTemp.timeout = optionsTemp.timeout || 60 * 1000; // 超时时间默认60秒

  optionsTemp.credentials = 'include';

  // get请求拼参数
  if (optionsTemp.method === 'GET' && !!optionsTemp.param) {
    const paramString = queryString.stringify(optionsTemp.param);
    urlTemp = `${urlTemp}?${paramString}`;
  }

  // post特殊请求拼参数
  if (optionsTemp.method === 'POST' && !!optionsTemp.param) {
    // x-www-form-urlencoded 类型处理
    if (optionsTemp.postType === 'x-www-form-urlencoded') {
      // 增加header参数
      optionsTemp.headers = optionsTemp.headers || {};
      optionsTemp.headers = {
        ...optionsTemp.headers,

        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // 拼参数
      const formBodyArray = [];
      Object.keys(optionsTemp.param).forEach((property) => {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(optionsTemp.param[property]);
        formBodyArray.push(`${encodedKey}=${encodedValue}`);
      });
      optionsTemp.body = formBodyArray.join('&');
    }

    if (!optionsTemp.postType) {
      optionsTemp.headers = optionsTemp.headers || {};
      optionsTemp.headers = {
        ...optionsTemp.headers,

        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      };
      const formData = new URLSearchParams();
      Object.keys(optionsTemp.param).forEach((key) => {
        const value = optionsTemp.param[key];
        if (value === undefined || value === null) {
          return;
        }
        formData.append(key, value);
      });
      optionsTemp.body = formData;
    }
  }

  let response = null;
  let code = 0;
  let errorMsg = null;
  try {
    // ie8 兼容版本
    // response = await isomorphicFetch(url, optionsTemp);

    // rn 默认版本
    // response = await fetch(urlTemp, optionsTemp);

    // 支持超时设置版本
    response = await timeout(optionsTemp.timeout, fetch(urlTemp, optionsTemp));
    errorMsg = checkStatus(response);
  } catch (error) {
    code = -1;
    errorMsg = '无法连接服务器';

    if (error.message === 'timeout') {
      errorMsg = '网络超时';
    }
  }

  let data = null;
  if (errorMsg == null && response && response.json && response.text) {
    try {
      if (optionsTemp.dataType === 'json') {
        const text = await response.text();
        data = JSON5.parse(text); // 修复json不是严格模式的问题
      } else {
        data = await response.text();
      }
    } catch (e) {
      errorMsg = '解析错误';
      response = {
        data: {
          returnCode: 1,
          returnMessage: '解析错误',
        },
      };
    }
  }

  // if (response.headers.get('x-total-count')) {
  //   ret.headers['x-total-count'] = response.headers.get('x-total-count');
  // }

  return {
    response,
    code,
    errorMsg,
    data,
  };
});
