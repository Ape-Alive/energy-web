import { Form, Input, Row, Col, Modal, message } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiBase } from '@/services/api'
const ClientDetailModal = ({ show, setShow, actionRef }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      const { code, msg } = await apiBase({ ...values, apiMethod: 'addClient' })
      if (code !== '000000') {
        message.error(msg)
        return
      }
      actionRef.current?.reload()
      message.success(msg)
      setShow(false)
    })
  }

  const handleQuery = (info) => {}
  return (
    <Modal
      title={t('tianjiakehu')}
      open={show}
      width={800}
      onOk={onOk}
      onCancel={() => {
        setShow(false)
      }}
    >
      <Form onFinish={handleQuery} form={form} {...layout}>
        <Row>
          <Col span={12}>
            <Form.Item
              name="title"
              label={t('kehu')}
              rules={[
                {
                  required: true,
                  message: t('qingshuru')
                }
              ]}
            >
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="code"
              label={t('kehubianhao')}
              rules={[
                {
                  required: true,
                  message: t('qingshuru')
                }
              ]}
            >
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="remarks"
              label={t('shuoming')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Input.TextArea rows={3} placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="country" label={t('guojia')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="city" label={t('chengshi')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="state" label={t('zhou')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="postal_code" label={t('youzhengbianma')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address"
              label={t('dizhi')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Input.TextArea rows={3} placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address2"
              label={t('dizhi2')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Input.TextArea rows={3} placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label={t('dianhua')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label={t('email')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ClientDetailModal
