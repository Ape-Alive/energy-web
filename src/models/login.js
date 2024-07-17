import { accountLogin, getFakeCaptcha, apiBase } from '@/services/api'
import {
  setAuthority,
  setToken,
  setTokenType,
  setUserName,
  setTimeZone,
} from '@/utils/authority'
// import { reloadAuthorized } from '@/utils/Authorized'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'login',

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(apiBase, { ...payload })
      // console.log('response',response)
      // Login successfully
      if (response && response.token) {
        // reloadAuthorized()
        yield put({
          type: 'changeLoginStatus',
          payload: response
        })
        // localStorage.setItem('userId', response.data.userId)
      }

      return response
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload)
    },

    *logout(_, { put }) {
      const response = yield call(logout, payload)
      yield put({
        type: 'changeLogoutStatus',
        payload: {
          status: false,
          currentAuthority: 'guest'
        }
      })
      reloadAuthorized()
      if (response) {
        yield put(
          routerRedux.push({
            pathname: '/user/login'
          })
        )
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {

      setToken(payload.token || '')
      // setTokenType(payload.token_type || 'bearer')
      return {
        ...state,
        ...payload
      }
    },
    changeLogoutStatus(state, { payload }) {
      setToken('')
      setTokenType('bearer')
      setUserName('')
      setTimeZone('')
      setAuthority('')
      return {
        ...state,
        ...payload
      }
    }
  }
}
