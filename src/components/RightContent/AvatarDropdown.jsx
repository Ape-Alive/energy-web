import {
  setAuthority,
  setToken,
  setTokenType,
  setTraceid
} from '@/utils/authority'
import { LogoutOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { stringify } from 'querystring'
import React, { useCallback } from 'react'
import { history, useModel } from 'umi'
import { useTranslation } from 'react-i18next'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = () => {
  const { query = {}, search, pathname } = history.location

  const { redirect } = query // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search
      })
    })
    location.reload()
  }
}

const AvatarDropdown = ({ menu }) => {
  const { t, i18n } = useTranslation()
  const { initialState, setInitialState } = useModel('@@initialState')
  const onMenuClick = useCallback(
    (event) => {
      const { key } = event
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }))
        setToken('')
        setAuthority('')
        setTokenType('bearer')
        setTraceid('')
        loginOut()

        return
      } else if (key === 'fixpassword') {
        history.push('/Fixpassword')
      } else if (key === 'personal') {
        history.push('/Personal')
      }
    },
    [setInitialState]
  )
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8
        }}
      />
    </span>
  )

  if (!initialState) {
    return loading
  }

  const { currentUser } = initialState

  if (!currentUser || !currentUser.userName) {
    return loading
  }
  //   const isAdmin = currentUser.roles.find((item) => {
  //     return item.category === '系统内部人员'
  //   })
  //   // 如果是供应商用户的话用username
  //   let name = currentUser.username
  //   if (isAdmin) {
  //     name = currentUser.name
  //   }
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="personal">
        <LogoutOutlined />
        {t('zhanghaoxinxi')}
      </Menu.Item>
      <Menu.Item key="fixpassword">
        <LogoutOutlined />
        {t('xiugaimima')}
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        {t('tuichudenglu')}
      </Menu.Item>
    </Menu>
  )

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser.avatar}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{currentUser.userName}</span>
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
