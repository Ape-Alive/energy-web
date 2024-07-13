import { apiStation, apiBase } from '@/services/api'
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Divider,
  Select,
  message,
  InputNumber
} from 'antd'

import { useState, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { history } from 'umi'
import { timeZone } from '@/utils/enum'

const TabsPowerStationDetail = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [dataValue, setDataValue] = useState({})
  const [id, setId] = useState('')

  const [stationTypeList, setStationTypeList] = useState([])
  const [sysTypeList, setSysTypeList] = useState([])
  const [powerStationList, setPowerStationList] = useState([])

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  useEffect(() => {
    const id = history.location.query.id
    if (!id) {
      return
    }
    setId(id)
    getDetail(id)
  }, [])

  useEffect(() => {
    getStationTypeList()
    getSysTypeList()
    getPowerStation()
  }, [])

  const getStationTypeList = async () => {
    const { data } = await apiBase({
      apiMethod: 'getDict',
      group_: 'station_enum_station_type'
    })

    setStationTypeList(data)
  }

  const getPowerStation = async () => {
    const { data } = await apiStation({
      apiMethod: 'list',
      pageNum: 1,
      pageSize: 500
    })
    setPowerStationList(data)
  }

  const getSysTypeList = async () => {
    const { data } = await apiBase({
      apiMethod: 'getDict',
      group_: 'station_enum_sys_type'
    })

    setSysTypeList(data)
  }

  const getDetail = async (id) => {
    const { code, msg, data } = await apiStation({
      id: id,
      apiMethod: 'info'
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
      const { code, msg } = await apiStation({
        ...dataValue,
        ...values,
        apiMethod: 'update'
      })
      if (code !== '000000') {
        message.error(msg)
        return
      }

      getDetail(id)
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
                getDetail(id)
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
          <Divider orientation="left">{t('jichuxinxi')}</Divider>
          <Col span={12}>
            <Form.Item
              name="station_name"
              label={t('zhandianmingcheng')}
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
            <Form.Item name="country" label={t('guojia')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address"
              label={t('zhandiandizhi')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
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
              name="longitude"
              label={t('jingdu')}
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
              name="latitude"
              label={t('weidu')}
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
              name="time_zone"
              label={t('shiqv')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select allowClear>
                {timeZone.map((val) => {
                  return <Option value={val}>{t(val)}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="parentId"
              label={t('suoshufudianzhan')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Select placeholder="" allowClear>
                {powerStationList.map(({ station_name, id }) => {
                  return <Option value={id}>{station_name}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Divider orientation="left">{t('xitongxinxi')}</Divider>
          <Col span={12}>
            <Form.Item
              name="station_type"
              label={t('dianzhanleixing')}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select placeholder="" allowClear>
                {stationTypeList.map(({ value_, key_ }) => {
                  return <Option value={value_}>{key_}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sys_type"
              label={t('xitongleixing')}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select placeholder="" allowClear>
                {sysTypeList.map(({ value_, key_ }) => {
                  return <Option value={value_}>{key_}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="station_power"
              label={t('zhaungjirongliang')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <InputNumber placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Divider orientation="left">{t('shouyixinxi')}</Divider>

          <Col span={24}>
            <Form.Item
              name="income_currency"
              label={t('huobidanwei')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select placeholder="" allowClear>
                <Option value="USD">{t('USD')}</Option>
                <Option value="EUR">{t('EUR')}</Option>
                <Option value="CNY">{t('CNY')}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="income_per_kWh" label={t('dudianshouyi')}>
              <InputNumber placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subsidy_income_per_kWh" label={t('butieshouyi')}>
              <InputNumber placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="total_cost" label={t('zongchengben_yuan')}>
              <InputNumber placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="repayment_per_day" label={t('rihuankuan_yuan')}>
              <InputNumber placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Divider orientation="left">{t('yezhuxinxi')}</Divider>
          <Col span={12}>
            <Form.Item name="owner_name" label={t('yezhuxingming')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="owner_phone" label={t('yezhudianhua')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="owner_address"
              label={t('dizhi')}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default TabsPowerStationDetail
