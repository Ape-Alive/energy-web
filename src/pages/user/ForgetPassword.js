import loginBg from '@/assets/loginBg.jpeg'
import Footer from '@/components/Footer'
import waitTime from '@/utils/waitTime'
import { LockOutlined, MobileOutlined } from '@ant-design/icons'
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form'
import { message } from 'antd'
import { connect } from 'dva'
import React, { PureComponent } from 'react'
import { history } from 'umi'
import styles from './Register.less'
const signsList = JSON.parse(localStorage.getItem('antd-pro-authority')) || []

@connect(() => ({}))
class ForgetPassword extends PureComponent {
  formRef = React.createRef()

  state = {
    modalVisible: false,
    drawerType: 'create',
    nodeType: null,
    formData: null,
    nodeList: [],
    nodeTerminateStatusList: [],
    resetCode: '',
    phone: '',
    isShowReset: false
  }

  componentDidMount() {}
  goBack = () => {
    history.push('/user/login')
  }
  renderReset = () => {
    return (
      <div className={styles.content}>
        <div className={styles.title}>重置密码</div>
        <div className={styles.signupBase}>
          <ProForm
            formRef={this.formRef}
            submitter={{
              searchConfig: {
                submitText: '重置密码'
              },
              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none'
                }
              },
              submitButtonProps: {
                style: {
                  width: '100%',
                  padding: '8px 0',
                  color: ' #FFF',
                  fontSize: '16px',
                  fontWeight: '400',
                  border: 'none',
                  borderRadius: '2px',
                  backgroundColor: '#0064c8',
                  lineHeight: '20px',
                  height: '40px',
                  marginBottom: '24px'
                }
              },
              render: (props, doms) => {
                return <div className={styles.button}>{doms}</div>
              }
            }}
            onFinish={() => {
              const { dispatch } = this.props
              waitTime(1000)
              this.formRef &&
                this.formRef.current &&
                this.formRef.current.validateFields().then((values) => {
                  const { resetCode, phone } = this.state
                  const { password, newPassword } = values
                  if (newPassword !== password) {
                    message.error('两次输入密码需要一致')
                    return
                  }
                  dispatch({
                    type: 'user/forgetPassword',
                    payload: { newPassword: password, resetCode, phone }
                  }).then((res) => {
                    if (res && res.code === '000000') {
                      history.replace('/user/login')
                      return message.success('成功')
                    }

                    return true
                  })
                })
            }}
          >
            <ProFormText.Password
              width="339px"
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />
              }}
              placeholder={'请输入密码'}
              rules={[
                {
                  required: true,
                  pattern:
                    /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{6,}$/,
                  message:
                    '密码强度正则，最少6位，字母、数字、特殊字符中的任意两种'
                }
              ]}
            />
            <ProFormText.Password
              width="339px"
              name="newPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />
              }}
              placeholder="确认密码"
              rules={[
                {
                  required: true,
                  pattern:
                    /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{6,}$/,
                  message:
                    '密码强度正则，最少6位，字母、数字、特殊字符中的任意两种'
                }
              ]}
            />
          </ProForm>
          <a className={styles.goBack} onClick={this.goBack}>
            返回登录页
          </a>
        </div>
      </div>
    )
  }
  renderGetResetCode = () => {
    return (
      <div className={styles.content}>
        <div className={styles.title}>重置密码</div>
        <div className={styles.signupBase}>
          <ProForm
            formRef={this.formRef}
            submitter={{
              searchConfig: {
                submitText: '提交'
              },

              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none'
                }
              },
              submitButtonProps: {
                style: {
                  width: '100%',
                  padding: '8px 0',
                  color: ' #FFF',
                  fontSize: '16px',
                  fontWeight: '400',
                  border: 'none',
                  borderRadius: '2px',
                  backgroundColor: '#0064c8',
                  lineHeight: '20px',
                  height: '40px',
                  marginBottom: '24px'
                }
              },
              render: (props, doms) => {
                return <div className={styles.button}>{doms}</div>
              }
            }}
            onFinish={async (values) => {
              this.setState({
                isShowReset: true
              })
            }}
          >
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={'prefixIcon'} />
              }}
              onChange={(e) => {
                this.setState({
                  phone: e.target.value
                })
              }}
              name="phone"
              placeholder={'请输入手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！'
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！'
                }
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />
              }}
              captchaProps={{
                size: 'large'
              }}
              onChange={(e) => {
                this.setState({
                  resetCode: e.target.value
                })
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`
                }
                return '获取验证码'
              }}
              name="resetCode"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！'
                }
              ]}
              onGetCaptcha={() => {
                const { dispatch } = this.props
                const { phone } = this.state
                dispatch({
                  type: 'user/sendPwdCode',
                  payload: { phone, codeType: 'forgetpwd' }
                }).then((res) => {
                  if (res && res.code === '000000') {
                    return message.success('成功')
                  }
                })
              }}
            />
          </ProForm>
          <a className={styles.goBack} onClick={this.goBack}>
            返回登录页
          </a>
        </div>
      </div>
    )
  }
  render() {
    const { isShowReset } = this.state
    return (
      <div className={styles.container} id="login">
        <div className={styles.block}>
          <div className={styles.imgBlock}>
            <img src={loginBg}></img>
          </div>
          {(isShowReset && this.renderReset()) || this.renderGetResetCode()}
        </div>
        <Footer />
      </div>
    )
  }
}
export default ForgetPassword
