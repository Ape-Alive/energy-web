import { getDirectory, getDirectoryContinentCountry, getRegionInfo, menuTree, queryRegion } from '@/services/common';

const convertRegionTreeToMap = (tree, data = {}) => {
	let map = {};
	tree.forEach((item) => {
		const childData = { ...data };
		const { name, code, type } = item;
		childData[type] = name;
		map[item.code] = { name, code, type, ...childData };
		map[item.code].fullName =
			(map[item.code].province ? map[item.code].province : '') +
			(map[item.code].city ? map[item.code].city : '') +
			(map[item.code].district ? map[item.code].district : '');
		if (item.children && item.children.length > 0) {
			const childMap = convertRegionTreeToMap(item.children, childData);
			map = { ...childMap, ...map };
		}
	});
	return map;
};

const formatRegionTree = (tree) => {
	tree.forEach((item) => {
		item.key = item.code;
		item.value = item.code;
		item.title = item.name;
		if (item.children && item.children.length > 0) {
			item.children = formatRegionTree(item.children);
		}
	});
	return tree;
};

export default {
	namespace: 'common',

	state: {
		regionTree: [],
		regionMap: {},
		pagination: {},
	},

	effects: {
		*getDirectoryContinentCountry({ payload }, { call, put }) {
			const response = yield call(getDirectoryContinentCountry, payload);
			if (!response || !response.data) {
				return;
			}
			return response;
		},
		*getRegion({ payload, refresh }, { call, put }) {
			const response = yield call(queryRegion, payload, refresh);
			if (!response.data) {
				return;
			}
			const { regions } = response.data;
			const regionTree = formatRegionTree(regions);
			const regionMap = convertRegionTreeToMap(regionTree);
			yield put({
				type: 'save',
				payload: { regionTree, regionMap },
			});
			return response;
		},
		*getRegionInfo({ payload }, { call, put }) {
			const response = yield call(getRegionInfo, payload);
			if (!response || !response.data) {
				return;
			}
			return response;
		},
		*getDirectory({ payload }, { call, put }) {
			const response = yield call(getDirectory, payload);
			if (!response || !response.data) {
				return;
			}
			return response;
		},
		*menuTree({ payload }, { call, put }) {
			const response = yield call(menuTree, payload);
			if (!response || !response.data) {
				return;
			}
			return response;
		},
	},

	reducers: {
		save(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
	},
};
