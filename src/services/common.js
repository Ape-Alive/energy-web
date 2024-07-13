import requestData from '../utils/requestData'

export async function queryRegion(params, refresh = false) {
	return requestData('/web-api/v1/gis/region/tree', params, 'GET', {
		expirys: refresh ? false : 3600,
		enableCache: true
	})
}

export async function getRegionInfo(params) {
	return requestData(
		`/web-api/v1/gis/region/info/${params.code}`,
		params,
		'GET'
	)
}
export async function getDirectory(params) {
	return requestData('/web-api/admin/directory/all', params, 'GET')
}
export async function menuTree(params) {
	return requestData('/web-api/admin/directory/menuTree', params, 'GET')
}
export async function getDirectoryContinentCountry(params) {
	return requestData('/web-api/admin/directory/continentCountry', params, 'GET')
}
