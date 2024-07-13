import { Form, Input, Row, Col, Modal, message, Select } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiDevice, apiBase } from '@/services/api'
import { useEffect, useState } from 'react'
import { string } from 'mathjs'

const EquipmentDetailModal = ({ show, setShow, actionRef, station_id = 0 }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [equipmentgettModelList, setEquipmentgetModelList] = useState([])

  const [typeObj, setTypeObj] = useState({})

  const [showSr485, setShowSr485] = useState(false)

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  useEffect(() => {
    equipmentgetModel()
  }, [])

  const equipmentgetModel = async () => {
    const { data = [] } = await apiDevice({ apiMethod: 'getDeviceModelList' })

    const obj = {}
    data.forEach((info) => {
      obj[info.id] = info.device_type_id
    })
    setTypeObj(obj)
    setEquipmentgetModelList(data)
  }

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      const { code, msg } = await apiDevice({
        ...values,
        apiMethod: 'createDeviceInfo',
        station_id: station_id
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

  const onValuesChange = (value) => {
    if (value.model_id) {
      if (String(typeObj[value.model_id]) === '2') {
        setShowSr485(true)
      } else {
        setShowSr485(false)
        form.setFieldsValue({
          sr485_pwd: ''
        })
      }
    }
  }

  const handleQuery = (info) => {}
  return (
    <Modal
      title={t('tianjiaxinshebei')}
      open={show}
      width={1100}
      onOk={onOk}
      onCancel={() => {
        setShow(false)
      }}
    >
      <Form
        onFinish={handleQuery}
        form={form}
        {...layout}
        onValuesChange={onValuesChange}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              name="device_name"
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
            <Form.Item name="device_tag" label={t('biaoqian')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="model_id"
              label={t('shebeixinghao')}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select placeholder="" allowClear>
                {equipmentgettModelList.map((info) => {
                  return (
                    <Option value={info.id} key={info.id}>
                      {info.model_name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="device_sn"
              label={t('shebeisn')}
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

          {showSr485 && (
            <Col span={12}>
              <Form.Item name="sr485_pwd" label={'PWD'}>
                <Input placeholder="" allowClear />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              name="device_intro"
              label={t('shuoming')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Input.TextArea rows={3} placeholder="" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default EquipmentDetailModal
