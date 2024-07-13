import { apiDevice, apiInverter } from '@/services/api'
import { Card, Descriptions } from 'antd'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

// 逆变器视图
const tabsInverterView = ({ record }) => {
  const { t } = useTranslation()
  const [data, setData] = useState({})
  const [a_dian_wang_you_gong_gong_lv, set_a_dian_wang_you_gong_gong_lv] =
    useState('')
  const [b_dian_wang_you_gong_gong_lv, set_b_dian_wang_you_gong_gong_lv] =
    useState('')
  const [c_dian_wang_you_gong_gong_lv, set_c_dian_wang_you_gong_gong_lv] =
    useState('')

  const [a_dian_wang_shi_zai_gong_lv, set_a_dian_wang_shi_zai_gong_lv] =
    useState('')
  const [b_dian_wang_shi_zai_gong_lv, set_b_dian_wang_shi_zai_gong_lv] =
    useState('')
  const [c_dian_wang_shi_zai_gong_lv, set_c_dian_wang_shi_zai_gong_lv] =
    useState('')

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
    getDetail()
    getAttr('a_dian_wang_you_gong_gong_lv', set_a_dian_wang_you_gong_gong_lv)
    getAttr('b_dian_wang_you_gong_gong_lv', set_b_dian_wang_you_gong_gong_lv)
    getAttr('c_dian_wang_you_gong_gong_lv', set_c_dian_wang_you_gong_gong_lv)

    getAttr('a_dian_wang_shi_zai_gong_lv', set_a_dian_wang_shi_zai_gong_lv)
    getAttr('b_dian_wang_shi_zai_gong_lv', set_b_dian_wang_shi_zai_gong_lv)
    getAttr('c_dian_wang_shi_zai_gong_lv', set_c_dian_wang_shi_zai_gong_lv)
  }, [])

  const getAttr = async (key, set) => {
    const { data = {} } = await apiDevice({
      apiMethod: 'getDeviceAttr',
      device_sn: record.device_sn,
      attr_type: '2',
      model_name: record.model_name,
      attr_key: key
    })

    const { attr_value = '' } = data || {}
    set(attr_value)
  }

  const getDetail = async () => {
    const { data = {} } = await apiInverter({
      apiMethod: 'info',
      id: record.id
    })
    setData(data)
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
            {data.factory}
          </Descriptions.Item>
          <Descriptions.Item label={t('rongliang')}>
            {data.battery_capacity}
          </Descriptions.Item>
          <Descriptions.Item label={t('chongdianzonggonglv')}>
            {data.all_power}
          </Descriptions.Item>
          <Descriptions.Item label={t('jingweidu')}>
            {data.longitude}
            {data.longitude && ','}
            {data.latitude}
          </Descriptions.Item>
          <Descriptions.Item label={t('ruanjianbanben')}>
            {data.software_version}
          </Descriptions.Item>
          <Descriptions.Item label={t('yingjianbanben')}>
            {data.hardware_version}
          </Descriptions.Item>

          <Descriptions.Item
            label={t('shebeidizhi,jiqibianma')}
          ></Descriptions.Item>
          <Descriptions.Item label={t('RS485_xieyibanben')}>
            {data.rs485_version}
          </Descriptions.Item>

          <Descriptions.Item label={t('shengchanriqi')}>
            {data.made_datetime}
          </Descriptions.Item>
          <Descriptions.Item label={t('chandibianma')}></Descriptions.Item>
          <Descriptions.Item label={t('ruanjianbianyishijian')}>
            {data.software_compile_datetime}
          </Descriptions.Item>
          <Descriptions.Item
            label={t('chanpinxvliehaozifuchuan')}
          ></Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  const renderSolarPower = () => {
    return (
      <Card
        title={t('guangfu')}
        bordered={true}
        style={{ width: '100%', marginTop: 10 }}
      >
        <Descriptions title="PV1" column={3}>
          <Descriptions.Item label={t('taiyangnengbandianya_1')}>
            {data.pv1_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('taiyangnengbandianliu_1')}>
            {data.pv1_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('taiyangnengbangonglv_1')}>
            {data.pv1_power}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title="PV2" column={3}>
          <Descriptions.Item label={t('taiyangnengbandianya_2')}>
            {data.pv2_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('taiyangnengbandianliu_2')}>
            {data.pv2_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('taiyangnengbangonglv_2')}>
            {data.pv2_power}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title={t('guangfuzonggonglv')} column={3}>
          <Descriptions.Item
            label={t('taiyangnengbandianya_3')}
          ></Descriptions.Item>
          <Descriptions.Item
            label={t('taiyangnengbandianliu_3')}
          ></Descriptions.Item>
          <Descriptions.Item
            label={t('taiyangnengbangonglv_3')}
          ></Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  const renderBattery = () => {
    return (
      <Card
        title={t('dianchi')}
        bordered={true}
        style={{ width: '100%', marginTop: 10 }}
      >
        <Descriptions title="" column={3}>
          <Descriptions.Item label={t('xvdianchidianlaingbaifeibi_soc')}>
            {data.battery_soc}
          </Descriptions.Item>
          <Descriptions.Item label={t('dianchidianya')}>
            {data.battery_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('dianchidianliiu')}>
            {data.battery_current}
          </Descriptions.Item>

          <Descriptions.Item label={t('xvdianchiwendu')}>
            {data.temperature_battery}
          </Descriptions.Item>
          <Descriptions.Item label={t('dianchichongdianzhuangtai')}>
            {data.battery_charge_status}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  const renderPowerGrid = () => {
    return (
      <Card
        title={t('dianwang')}
        bordered={true}
        style={{ width: '100%', marginTop: 10 }}
      >
        <Descriptions title="" column={3}>
          <Descriptions.Item label={t('zongmuxiandianya')}>
            {data.line_power_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('zhengmuxiandianya')}></Descriptions.Item>
          <Descriptions.Item label={t('fumuxiandianya')}></Descriptions.Item>
          <Descriptions.Item
            label={t('shidianchongdiandianliu')}
          ></Descriptions.Item>
          <Descriptions.Item label={t('dianwangpinlv')}></Descriptions.Item>
          <Descriptions.Item label={t('nibianpinlv')}></Descriptions.Item>
        </Descriptions>

        <Descriptions title={t('a_xiang')} column={3}>
          <Descriptions.Item label={t('dianwang_a_xiangdianya')}>
            {data.lineA_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('dianwang_a_xiangdianliu')}>
            {data.lineA_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('nibian_a_xiangdianya')}>
            {data.inverterA_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('nibian_a_xiangdianliu')}>
            {data.inverterA_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_a_xiangdianya')}>
            {data.loadA_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_a_xiangdianliu')}>
            {data.loadA_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_a_xiangyougonggonglv')}>
            {data.loadA_active_power}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_a_xiangshizaigonglv')}>
            {data.loadA_apparent_power}
          </Descriptions.Item>
          <Descriptions.Item label={t('a_xiangdianwangyougonggonglv')}>
            {a_dian_wang_you_gong_gong_lv}
          </Descriptions.Item>

          <Descriptions.Item label={t('a_xiangdianwangshizaigonglv')}>
            {a_dian_wang_shi_zai_gong_lv}
          </Descriptions.Item>
          <Descriptions.Item label={t('a_xiangfuzailv')}>
            {data.lineA_load_rate}
          </Descriptions.Item>
          <Descriptions.Item label={t('sanrepian_a_wendu')}>
            {data.temperature_A}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions title={t('b_xiang')} column={3}>
          <Descriptions.Item label={t('dianwang_b_xiangdianya')}>
            {data.lineB_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('dianwang_b_xiangdianliu')}>
            {data.lineB_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('nibian_b_xiangdianya')}>
            {data.inverterB_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('nibian_b_xiangdianliu')}>
            {data.inverterB_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_b_xiangdianya')}>
            {data.loadB_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_b_xiangdianliu')}>
            {data.loadB_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_b_xiangyougonggonglv')}>
            {data.loadB_active_power}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_b_xiangshizaigonglv')}>
            {data.loadB_apparent_power}
          </Descriptions.Item>
          <Descriptions.Item label={t('b_xiangdianwangyougonggonglv')}>
            {b_dian_wang_you_gong_gong_lv}
          </Descriptions.Item>

          <Descriptions.Item label={t('b_xiangdianwangshizaigonglv')}>
            {b_dian_wang_shi_zai_gong_lv}
          </Descriptions.Item>
          <Descriptions.Item label={t('b_xiangfuzailv')}>
            {data.lineB_load_rate}
          </Descriptions.Item>
          <Descriptions.Item label={t('sanrepian_b_wendu')}>
            {data.temperature_B}
          </Descriptions.Item>
        </Descriptions>

        <Descriptions title={t('c_xiang')} column={3}>
          <Descriptions.Item label={t('dianwang_c_xiangdianya')}>
            {data.lineC_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('dianwang_c_xiangdianliu')}>
            {data.lineC_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('nibian_c_xiangdianya')}>
            {data.inverterC_voltage}
          </Descriptions.Item>
          <Descriptions.Item label={t('nibian_c_xiangdianliu')}>
            {data.inverterC_current}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_c_xiangdianya')}>
            {data.loadC_voltage}
          </Descriptions.Item>

          <Descriptions.Item label={t('fuzai_c_xiangdianliu')}>
            {data.loadC_current}
          </Descriptions.Item>

          <Descriptions.Item label={t('fuzai_c_xiangyougonggonglv')}>
            {data.loadC_active_power}
          </Descriptions.Item>
          <Descriptions.Item label={t('fuzai_c_xiangshizaigonglv')}>
            {data.loadC_apparent_power}
          </Descriptions.Item>
          <Descriptions.Item label={t('c_xiangdianwangyougonggonglv')}>
            {c_dian_wang_you_gong_gong_lv}
          </Descriptions.Item>

          <Descriptions.Item label={t('c_xiangdianwangshizaigonglv')}>
            {c_dian_wang_shi_zai_gong_lv}
          </Descriptions.Item>
          <Descriptions.Item label={t('c_xiangfuzailv')}>
            {data.lineC_load_rate}
          </Descriptions.Item>
          <Descriptions.Item label={t('sanrepian_c_wendu')}>
            {data.temperature_C}
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
      {renderSolarPower()}
      {renderBattery()}
      {renderPowerGrid()}
    </div>
  )
}

export default tabsInverterView
