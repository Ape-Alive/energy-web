import requestData from '../utils/requestData';

export async function getRoleList(params) {
	return requestData('/web-api/admin/role/list', params, 'GET');
}
export async function getRoleNameList(params) {
	return requestData('/web-api/admin/role/nameList', params, 'GET');
}

export async function createRole(params) {
	return requestData('/web-api/admin/role/create', params, 'POST');
}
export async function updateRole(params) {
	return requestData('/web-api/admin/role/update', params, 'POST');
}
export async function deleteRole(params) {
	return requestData(`/web-api/admin/role/delete?id=${params.id}`, {}, 'DELETE');
}
