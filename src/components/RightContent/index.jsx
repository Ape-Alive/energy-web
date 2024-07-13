import { Space, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import Avatar from './AvatarDropdown'
import { useTranslation } from 'react-i18next'
import styles from './index.less'

const { Option } = Select

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState')

  const { i18n } = useTranslation()

  if (!initialState || !initialState.settings) {
    return null
  }

  const key = localStorage.getItem('language') || 'en'
  useEffect(() => {
    i18n.changeLanguage(key)
  }, [])

  const onChange = (e) => {
    window.localStorage.setItem('language', e)
    window.location.reload()
  }

  const { navTheme, layout } = initialState.settings
  let className = styles.right

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`
  }

  return (
    <Space className={className}>
      <div>
        <Select
          style={{ width: 70 }}
          defaultValue={key}
          onChange={onChange}
          options={[
            {
              value: 'zh',
              label: '中文'
            },
            {
              value: 'en',
              label: 'EN'
            }
          ]}
        ></Select>
      </div>
      <Avatar />
    </Space>
  )
}

export default GlobalHeaderRight
