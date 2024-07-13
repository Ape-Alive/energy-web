// @flow
/* global Generator */
// import { Toast } from 'antd-mobile';
// import JSON5 from 'json5';

// import UrlPath from '../utils/url';
import fetch from './fetch';

import { createAction } from '../utils';

// import router from '../router';

// 同时加载的数量
let loadingCount = 0;

const showLoaddingView = () => {
  loadingCount += 1;
  if (loadingCount !== 1) {
    return false;
  }
  // Toast.loading('数据加载中...', 0);
};

const hideLoaddingView = () => {
  loadingCount -= 1;
  if (loadingCount !== 0) {
    return false;
  }
  // Toast.hide();
};

const sendErrorMessage = function*(put: Function, errorMessage: string) {
  yield put(
    createAction('errorMessage/putMessage')({
      putErrorMessage: {
        key: 'network_error',
        message: errorMessage,
      },
    }),
  );
};

// const logout = function*(put: Function) {
//   if (history.location.pathname === '/') {
//     return;
//   }

//   yield put(
//     createAction('login/saveLoginState')({
//       userInfo: {},
//       auto: false,
//       password: null,
//       loginName: null,
//     }),
//   );

//   history.push('/');
// };

let lastIsNetworkError = false; // 上一次是否是网络错误，用于判断当前是否需要弹出错误提示

const dataFetch = function*(
  url: string,
  options?: {
    method?: 'POST' | 'GET';
    postType?: null | 'x-www-form-urlencoded';
    headers?: Object;
    body?: any;
    param?: Object; // 参数列表
    dataType?: 'json' | 'text'; // 自动解析格式
    timeout?: number; // 超时时间
    jsonp?: boolean; // 是否使用jsonp调用
  },
  put: Function,
  showLoadding: boolean,
) {
  console.log('start ', url);

  showLoadding && showLoaddingView();
  let response = null;

  response = yield fetch(url, options);
  showLoadding && hideLoaddingView();

  console.log('end ', url);

  // 网络异常提示
  if (response.errorMsg === '无法连接服务器') {
    if (showLoadding && lastIsNetworkError === false) {
      lastIsNetworkError = true;
      yield sendErrorMessage(put, response.errorMsg);
    }

    return response;
  }

  lastIsNetworkError = false;

  if (response.errorMsg) {
    // if (showLoadding) {
    yield sendErrorMessage(put, response.errorMsg);
    // }
    return response;
  }

  if (response.data.resultCode === '2001' || response.data.resultMsg === '用户未登录') {
    const href = window.location.origin;
    window.location.href = `${href}/#/Login`;
    return;
  }
  if (response.data === null) {
    // Toast.fail('接口异常');
    const errorInfo = {
      data: {
        returnCode: 1,
        returnMessage: '接口异常',
      },
    };
    return errorInfo;
  }

  // // url被重定向，手动跳转登录页面
  // if (
  //   // response.data.returnCode === 2 ||
  //   response.data.returnCode === '6' ||
  //   response.data.returnMessage === 'openId 失效' ||
  //   response.data.returnMessage === '获取用户信息失败'
  // ) {
  //   // Toast.info('登录失效，请重新登录');
  //   Toast.info(
  //     `错误信息：returnCode:${response.data.returnCode},message:${
  //       response.data.returnMessage
  //     }`,
  //   );
  //   window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
  //     window.appId
  //   }&redirect_uri=${
  //     window.url
  //   }?beanName=appWxLoginManager&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
  //   return response;
  // }

  if (options && options.dataType === 'text') {
    return response;
  }

  const responseDate = response.data;

  // if (responseDate.message === 'unlogin') {
  //   response.errorMsg = '登录失效，请重新登录';
  //   if (showLoadding) {
  //     yield sendErrorMessage(put, response.errorMsg);
  //   }

  //   yield logout(put);

  //   return response;
  // }

  // 第一层服务端异常封装
  if (responseDate.returnCode !== 0) {
    const message = responseDate.message || responseDate.msg || responseDate.returnMessage;
    response.errorMsg = `提示:${message}`;
    // if (showLoadding) {
    yield sendErrorMessage(put, response.errorMsg);
    // }
    return response;
  }

  // 第二层服务端异常封装
  // if (
  //   responseDate.data &&
  //   typeof responseDate.data === 'string' &&
  //   responseDate.data.startsWith('{') &&
  //   responseDate.data.endsWith('}')
  // ) {
  //   const parseData = JSON5.parse(responseDate.data);
  //   if (
  //     parseData.isSuccess !== true &&
  //     !parseData.isSuccess &&
  //     parseData.success !== true &&
  //     parseData.token === undefined
  //   ) {
  //     const message = parseData.message || parseData.msg;
  //     response.errorMsg = `错误提示:${message}`;

  //     if (showLoadding) {
  //       yield sendErrorMessage(put, response.errorMsg);
  //     }
  //     return response;
  //   }
  // }

  return response;
};

export default dataFetch;
