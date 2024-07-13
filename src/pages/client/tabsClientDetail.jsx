import { Form, Input, Row, Col, Button, message } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { apiBase } from '@/services/api'
const TabsClientDetail = ({ record, actionRef }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [dataValue, setDataValue] = useState({})

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    const { code, msg, data } = await apiBase({
      clientId: record.id,
      apiMethod: 'getClientInfo'
    })
    if (code !== '000000') {
      message.error(msg)
      return
    }

    form.resetFields()
    form.setFieldsValue(data)
    setDataValue(data)
  }

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      const { code, msg } = await apiBase({
        ...dataValue,
        ...values,
        clientId: dataValue.id,
        apiMethod: 'updateClient'
      })
      if (code !== '000000') {
        message.error(msg)
        return
      }
      actionRef.current?.reload()
      getDetail()
      message.success(msg)
      setIsEdit(false)
    })
  }
  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        {!isEdit && (
          <Button
            type="primary"
            onClick={() => {
              setIsEdit(true)
            }}
          >
            {t('bianji')}
          </Button>
        )}
        {isEdit && (
          <div>
            <Button type="primary" onClick={onOk}>
              {t('queding')}
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => {
                getDetail()
                setIsEdit(false)
              }}
            >
              {t('qvxiao')}
            </Button>
          </div>
        )}
      </div>
      <Form form={form} {...layout} disabled={!isEdit}>
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
    </div>
  )
}

export default TabsClientDetail
