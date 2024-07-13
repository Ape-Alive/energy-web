import image from '@/assets/home/demo.png'
import { Tabs, Radio, DatePicker } from 'antd'
import { useState, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import DataBoardHistory from './dataBoardHistory'
import DataBoardHistory1 from './dataBoardHistory1'

import DataBoardTable from './dataBoardTable'
import flowBg from '@/assets/flowBg.png'
import './tabsDataBoard.less'
import { apiStation, apiBase } from '@/services/api'
import moment from 'moment'

let timeid = ''

const TabsDataBoard = ({ id }) => {
  const { t } = useTranslation()

  const [electricEnergyAnalysisTimeType, setElectricEnergyAnalysisTimeType] =
    useState('month') // 电能分析时间

  const [statRealUse, setStatRealUse] = useState({}) // 电站实时
  const [electricEnergyAnalysis, setElectricEnergyAnalysis] = useState({}) // 电能分析

  const [stationTypeObj, setStationTypeObj] = useState({})
  const [sysTypeObj, setSysTypeObj] = useState({})
  const [dataValue, setDataValue] = useState({})

  const [chargingData, setChargingData] = useState({})

  const [statRealGenerateData, setStatRealGenerateData] = useState({})

  const language = localStorage.getItem('language') || 'en'
  const styleLabelSize = {
    fontSize: language === 'zh' ? '1.2vw' : '0.8vw'
  }
  const styleValueSize = {
    fontSize: language === 'zh' ? '1.9vw' : '1.9vw'
  }

  useEffect(() => {
    getStatRealUse()
    getStationTypeList()
    getSysTypeList()
    getElectricEnergyAnalysis()
    getChargingData()
    getDetail(id)
    getStatRealGenerateData()

    timeid = setInterval(() => {
      getStatRealUse()
      getChargingData()
      getStatRealGenerateData()
    }, 3 * 1000)

    return () => {
      clearInterval(timeid)
    }
  }, [])

  const getChargingData = async () => {
    const { data } = await apiStation({
      apiMethod: 'stat_real_powergrid',
      stationId: id
    })

    setChargingData(data || {})
  }

  const getStatRealGenerateData = async () => {
    const { data } = await apiStation({
      apiMethod: 'stat_real_generate',
      stationId: id
    })

    setStatRealGenerateData(data || {})
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

    setDataValue(data)
  }

  const getStationTypeList = async () => {
    const { data } = await apiBase({
      apiMethod: 'getDict',
      group_: 'station_enum_station_type'
    })

    const obj = {}

    data.forEach((info) => {
      obj[info.value_] = info.key_
    })

    setStationTypeObj(obj)
  }

  const getSysTypeList = async () => {
    const { data } = await apiBase({
      apiMethod: 'getDict',
      group_: 'station_enum_sys_type'
    })

    const obj = {}

    data.forEach((info) => {
      obj[info.value_] = info.key_
    })

    setSysTypeObj(obj)
  }

  const getStatRealUse = async () => {
    const { data = {} } = await apiStation({
      apiMethod: 'stat_real_use_inverter',
      stationId: id
    })
    setStatRealUse(data)
  }

  const getElectricEnergyAnalysis = async (time) => {
    const params = {}

    if (electricEnergyAnalysisTimeType === 'year' && time) {
      const year = moment(time).format('YYYY')
      params.year = year
    }

    if (electricEnergyAnalysisTimeType === 'month' && time) {
      const month = moment(time).format('YYYY-MM')
      params.month = month
    }

    if (electricEnergyAnalysisTimeType === 'day' && time) {
      const date = moment(time).format('YYYY-MM-DD')
      params.date = date
    }

    const { data = {} } = await apiStation({
      apiMethod: 'stat_real_power_last',
      stationId: id,
      ...params
    })

    setElectricEnergyAnalysis(data || {})
  }

  const renderBaseData = () => {
    return (
      <div className="baseData">
        <img src={image} alt="" style={{ width: '100%' }} />
        <div className="baseData-row">
          <div className="baseData-row-label">{t('dianzhanmingcheng')}</div>
          <div>{dataValue.station_name}</div>
        </div>
        <div className="baseData-row">
          <div className="baseData-row-label">{t('dianzhanleixing')}</div>
          <div>{stationTypeObj[dataValue.station_type || '']}</div>
        </div>
        <div className="baseData-row">
          <div className="baseData-row-label">{t('xitongleixing')}</div>
          <div>{sysTypeObj[dataValue.sys_type || '']}</div>
        </div>
        <div className="baseData-row">
          <div className="baseData-row-label">{t('yezhudianhua')}</div>
          <div>{dataValue.owner_phone}</div>
        </div>
      </div>
    )
  }

  const renderTabs = () => {
    const renderTabs1 = () => {
      return (
        <div className="renderTabs1">
          <div className="renderTabs1-content">
            <div>
              <div className="label" style={styleLabelSize}>
                {t('fadiangonglv')}
                <span className="value" style={styleValueSize}>
                  {statRealGenerateData.pvAllPower}
                </span>
                kW
              </div>
            </div>
            <div style={{ marginLeft: 50 }}>
              <div className="label" style={styleLabelSize}>
                {t('zhuangjirongliang')}
                <span className="value" style={styleValueSize}>
                  {dataValue.station_power}
                </span>
                MWp
              </div>
            </div>
          </div>
          <div className="renderTabs1-footer">
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangrifadianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealGenerateData.curDayKWh}
                </span>
                kWh
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangyuefadianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealGenerateData.curMonthKWh}
                </span>
                kWh
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangnianfadianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealGenerateData.curYearMWh}
                </span>
                MWh
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('zongfadianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealGenerateData.allMWh}
                </span>
                MWh
              </div>
            </div>
          </div>
        </div>
      )
    }

    const renderTabs2 = () => {
      return (
        <div className="renderTabs1">
          <div className="renderTabs1-content">
            <div>
              <div className="label" style={styleLabelSize}>
                {t('yongdiangonglv')}
                <span className="value" style={styleValueSize}>
                  {statRealUse.currentKW}
                </span>
                kW
              </div>
            </div>
          </div>
          <div className="renderTabs1-footer">
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangriyongdianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealUse.curDayKWh}
                </span>
                kWh
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangyueyongdianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealUse.curMonthKWh}
                </span>
                kWh
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangnianyongdianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealUse.curYearKWh}
                </span>
                kWh
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('zongyongdianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {statRealUse.allKWh}
                </span>
                kWh
              </div>
            </div>
          </div>
        </div>
      )
    }

    const renderTabs3 = () => {
      return (
        <div className="renderTabs1">
          <div className="renderTabs1-content">
            <div>
              <div className="label" style={styleLabelSize}>
                {t('dianwangchongdiangonglv')}
                <span className="value" style={styleValueSize}>
                  {chargingData.chargePower}
                </span>
                kWh
              </div>
            </div>
          </div>
          <div className="renderTabs1-footer">
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangrichongdiandianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {chargingData.curDayAH}
                </span>
                AH
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangyuechongdiandianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {chargingData.curMonthAH}
                </span>
                AH
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('dangnianchongdiandianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {chargingData.curYearAH}
                </span>
                AH
              </div>
            </div>
            <div className="labelValue-item">
              <div className="label" style={styleLabelSize}>
                {t('zongchongdianliang')}
              </div>
              <div className="label" style={styleLabelSize}>
                <span className="value" style={styleValueSize}>
                  {chargingData.allAH}
                </span>
                AH
              </div>
            </div>
          </div>
        </div>
      )
    }

    const itemsArray = [
      {
        label: t('diannengfeixi'),
        key: t('diannengfeixi'),
        children: renderElectricEnergyAnalysis()
      },
      {
        label: t('fadianshishi'),
        key: t('fadianshishi'),
        children: renderTabs1()
      },
      {
        label: t('yongdianshishi'),
        key: t('yongdianshishi'),
        children: renderTabs2()
      },
      {
        label: t('dianwangshishi'),
        key: t('dianwangshishi'),
        children: renderTabs3()
      }
    ]

    return (
      <div className="tabs-data">
        <Tabs
          onChange={() => {}}
          items={itemsArray.map((info, i) => {
            return {
              label: info.label,
              key: info.key,
              children: info.children
            }
          })}
        />
      </div>
    )
  }

  const renderElectricEnergyAnalysis = () => {
    return (
      <div className="electricEnergyAnalysis-body">
        <div className="electricEnergyAnalysis-header">
          {/* 

                  <div>
            <Radio.Group
              onChange={(e) => {
                setElectricEnergyAnalysisTimeType(e.target.value)
              }}
              value={electricEnergyAnalysisTimeType}
            >
              <Radio.Button value="year">{t('nian')}</Radio.Button>
              <Radio.Button value="month">{t('yue')}</Radio.Button>
              <Radio.Button value="day">{t('ri')}</Radio.Button>
            </Radio.Group>
            {electricEnergyAnalysisTimeType !== 'total' && (
              <DatePicker
                onChange={(e) => {
                  getElectricEnergyAnalysis(e)
                }}
                picker={electricEnergyAnalysisTimeType}
                style={{ marginLeft: 10 }}
              />
            )}
          </div>
        */}
        </div>
        <div
          className="electricEnergyAnalysis-content"
          style={{ backgroundImage: flowBg }}
        >
          <div className="row1">
            <div>{t('taiyangnengfadiangonglv')}</div>
            <div style={{ width: 120 }}>{t('nibianqi')}</div>
            <div>{t('shidianchongdiangonglv')}</div>
          </div>
          <div className="row2">
            <div>{electricEnergyAnalysis.pv_all_power}KW</div>
            <div>{electricEnergyAnalysis.powergrid_charge_power}KW</div>
          </div>
          <div className="row3">
            <div>{t('dianchigonglv')}</div>
            <div>{t('fuzaiyongdiangonglv')}</div>
          </div>
          <div className="row4">
            <div>{electricEnergyAnalysis.battery_power}KW</div>
            <div>{electricEnergyAnalysis.load_all_power}KW</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tabsDataBoard-body">
      <div style={{ display: 'flex' }}>
        {renderBaseData()}

        <div style={{ display: 'flex', flex: 1, marginLeft: 10 }}>
          {renderTabs()}
        </div>
      </div>
      {/**       <DataBoardHistory stationId={id} /> */}

      <DataBoardHistory1 stationId={id} />

      <DataBoardTable stationId={id} />
    </div>
  )
}

export default TabsDataBoard
