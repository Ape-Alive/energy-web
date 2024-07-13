import loginBg from '@/assets/loginBg.jpeg'
import Footer from '@/components/Footer'
import { getTraceid, setTraceid } from '@/utils/authority'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormText } from '@ant-design/pro-form'
import { IntlProvider, enUSIntl, zhCNIntl } from '@ant-design/pro-table'
import { Alert, Tabs, message, ConfigProvider } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FormattedMessage, connect, history, useIntl, useModel } from 'umi'
import { v1 as uuidv1 } from 'uuid'
import styles from './index.less'
import { apiBase } from '@/services/api'

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24
    }}
    message={content}
    type="error"
    showIcon
  />
)

const Login = (props) => {
  const { t, i18n } = useTranslation()
  const [userLoginState, setUserLoginState] = useState({})
  useEffect(() => {
    const historyTraceid = getTraceid() || ''
    if (historyTraceid) {
      return
    }
    const traceid = uuidv1()
    setTraceid(traceid)
  }, [])

  const key = localStorage.getItem('language') || 'en'
  useEffect(() => {
    i18n.changeLanguage(key)
  }, [])

  const { initialState, setInitialState } = useModel('@@initialState')
  const intl = useIntl()

  const handleSubmit = (values) => {
    const { dispatch } = props
    dispatch({
      type: 'login/login',
      payload: {
        ...values
      }
    }).then((res) => {
      if (res && res.code === '000301') {
        message.error(res.msg)
        return
      }
      if (res && res.code === '000000') {
        dispatch({
          type: 'user/fetchCurrent',
          payload: {
            userId: res.data.userId
          }
        }).then(async (userInfo) => {
          if (userInfo && userInfo.code === '000000') {
            const currentUser = (userInfo && userInfo.data) || null
            const { data = [] } = await apiBase({
              apiMethod: 'getRoleMenuList',
              roleId: userInfo.data.roleId
            })
            setInitialState((s) => ({
              ...s,
              currentUser: currentUser,
              menuList: data
            }))
            window.location.replace('/data-grid')
          }
        })
      }
    })
  }

  const { status, type: loginType } = userLoginState
  const language = localStorage.getItem('language') || 'en'
  const enumLang = {
    en: enUS,
    zh: zhCN
  }
  const enumTableLang = {
    en: enUSIntl,
    zh: zhCNIntl
  }

  return (
    <ConfigProvider locale={enumLang[language]}>
      <IntlProvider value={enumTableLang[language]}>
        <div className={styles.container} id="login">
          <div className={styles.block}>
            <div className={styles.imgBlock}>
              <img src={loginBg} className={styles.img}></img>
              <div className={styles.footer}>
                <Footer />
              </div>
            </div>
            <div className={styles.content}>
              <div>
                <div className={styles.contentTitle}>{t('yonghudenglu')}</div>
                <LoginForm onFinish={handleSubmit}>
                  <Tabs.TabPane key="account" tab={t('zhanghaomimadenglu')} />
                  {status === 'error' && loginType === 'account' && (
                    <LoginMessage content={t('zhanghaomimacuowu')} />
                  )}

                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={styles.prefixIcon} />
                    }}
                    placeholder={t('dengluzhanghao')}
                    rules={[
                      {
                        required: true,
                        message: t('qingshuruyonghuming')
                      }
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={styles.prefixIcon} />
                    }}
                    placeholder={t('mima')}
                    rules={[
                      {
                        required: true,
                        message: t('qingshurumima')
                      }
                    ]}
                  />
                </LoginForm>
              </div>
            </div>
          </div>
        </div>
      </IntlProvider>
    </ConfigProvider>
  )
}

export default connect(({ login }) => ({
  login
}))(Login)
