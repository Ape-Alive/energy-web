import {
	changepwd,
	forgetPassword,
	getUserInfo, menuTree, oplogList,
	register,
	sendPwdCode,
	sendRegCode,
	sendRegCodeRegister,
	updateUserInfo,
	userChangeInfo
} from '@/services/account'
import {
	createUser,
	deleteUser,
	disableUser,
	enableUser, entireOplogList, getUserList,
	incomeAdminGetAll,
	incomegetAll,
	query as queryUsers, resetPassword, updateUser
} from '@/services/user'
import { setAuthority, setUserName, setTimeZone } from '@/utils/authority'

import { apiBase } from '@/services/api'

export default {
	namespace: 'user',

	state: {
		currentUser: {
			userInfo: null
		}
	},

	effects: {
		*menuTree({ payload }, { call }) {
			const response = yield call(menuTree, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*entireOplogList({ payload }, { call }) {
			const response = yield call(entireOplogList, payload)
			if (!response || !response.data) {
				return response
			}
			return response.data
		},
		*userChangeInfo({ payload }, { call }) {
			const response = yield call(userChangeInfo, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*fetch(_, { call, put }) {
			const response = yield call(queryUsers)
			yield put({
				type: 'save',
				payload: response
			})
		},
		*fetchCurrent({ payload }, { call, put }) {
			const response = yield call(apiBase, { ...payload, apiMethod: 'getUserInfo' })
			if (!response) {
				return response
			}
			yield put({
				type: 'changeLoginStatus',
				payload: response.data
			})

			return response
		},
		*updateUserInfo({ payload }, { call }) {
			const response = yield call(updateUserInfo, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		// 获取用户列表
		*getUserList({ payload }, { call, put }) {
			const response = yield call(getUserList, payload)
			if (!response || !response.data) {
				return response
			}
			return response.data
		},
		*createUser({ payload }, { call }) {
			const response = yield call(createUser, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*updateUser({ payload }, { call }) {
			const response = yield call(updateUser, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*disableUser({ payload }, { call }) {
			const response = yield call(disableUser, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*enableUser({ payload }, { call }) {
			const response = yield call(enableUser, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*deleteUser({ payload }, { call }) {
			const response = yield call(deleteUser, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*changepwd({ payload }, { call }) {
			const response = yield call(changepwd, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*resetPassword({ payload }, { call }) {
			const response = yield call(resetPassword, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*incomegetAll({ payload }, { call }) {
			const response = yield call(incomegetAll, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*incomeAdminGetAll({ payload }, { call }) {
			const response = yield call(incomeAdminGetAll, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*sendPwdCode({ payload }, { call }) {
			const response = yield call(sendPwdCode, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*forgetPassword({ payload }, { call }) {
			const response = yield call(forgetPassword, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*sendRegCode({ payload }, { call }) {
			const response = yield call(sendRegCode, payload)
			if (!response) {
				return response
			}
			return response
		},
		*sendRegCodeRegister({ payload }, { call }) {
			const response = yield call(sendRegCodeRegister, payload)
			if (!response) {
				return response
			}
			return response
		},
		*register({ payload }, { call }) {
			const response = yield call(register, payload)
			if (!response || !response.data) {
				return response
			}
			return response
		},
		*oplogList({ payload }, { call }) {
			const response = yield call(oplogList, payload)
			if (!response || !response.data) {
				return response
			}
			return response.data
		}
	},

	reducers: {
		save(state, action) {
			return {
				...state,
				list: action.payload
			}
		},
		changeLoginStatus(state, { payload }) {
			const roleList = payload.roles || []
			const signsList = roleList.map((info) => {
				return info.name
			})

			setUserName(payload.username || 'admin')
			setTimeZone(payload.utc_offsets)
			// setAuthority(payload.role || '');
			setAuthority(signsList)
			return {
				...state,
				...payload
			}
		},
		saveCurrentUser(state, action) {
			return {
				...state,
				currentUser: action.payload || {}
			}
		},
		changeNotifyCount(state, action) {
			return {
				...state,
				currentUser: {
					...state.currentUser,
					notifyCount: action.payload.totalCount,
					unreadCount: action.payload.unreadCount
				}
			}
		}
	}
}
