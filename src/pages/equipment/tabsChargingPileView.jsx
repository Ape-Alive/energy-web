import { apiCharger } from '@/services/api'
import { Card, Descriptions, Table } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

// 充电桩视图
const tabsChargingPileView = ({ record }) => {
  const { t } = useTranslation()

  const [data, setData] = useState({})
  const [data1, setData1] = useState({})

  const statuEnum = {
    0: t('lixian'),
    1: t('zaixian')
  }

  const aramEnum = {
    0: t('buqueding'),
    1: t('jinggao'),
    2: t('ciyao'),
    3: t('zhongyao'),
    4: t('weixian')
  }

  useEffect(() => {
    getData()
    getData1()
  }, [])

  const getData = async () => {
    const { data = {} } = await apiCharger({
      apiMethod: 'ocppChargeBox',
      device_sn: record.device_sn
    })
    setData(data || {})
  }

  const getData1 = async () => {
    const { data = {} } = await apiCharger({
      apiMethod: 'ocppChargeBoxAddress',
      device_sn: record.device_sn
    })
    setData1(data || {})
  }

  const renderBaseData = () => {
    return (
      <Card title={t('jichuxinxi')} bordered={true} style={{ width: '100%' }}>
        <Descriptions title="" column={3}>
          <Descriptions.Item label={t('xinghao')}>
            {record.model_name}
          </Descriptions.Item>
          <Descriptions.Item label={t('chanpinleixing')}>
            {record.device_type_name}
          </Descriptions.Item>
          <Descriptions.Item label={t('SN')}>
            {record.device_sn}
          </Descriptions.Item>
          <Descriptions.Item label={t('zhizaoshang')}>
            {data.charge_point_vendor}
          </Descriptions.Item>
          <Descriptions.Item label={t('iccid')}>{data.iccid}</Descriptions.Item>
          <Descriptions.Item label={t('imsi')}>{data.imsi}</Descriptions.Item>
          <Descriptions.Item label={t('banbenxinxi')}>
            {data.fw_version}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  const renderRealTimeData = () => {
    return (
      <Card
        title={t('guanjianxinxi')}
        bordered={true}
        style={{ width: '100%', marginTop: 10 }}
      >
        <Descriptions column={2}>
          <Descriptions.Item label={t('charge_box_serial_number')}>
            {data.charge_box_serial_number}
          </Descriptions.Item>
          <Descriptions.Item label={t('charge_point_model')}>
            {data.charge_point_model}
          </Descriptions.Item>
          <Descriptions.Item label={t('charge_point_serial_number')}>
            {data.charge_point_serial_number}
          </Descriptions.Item>

          <Descriptions.Item label={t('description')}>
            {data.description}
          </Descriptions.Item>
          <Descriptions.Item label={t('diagnostics_status')}>
            {data.diagnostics_status}
          </Descriptions.Item>
          <Descriptions.Item label={t('diagnostics_timestamp')}>
            {data.diagnostics_timestamp &&
              moment(data.diagnostics_timestamp).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label={t('endpoint_address')}>
            {data.endpoint_address}
          </Descriptions.Item>
          <Descriptions.Item label={t('fw_update_status')}>
            {data.fw_update_status}
          </Descriptions.Item>

          <Descriptions.Item label={t('ocpp_protocol')}>
            {data.ocpp_protocol}
          </Descriptions.Item>
          <Descriptions.Item label={t('note')}>{data.note}</Descriptions.Item>
          <Descriptions.Item label={t('meter_type')}>
            {data.meter_type}
          </Descriptions.Item>
          <Descriptions.Item label={t('meter_serial_number')}>
            {data.meter_serial_number}
          </Descriptions.Item>

          <Descriptions.Item label={t('location_latitude')}>
            {data.location_latitude}
          </Descriptions.Item>
          <Descriptions.Item label={t('location_longitude')}>
            {data.location_longitude}
          </Descriptions.Item>
          <Descriptions.Item
            label={t('insert_connector_status_after_transaction_msg')}
          >
            {data.insert_connector_status_after_transaction_msg}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  const renderAddress = () => {
    return (
      <Card
        title={t('dizhixinxi')}
        bordered={true}
        style={{ width: '100%', marginTop: 10 }}
      >
        <Descriptions title="" column={2}>
          <Descriptions.Item label={t('city')}>{data1.city}</Descriptions.Item>
          <Descriptions.Item label={t('country')}>
            {data1.country}
          </Descriptions.Item>

          <Descriptions.Item label={t('house_number')}>
            {data1.house_number}
          </Descriptions.Item>
          <Descriptions.Item label={t('street')}>
            {data1.street}
          </Descriptions.Item>
          <Descriptions.Item label={t('zip_code')}>
            {data1.zip_code}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  return (
    <div>
      <Descriptions title="" column={3}>
        <Descriptions.Item label={t('mingcheng')}>
          {record.device_name}
        </Descriptions.Item>
        <Descriptions.Item label={t('zhuangtai')}>
          {statuEnum[record.status]}
        </Descriptions.Item>
        <Descriptions.Item label={t('gaojing')}>
          {aramEnum[record.status_alarm]}
        </Descriptions.Item>
      </Descriptions>
      {renderBaseData()}
      {renderRealTimeData()}
      {renderAddress()}
    </div>
  )
}

export default tabsChargingPileView
