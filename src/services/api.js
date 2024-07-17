import request from '@/utils/request'
import requestData from '@/utils/requestData'
import { stringify } from 'qs'

import {
  getToken
} from '@/utils/authority'

export async function queryProjectNotice() {
  return request('/api/project/notice')
}

export async function queryActivities() {
  return request('/api/activities')
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`)
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete'
    }
  })
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post'
    }
  })
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update'
    }
  })
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params
  })
}

export async function fakeChartData() {
  return request('/api/fake_chart_data')
}

export async function queryTags() {
  return request('/api/tags')
}

export async function queryBasicProfile() {
  return request('/api/profile/basic')
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced')
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`)
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete'
    }
  })
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post'
    }
  })
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update'
    }
  })
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params
  })
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params
  })
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`)
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`)
}

/* WEB API */

export async function accountLogin(params) {
  return requestData('/web-api/admin/account/login', params, 'POST')
}

export async function logout(params) {
  return requestData('/web-api/admin/account/logout', params, 'GET')
}

//

export async function apiBase(params) {
  // const token = getToken()
  // const utc_offsets = localStorage.getItem('utc_offsets')
  // const userId = localStorage.getItem('userId')
  const language = localStorage.getItem('language') || 'en'
  // const 
  return request('/v2/api/auth/login', {
    method: 'POST',
    body: params,
    headers: { authorization:'', 'Accept-Language': language },
  })
}

export async function apiUserInfo(params){
  const language = localStorage.getItem('language') || 'en'
  const token = getToken()
  return request('/v2/api/auth/user', {
    method: 'GET',
    headers: { authorization:'Bearer'+' '+ token, 'Accept-Language': language },
  })
}

export async function apiDevice(params) {
  const token = getToken()
  const utc_offsets = localStorage.getItem('utc_offsets')
  const userId = localStorage.getItem('userId')
  const language = localStorage.getItem('language') || 'en'
  return request('/api/apiDevice.php', {
    method: 'POST',
    body: params,
    headers: { Token: token, Userid: userId, 'Accept-Language': language, 'Utc-Offsets': utc_offsets },
  })
}

export async function apiStation(params) {
  const token = getToken()
  const utc_offsets = localStorage.getItem('utc_offsets')
  const userId = localStorage.getItem('userId')
  const language = localStorage.getItem('language') || 'en'
  return request('/api/apiStation.php', {
    method: 'POST',
    body: params,
    headers: { Token: token, Userid: userId, 'Accept-Language': language, 'Utc-Offsets': utc_offsets },
  })
}

export async function apiDashboard(params) {
  const token = getToken()
  const utc_offsets = localStorage.getItem('utc_offsets')
  const userId = localStorage.getItem('userId')
  const language = localStorage.getItem('language') || 'en'
  return request('/api/apiDashboard.php', {
    method: 'POST',
    body: params,
    headers: { Token: token, Userid: userId, 'Accept-Language': language, 'Utc-Offsets': utc_offsets },
  })
}


export async function apiInverter(params) {
  const token = getToken()
  const utc_offsets = localStorage.getItem('utc_offsets')
  const userId = localStorage.getItem('userId')
  const language = localStorage.getItem('language') || 'en'
  return request('/api/apiInverter.php', {
    method: 'POST',
    body: params,
    headers: { Token: token, Userid: userId, 'Accept-Language': language, 'Utc-Offsets': utc_offsets },
  })
}

export async function apiCharger(params) {
  const token = getToken()
  const utc_offsets = localStorage.getItem('utc_offsets')
  const userId = localStorage.getItem('userId')

  const language = localStorage.getItem('language') || 'en'
  return request('/api/apiCharger.php', {
    method: 'POST',
    body: params,
    headers: { Token: token, Userid: userId, 'Accept-Language': language, 'Utc-Offsets': utc_offsets, },
  })
}
