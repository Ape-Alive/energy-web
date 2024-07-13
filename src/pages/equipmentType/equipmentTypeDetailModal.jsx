import { Form, Input, Row, Col, Modal, message, Select, Upload } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiDevice, apiBase } from '@/services/api'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { getToken } from '@/utils/authority'
import { useEffect, useState } from 'react'

const EquipmentTypeDetailModal = ({ show, setShow, actionRef }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const [equipmentgettTypeList, setEquipmentgetTypeList] = useState([])
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showMqtt, setShowMqtt] = useState(false)

  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 }
  }

  useEffect(() => {
    equipmentgetType()
  }, [])

  const equipmentgetType = async () => {
    const { data = [] } = await apiDevice({ apiMethod: 'getDeviceType' })

    setEquipmentgetTypeList(data)
  }

  const fileChange = (info) => {
    setLoading(true)
    if (info.file.status === 'done') {
      setLoading(false)
      if (info.file.response.code !== '000000') {
        message.error(info.file.response.msg)
        return
      }
      setImageUrl(info.file.response.data.imgUrl)
      message.success(info.file.response.msg)
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      if (String(values.communication_type) === '1' && !values.mqtt_port) {
        values.mqtt_port = 0
      }
      const { code, msg } = await apiDevice({
        ...values,
        model_pic: imageUrl,
        apiMethod: 'createDeviceModel'
      })
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

  const onValuesChange = (value) => {
    if (value.communication_type) {
      if (String(value.communication_type) === '1') {
        setShowMqtt(true)
      } else {
        setShowMqtt(false)
        form.setFieldsValue({
          mqtt_address: '',
          mqtt_port: '',
          mqtt_account: '',
          mqtt_pwd: '',
          mqtt_topic: ''
        })
      }
    }
  }

  return (
    <Modal
      title={t('tianjiashebeixinghao')}
      open={show}
      width={1000}
      onOk={onOk}
      onCancel={() => {
        setShow(false)
      }}
    >
      <Form
        onFinish={handleQuery}
        onValuesChange={onValuesChange}
        form={form}
        {...layout}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              name="model_name"
              label={t('mingcheng')}
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
            <Form.Item name="device_type_id" label={t('shebeizhonglei')}>
              <Select placeholder="" allowClear>
                {equipmentgettTypeList.map(({ name, id }) => {
                  return (
                    <Option value={id} key={id}>
                      {name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="model_pic" label={t('shebeixinghaotupian')}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action=""
                accept=".jpg,.png,.jpeg"
                headers={{
                  token: getToken(),
                  userId: localStorage.getItem('userId')
                }}
                onChange={fileChange}
              >
                {imageUrl ? (
                  <img
                    src={'/api/' + imageUrl}
                    alt="avatar"
                    style={{ width: '100%' }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="communication_type"
              label={t('chuanshufangshi')}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select allowClear>
                <Option value="0">{t('weiding')}</Option>
                <Option value="1">MQTT</Option>
                <Option value="2">OCPP</Option>
                <Option value="3">SR485</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="prestrategy"
              label={t('yupeizhicelue')}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select allowClear>
                <Option value="0">禁用</Option>
              </Select>
            </Form.Item>
          </Col>

          {showMqtt && (
            <Col span={12}>
              <Form.Item name="mqtt_address" label={t('mqttdizhi')}>
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
          )}
          {showMqtt && (
            <Col span={12}>
              <Form.Item name="mqtt_port" label={t('mqttduankou')}>
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
          )}
          {showMqtt && (
            <Col span={12}>
              <Form.Item name="mqtt_account" label={t('mqttzhanghao')}>
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
          )}
          {showMqtt && (
            <Col span={12}>
              <Form.Item name="mqtt_pwd" label={t('mqttmima')}>
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
          )}
          {showMqtt && (
            <Col span={12}>
              <Form.Item name="mqtt_topic" label={t('mqttdingyuedizhi')}>
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
          )}

          {showMqtt && (
            <Col span={12}>
              <Form.Item name="mqtt_publish" label={t('mqttfabudizhi')}>
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              name="model_remarks"
              label={t('shuoming')}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea rows={3} placeholder="" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default EquipmentTypeDetailModal
