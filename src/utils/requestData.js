import { message } from 'antd'
import { stringify } from 'qs'
import { getToken, getTokenType, getTraceid } from './authority'
import request from './request'

const getAuthorization = () => {
	const accessToken = getToken() || ''
	if (!accessToken) {
		return
	}
	const tokenType = getTokenType() || 'bearer'
	return `${tokenType} ${accessToken}`
}

// url-请求地址  params-参数  method-请求方式
//
// export default connect(({  }) => ({
//
// }))(requestData);

function afterRequest(response) {
	if (response) {
		if (response.code !== '000000') {
			message.error(`${response.error ? response.error : response.msg}`)
		}
		// else if (isJson(response.data) === false) {
		//   message.error('返回的数据非标准json格式');
		// }
	} else {
		// todo message.error('数据请求失败');
	}
	return response
}

export default function requestData(url, params, method = 'GET', option = {}) {
	const Authorization = getAuthorization()
	const Traceid = getTraceid()
	// if (!Authorization && url !== '/api/login'){
	//   dispatch(routerRedux.replace('/user/login'));
	//
	//   return;
	// }
	let responseData
	try {
		if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
			responseData = request(url, {
				...option,
				method,
				// ...params,
				body: params,

				headers: {
					Traceid,
					Authorization
				}
			}).then((response) => {
				return afterRequest(response)
			})
		} else if (method.toUpperCase() === 'GET') {
			responseData = request(
				url +
				(params ?
					typeof params === 'object' ?
						`?${stringify(params)}` :
						`?${params}` :
					''),
				{
					...option,
					method,

					headers: {
						Traceid,
						Authorization
					}
				}
			).then((response) => {

				return afterRequest(response)
			})
		} else if (method.toUpperCase() === 'DELETE') {
			responseData = request(url, {
				...option,
				method,
				headers: {
					Traceid,
					Authorization
				}
			}).then((response) => {
				return afterRequest(response)
			})
		} else if (method.toUpperCase() === 'BLOB') {
			responseData = request(url, {
				...option,
				method: 'POST',
				responseType: 'blob',
				body: params,
				headers: {
					Traceid,
					Authorization
				}
			}).then((response) => {
				return response
			})
		} else {
			message.error('请求方式有误')
		}
	} catch (e) {
		console.error('requestData error: ', e)
	}
	return responseData
}
export function download(blobUrl) {
	const a = document.createElement('a');
	a.download = '<文件名>';
	a.href = blobUrl;
	a.click();
}


export function getAuthToken() {
	return { Authorization: getAuthorization() }
}
