import { Route } from '@/models/connect';
import pathRegexp from 'path-to-regexp';
import { parse } from 'querystring';
import * as XLSX from 'xlsx';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
	if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
		return true;
	}
	return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
	const { NODE_ENV } = process.env;
	if (NODE_ENV === 'development') {
		return true;
	}
	return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
	router: T[] = [],
	pathname: string,
): T | undefined => {
	const authority = router.find(
		({ routes, path = '/' }) =>
			(path && pathRegexp(path).exec(pathname)) ||
			(routes && getAuthorityFromRouter(routes, pathname)),
	);
	if (authority) return authority;
	return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
	let authorities: string[] | string | undefined;
	routeData.forEach((route) => {
		// match prefix
		if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
			if (route.authority) {
				authorities = route.authority;
			}
			// exact match
			if (route.path === path) {
				authorities = route.authority || authorities;
			}
			// get children authority recursively
			if (route.routes) {
				authorities = getRouteAuthority(path, route.routes) || authorities;
			}
		}
	});
	return authorities;
};

/**
 * 判断是否是数组
 *
 * @param arr
 * @return {boolean}
 */
export function isArray(arr) {
	return Object.prototype.toString.call(arr).toLowerCase() === '[object array]';
}

/**
 * 判断是否是对象
 *
 * @param obj
 * @return {boolean}
 */
export function isObject(obj) {
	return Object.prototype.toString.call(obj).toLowerCase() === '[object object]';
}
/**
 * 将数据输出为excel
 *
 * @param data
 * @param fileName
 */
export function downloadExcel(data, fileName = `${new Date().getTime()}.xlsx`) {
	if (!isArray(data) && !isObject(data)) {
		console.error('downloadExcel method must accept array or object!');
		return;
	}
	const sheetList = {};
	const wb = XLSX.utils.book_new();

	if (isObject(data)) {
		Object.keys(data).forEach((name) => {
			sheetList[name] = XLSX.utils.aoa_to_sheet(data[name]);
		});
	} else {
		sheetList.Sheet1 = XLSX.utils.aoa_to_sheet(data);
	}
	Object.keys(sheetList).forEach((name) => {
		XLSX.utils.book_append_sheet(wb, sheetList[name], name);
	});
	XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'base64' });
	XLSX.writeFile(wb, fileName);
}