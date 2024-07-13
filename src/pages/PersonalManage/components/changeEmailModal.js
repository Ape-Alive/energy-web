import waitTime from '@/utils/waitTime'
import { ModalForm, ProFormText } from '@ant-design/pro-form'
import { message } from 'antd'
import React from 'react'
import { connect } from 'umi'
@connect(() => ({}))
class changeEmailModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  render() {
    const { form, modalVisible, onCancel, actionRef, resetId } = this.props
    const title = '修改邮箱'

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
          const { dispatch } = this.props
          dispatch({
            type: 'user/changeEmail',
            payload: {
              email: values.email,
              password: values.password
            }
          }).then((res) => {
            if (res && res.code === '000000') {
              onCancel()
              message.success('更新邮箱成功')
              return
            }
          })
        }}
      >
        <ProFormText.Password
          label="密码"
          width="35vw"
          name="password"
          placeholder="密码"
          rules={[
            {
              required: true
            }
          ]}
        />
        <ProFormText
          label="邮箱"
          width="35vw"
          name="email"
          placeholder="邮箱"
          rules={[
            {
              required: true
            }
          ]}
        />
      </ModalForm>
    )
  }
}

export default changeEmailModal
