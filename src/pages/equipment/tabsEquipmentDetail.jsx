import { Form, Input, Row, Col, Button, Select, message } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { apiDevice, apiBase } from '@/services/api'

const TabsEquipmentDetail = ({ record, actionRef }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)

  const [showSr485, setShowSr485] = useState(false)
  const [showBindSR485, setShowBindSR485] = useState(false)
  const [bind_sr485_device_sn, setBind_sr485_device_sn] = useState('')
  const [selectSR485Value, setSelectSR485Value] = useState('')

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }
  const [equipmentgettModelList, setEquipmentgetModelList] = useState([])
  const [dataValue, setDataValue] = useState({})
  const [typeObj, setTypeObj] = useState({})
  const [sr485List, setSr485List] = useState([])

  useEffect(() => {
    equipmentgetModel()
    getSR485List()
  }, [])

  useEffect(() => {
    getSR485List()
  }, [typeObj])

  useEffect(() => {
    getDetail()
  }, [sr485List])

  const equipmentgetModel = async () => {
    const { data = [] } = await apiDevice({ apiMethod: 'getDeviceModelList' })

    const obj = {}
    data.forEach((info) => {
      obj[info.id] = info.device_type_id
    })
    setTypeObj(obj)
    setEquipmentgetModelList(data)
  }

  const getSR485List = async () => {
    const { data } = await apiDevice({ apiMethod: 'getSR485DeviceList' })
    setSr485List(data)
  }

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      const { code, msg } = await apiDevice({
        ...dataValue,
        ...values,
        apiMethod: 'updateDeviceInfo'
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
      apiMethod: 'getDeviceInfo'
    })
    if (code !== '000000') {
      message.error(msg)
      return
    }

    // if (typeObj[data.model_id] === '1') {
    //   const {} = await apiDevice({
    //     apiMethod: 'getDeviceInfo',
    //     device_sn: data.bind_sr485_device_sn
    //   })
    // }

    if (String(typeObj[data.model_id]) === '2') {
      setShowSr485(true)
    }

    if (String(typeObj[data.model_id]) === '1') {
      setShowBindSR485(true)
    }

    if (data.bind_sr485_device_sn) {
      setBind_sr485_device_sn(data.bind_sr485_device_sn)
      setSelectSR485Value(data.bind_sr485_device_sn)
    } else {
      setBind_sr485_device_sn('')
      setSelectSR485Value('')
    }

    form.resetFields()
    form.setFieldsValue(data)
    setDataValue(data)
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

  const bindSr485 = async () => {
    const { code, msg } = await apiDevice({
      apiMethod: 'inverterBindSR485',
      id: record.id,
      device_sn: selectSR485Value
    })
    if (code !== '000000') {
      message.error(msg)
      return
    }
    actionRef.current?.reload()
    getSR485List()
    getDetail()
    message.success(msg)
  }

  const unBindSr485 = async () => {
    const { code, msg } = await apiDevice({
      apiMethod: 'inverterBindSR485',
      id: record.id,
      device_sn: ''
    })
    if (code !== '000000') {
      message.error(msg)
      return
    }
    actionRef.current?.reload()
    getSR485List()
    getDetail()
    message.success(msg)
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
      {showBindSR485 && (
        <Col span={24}>
          <Form.Item
            label={t('bangdingcaijiqi')}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
          >
            <div>
              <Select
                disabled={bind_sr485_device_sn}
                value={selectSR485Value}
                onChange={(e) => {
                  setSelectSR485Value(e)
                }}
                style={{ width: 400, marginRight: 50 }}
              >
                {sr485List.map((info) => {
                  return (
                    <Option value={info.device_sn}>{info.device_name}</Option>
                  )
                })}
              </Select>
              {bind_sr485_device_sn && (
                <Button onClick={unBindSr485}>解绑</Button>
              )}
              {!bind_sr485_device_sn && (
                <Button
                  type="primary"
                  disabled={!selectSR485Value}
                  onClick={bindSr485}
                >
                  绑定
                </Button>
              )}
            </div>
          </Form.Item>
        </Col>
      )}
    </div>
  )
}

export default TabsEquipmentDetail
