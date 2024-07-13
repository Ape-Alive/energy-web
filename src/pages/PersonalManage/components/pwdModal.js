import waitTime from '@/utils/waitTime'
import { ModalForm, ProFormText } from '@ant-design/pro-form'
import { message } from 'antd'
import React from 'react'
import { connect, history } from 'umi'
@connect(() => ({}))
class reset extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  render() {
    const { form, modalVisible, onCancel, actionRef, resetId } = this.props
    const title = '重置密码'

    return (
      <ModalForm
        title={title}
        visible={modalVisible}
        formRef={form}
        width="40vw"
        modalProps={{
          maskClosable: false,
          forceRender: true,
          destroyOnClose: true,
          onCancel
        }}
        onFinish={async (values) => {
          waitTime(1000)
          if (values.old === values.password) {
            message.error('账户密码修改时，不允许与当前密码一致')
            return false
          }
          if (values.newPassword !== values.password) {
            message.error('两次输入密码需要一致')
            return false
          }

          const { dispatch } = this.props
          dispatch({
            type: 'user/changepwd',
            payload: {
              password: values.old,
              newPassword: values.newPassword
            }
          }).then((res) => {
            if (res && res.code === '000000') {
              message.success('更新密码成功,请重新登录')
              history.push('/user/login')
              return
            }
            message.error('更新密码失败')
          })
        }}
      >
        <ProFormText.Password
          label="旧密码"
          width="35vw"
          name="old"
          placeholder="密码"
          rules={[
            {
              required: true
            }
          ]}
        />
        <ProFormText.Password
          label="新密码"
          width="35vw"
          name="password"
          placeholder="新密码"
          rules={[
            {
              required: true,
              pattern:
                /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{6,}$/,
              message: '密码强度正则，最少6位，字母、数字、特殊字符中的任意两种'
            }
          ]}
        />
        <ProFormText.Password
          label="确认密码"
          width="35vw"
          name="newPassword"
          placeholder="确认密码"
          rules={[
            {
              required: true,
              pattern:
                /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{6,}$/,
              message: '密码强度正则，最少6位，字母、数字、特殊字符中的任意两种'
            }
          ]}
        />
      </ModalForm>
    )
  }
}

export default reset
