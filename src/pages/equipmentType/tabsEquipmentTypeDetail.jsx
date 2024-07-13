import { Form, Input, Row, Col, Button, message, Upload, Select } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { getToken } from '@/utils/authority'
import { apiDevice } from '@/services/api'

const { Option } = Select
const TabsEquipmentTypeDetail = ({ record, actionRef }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [dataValue, setDataValue] = useState({})

  const [showMqtt, setShowMqtt] = useState(false)

  const [equipmentgettTypeList, setEquipmentgetTypeList] = useState([])

  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 }
  }

  useEffect(() => {
    getDetail()
    equipmentgetType()
  }, [])

  const equipmentgetType = async () => {
    const { data = [] } = await apiDevice({ apiMethod: 'getDeviceType' })

    setEquipmentgetTypeList(data)
  }

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      if (String(values.communication_type) === '1' && !values.mqtt_port) {
        values.mqtt_port = 0
      }
      const { code, msg } = await apiDevice({
        ...dataValue,
        ...values,
        model_pic: imageUrl,
        apiMethod: 'updateDeviceModel'
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

  const getDetail = async () => {
    const { code, msg, data } = await apiDevice({
      id: record.id,
      apiMethod: 'getDeviceModelInfo'
    })
    if (code !== '000000') {
      message.error(msg)
      return
    }

    if (String(data.communication_type) === '1') {
      setShowMqtt(true)
    }

    form.resetFields()
    form.setFieldsValue(data)
    setDataValue(data)
    setImageUrl(data.model_pic)
  }

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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

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
      <Form
        form={form}
        {...layout}
        disabled={!isEdit}
        onValuesChange={onValuesChange}
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
                action="/api/apiBase.php"
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
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
            >
              <Input.TextArea rows={3} placeholder="" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default TabsEquipmentTypeDetail
