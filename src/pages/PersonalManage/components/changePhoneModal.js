import { setAuthority, setToken, setTokenType } from '@/utils/authority'
import { LockOutlined, MobileOutlined } from '@ant-design/icons'
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form'
import { message, Modal } from 'antd'
import React from 'react'
import { connect, history } from 'umi'
import styles from '../Personal.less'
@connect(() => ({}))
class changePhoneModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowReset: false,
      newPhone: ''
    }
  }

  componentDidMount() {}
  loginOut = () => {
    history.replace({
      pathname: '/user/login'
    })
  }
  renderReset = () => {
    const { onCancel } = this.props
    return (
      <ProForm
        formRef={this.formRef}
        submitter={{
          searchConfig: {
            submitText: '换绑手机'
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
        onFinish={(values) => {
          const { dispatch } = this.props
          const { checkPhoneCode } = this.state
          dispatch({
            type: 'user/changePhone',
            payload: {
              checkPhoneCode: checkPhoneCode,
              changePhoneCode: values.changePhoneCode,
              phone: values.newPhone
            }
          }).then((res) => {
            if (res && res.code === '000000') {
              message.success('成功')
              setToken('')
              setAuthority('')
              setTokenType('bearer')
              this.loginOut()
              return
            }

            return true
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
              newPhone: e.target.value
            })
          }}
          name="newPhone"
          placeholder={'请输入新手机号'}
          rules={[
            {
              required: true,
              message: '请输入新手机号！'
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
              changePhoneCode: e.target.value
            })
          }}
          placeholder={'请输入验证码'}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} ${'获取验证码'}`
            }
            return '获取验证码'
          }}
          name="changePhoneCode"
          rules={[
            {
              required: true,
              message: '请输入验证码！'
            }
          ]}
          onGetCaptcha={() => {
            const { dispatch } = this.props
            const { newPhone } = this.state
            dispatch({
              type: 'user/getChangeCodePhone',
              payload: { phone: newPhone, codeType: 'changePhone' }
            }).then((res) => {
              if (res && res.code === '000000') {
                return message.success('成功')
              }
            })
          }}
        />
      </ProForm>
    )
  }
  renderGetResetCode = () => {
    const { dispatch, phone } = this.props
    return (
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
        onFinish={(values) => {
          dispatch({
            type: 'user/getChangeCheckCode',
            payload: {
              code: values.checkPhoneCode,
              codeType: 'checkPhone',
              phone: phone
            }
          }).then((res) => {
            if (res && res.code === '000000') {
              this.setState({
                isShowReset: true
              })
              return message.success('成功')
            }

            return true
          })
        }}
      >
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MobileOutlined className={'prefixIcon'} />
          }}
          disabled={true}
          name="phone"
          initialValue={phone}
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
              checkPhoneCode: e.target.value
            })
          }}
          placeholder={'请输入验证码'}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} ${'获取验证码'}`
            }
            return '获取验证码'
          }}
          name="checkPhoneCode"
          rules={[
            {
              required: true,
              message: '请输入验证码！'
            }
          ]}
          onGetCaptcha={() => {
            const { dispatch, phone } = this.props
            dispatch({
              type: 'user/identify',
              payload: { phone, codeType: 'checkPhone' }
            }).then((res) => {
              if (res && res.code === '000000') {
                return message.success('成功')
              }
            })
          }}
        />
      </ProForm>
    )
  }
  render() {
    const { form, modalVisible, onCancel, phone } = this.props
    const title = '换绑手机'
    const { isShowReset } = this.state
    return (
      <Modal
        title={title}
        visible={modalVisible}
        formRef={form}
        width="40vw"
        footer={null}
        maskClosable={false}
        forceRender={true}
        destroyOnClose={true}
        onCancel={onCancel}
      >
        {(isShowReset && this.renderReset()) || this.renderGetResetCode()}
      </Modal>
    )
  }
}

export default changePhoneModal
