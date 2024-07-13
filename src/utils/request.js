import { setAuthority, setToken, setTokenType, setTraceid } from '@/utils/authority';
import { notification } from 'antd';
import fetch from 'dva/fetch';
import hash from 'hash.js';
import { stringify } from 'querystring';
import { history } from 'umi';
const codeMessage = {
	200: '服务器成功返回请求的数据。',
	201: '新建或修改数据成功。',
	202: '一个请求已经进入后台排队（异步任务）。',
	204: '删除数据成功。',
	400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
	401: '用户没有权限（令牌、用户名、密码错误）。',
	403: '用户得到授权，但是访问是被禁止的。',
	404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
	406: '请求的格式不可得。',
	410: '请求的资源被永久删除，且不会再得到的。',
	422: '当创建一个对象时，发生一个验证错误。',
	500: '服务器发生错误，请检查服务器。',
	502: '网关错误。',
	503: '服务不可用，服务器暂时过载或维护。',
	504: '网关超时。',
};

const loginOut = () => {
	const { query = {}, search, pathname } = history.location

	const { redirect } = query // Note: There may be security issues, please note
	if (window.location.pathname !== '/user/login' && !redirect) {
		history.replace({
			pathname: '/user/login',
			search: stringify({
				redirect: pathname + search
			})
		})
	}
}

const checkStatus = (response) => {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	const errortext = codeMessage[response.status] || response.statusText;

	if (response.status <= 504 && response.status >= 500) {
		notification.error({
			message: `请求错误 ${response.status}: ${response.url}`,
			description: errortext,
		});
	}
	const error = new Error(errortext);
	error.name = response.status;
	error.response = response;
	throw error;
};

const cachedSave = (response, hashcode) => {
	/**
	 * Clone a response data and store it in sessionStorage
	 * Does not support data other than json, Cache only json
	 */
	const contentType = response.headers.get('Content-Type');
	if (contentType && contentType.match(/application\/json/i)) {
		// All data is saved as text
		response
			.clone()
			.text()
			.then((content) => {
				sessionStorage.setItem(hashcode, content);
				sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
			});
	}
	return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
	const options = {
		expirys: 60,
		enableCache: false,
		...option,
	};
	/**
	 * Produce fingerprints based on url and parameters
	 * Maybe url has the same parameters
	 */
	const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
	const hashcode = hash.sha256().update(fingerprint).digest('hex');

	const defaultOptions = {
		credentials: 'include',
	};
	const newOptions = { ...defaultOptions, ...options };
	if (
		newOptions.method === 'POST' ||
		newOptions.method === 'PUT' ||
		newOptions.method === 'DELETE'
	) {
		if (!(newOptions.body instanceof FormData)) {
			newOptions.headers = {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				...newOptions.headers,
			};
			newOptions.body = JSON.stringify(newOptions.body);
		} else {
			// newOptions.body is FormData
			newOptions.headers = {
				Accept: 'application/json',
				...newOptions.headers,
			};
		}
	}

	const expirys = options.expirys;
	// options.expirys !== false, return the cache,
	if (options.expirys !== false) {
		const cached = sessionStorage.getItem(hashcode);
		const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
		if (cached !== null && whenCached !== null) {
			const age = (Date.now() - whenCached) / 1000;
			if (age < expirys) {
				const response = new Response(new Blob([cached]));
				return response.json();
			}
			sessionStorage.removeItem(hashcode);
			sessionStorage.removeItem(`${hashcode}:timestamp`);
		}
	}
	if (newOptions.responseType === "blob") {
		return fetch(url, newOptions)
			.then(checkStatus)
			.then(newOptions.enableCache ? (response) => cachedSave(response, hashcode) : false)
			.then(res => {
				if (res.status === 204) {
					return res.text();
				}
				return res.blob()
			})
			.then(data => {
				return window.URL.createObjectURL(data);
			})
			.catch((e) => {
				const status = e.name;
				if (status === 401) {
					setToken('')
					setAuthority('')
					setTokenType('bearer')
					setTraceid('')
					loginOut()
				}
				// environment should not be used
				if (status === 403) {
					history.push('/exception/403');
					return;
				}

			});
	}
	return fetch(url, newOptions)
		.then(checkStatus)
		.then(newOptions.enableCache ? (response) => cachedSave(response, hashcode) : false)
		.then((response) => {
			// DELETE and 204 do not return data by default
			// using .json will report an error.

			if (response.status === 204) {
				return response.text();
			}

			response
				.clone()
				.json()
				.then(({ code, msg }) => {
					if (code === '000520' || code === '000521' || code === '000522' || code === '000523') {
						notification.error({
							message: `error`,
							description: msg,
						});
						history.push('/user/login');

					}
				});

			return response.json();
		})
		.catch((e) => {

			const status = e.name;
			if (status === 401) {
				setToken('')
				setAuthority('')
				setTokenType('bearer')
				setTraceid('')
				loginOut()
			}
			// environment should not be used
			if (status === 403) {
				history.push('/exception/403');
				return;
			}
			// if (status <= 504 && status >= 500) {
			//   history.push('/exception/500');
			//   return;
			// }
			// if (status >= 404 && status < 422) {
			//   history.push('/exception/404');
			// }
		});
}

