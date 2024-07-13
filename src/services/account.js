import requestData from '../utils/requestData'

export async function menuTree(params) {
	return requestData('/web-api/admin/account/menuTree', params, 'GET')
}
export async function userChangeInfo(params) {
	return requestData('/web-api/admin/account/changeInfo', params, 'POST')
}
export async function getUserInfo(params) {
	return requestData('/web-api/admin/account/info', params)
}
export async function updateUserInfo(params) {
	return requestData('/web-api/admin/info/update', params, 'POST')
}
export async function changepwd(params) {
	return requestData('/web-api/admin/account/changepwd', params, 'POST')
}
export async function register(params) {
	return requestData('/web-api/customer/account/register', params, 'POST')
}
export async function sendPwdCode(params) {
	return requestData('/web-api/admin/code/forgetpwd', params, 'GET')
}
export async function sendRegCode(params) {
	return requestData('/web-api/admin/account/sendRegCode', params, 'GET')
}
export async function sendRegCodeRegister(params) {
	return requestData('/web-api/customer/code/register', params, 'GET')
}
export async function forgetPassword(params) {
	return requestData('/web-api/admin/account/forgetpwd', params, 'POST')
}
export async function sendUpdateCode(params) {
	return requestData('/web-api/admin/account/sendUpdateCode', params, 'GET')
}
export async function oplogList(params) {
	return requestData('/web-api/admin/oplog/list', params, 'GET')
}
export async function tokenList(params) {
	return requestData('/web-api/admin/token/list', params, 'GET')
}
export async function tokenDetail(params) {
	return requestData('/web-api/admin/token/detail', params, 'GET')
}
export async function tokenCreate(params) {
	return requestData('/web-api/admin/token/create', params, 'GET')
}
export async function userInfoGet(params) {
	return requestData('/web-api/admin/info/get', params, 'GET')
}
