// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ?
      localStorage.getItem('antd-pro-authority') :
      str
  // authorityString could be admin, "admin", ["admin"]
  let authority
  try {
    authority = JSON.parse(authorityString)
  } catch (e) {
    authority = authorityString
  }
  if (typeof authority === 'string') {
    return [authority]
  }
  return authority || ['admin']
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority
  return localStorage.setItem(
    'antd-pro-authority',
    JSON.stringify(proAuthority)
  )
}

export function setUserName(username) {
  return localStorage.setItem('username', username)
}

export function setTimeZone(username) {
  return localStorage.setItem('utc_offsets', username)
}

export function getToken() {
  return localStorage.getItem('access_token') || ''
}

export function setToken(token) {
  return localStorage.setItem('access_token', token)
}

export function getTokenType() {
  return localStorage.getItem('token_type')
}

export function setTokenType(type) {
  return localStorage.setItem('token_type', type)
}
export function getTraceid() {
  return localStorage.getItem('traceid')
}
export function setTraceid(type) {
  return localStorage.setItem('traceid', type)
}
