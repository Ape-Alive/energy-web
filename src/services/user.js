import request from '@/utils/request'
import requestData from '../utils/requestData'

export async function query() {
	return request('/api/users')
}

export async function getUserList(params) {
	return requestData('/web-api/admin/user/list', params, 'GET')
}
export async function getRoleList(params) {
	return requestData('/web-api/admin/role/nameList', params, 'GET')
}
export async function disableUser(params) {
	return requestData('/web-api/admin/user/disable', params, 'POST')
}
export async function createUser(params) {
	return requestData('/web-api/admin/user/create', params, 'POST')
}
export async function updateUser(params) {
	return requestData('/web-api/admin/user/update', params, 'POST')
}
export async function enableUser(params) {
	return requestData('/web-api/admin/user/enable', params, 'POST')
}
export async function deleteUser(params) {
	return requestData(`/web-api/admin/user/delete?id=${params.id}`, {}, 'DELETE')
}
export async function resetPassword(params) {
	return requestData('/web-api/admin/user/resetPassword', params, 'POST')
}
export async function incomegetAll(params) {
	return requestData('/web-api/admin/income/getAll', params, 'GET')
}
export async function incomeAdminGetAll(params) {
	return requestData('/web-api/admin/income/adminGetAll', params, 'GET')
}
export async function entireOplogList(params) {
	return requestData('/web-api/admin/entireOplog/list', params, 'GET')
}

