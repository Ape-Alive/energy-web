import { createRole, deleteRole, getRoleList, getRoleNameList, updateRole } from '@/services/role';

export default {
	namespace: 'role',

	state: {
		currentUser: {},
	},

	effects: {
		// 获取用户列表
		*getRoleList({ payload }, { call }) {
			const response = yield call(getRoleList, payload);
			if (!response || !response.data) {
				return response;
			}
			const { currentPage, lastPage, pageSize, total } = response.data
			const res = { ...response, currentPage, lastPage, pageSize, total }
			res.data = response.data.data
			return res
		},
		// 获取用户列表
		*getRoleNameList({ payload }, { call }) {
			const response = yield call(getRoleNameList, payload);
			if (!response || !response.data) {
				return response;
			}
			const { currentPage, lastPage, pageSize, total } = response.data
			const res = { ...response, currentPage, lastPage, pageSize, total }
			res.data = response.data
			return res
		},
		*createRole({ payload }, { call }) {
			const response = yield call(createRole, payload);
			if (!response || !response.data) {
				return response;
			}
			return response;
		},
		*updateRole({ payload }, { call }) {
			const response = yield call(updateRole, payload);
			if (!response || !response.data) {
				return response;
			}
			return response;
		},
		*deleteRole({ payload }, { call }) {
			const response = yield call(deleteRole, payload);
			if (!response || !response.data) {
				return response;
			}
			return response;
		},
	},

	reducers: {
		save(state, action) {
			return {
				...state,
				list: action.payload,
			};
		},
		saveCurrentUser(state, action) {
			return {
				...state,
				currentUser: action.payload || {},
			};
		},
		changeNotifyCount(state, action) {
			return {
				...state,
				currentUser: {
					...state.currentUser,
					notifyCount: action.payload.totalCount,
					unreadCount: action.payload.unreadCount,
				},
			};
		},
	},
};
