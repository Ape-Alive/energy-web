import { Radio, DatePicker } from 'antd'
import { useState, useEffect } from 'react'
import * as echarts from 'echarts'
import { Trans, useTranslation } from 'react-i18next'
import './dataBoardTable.less'
import { apiStation } from '@/services/api'

const dataBoardTable = ({ stationId }) => {
  const { t } = useTranslation()
  const [charTimeType, setCharTimeType] = useState('year')
  const [inverterRankingList, setInverterRanking] = useState([])
  const [systemProfileList, setSystemProfileList] = useState([])

  const language = localStorage.getItem('language') || 'en'
  const styleLabelSize = {
    fontSize: language === 'zh' ? '1.2vw' : '0.8vw'
  }
  const styleValueSize = {
    fontSize: language === 'zh' ? '1.9vw' : '1.9vw'
  }

  useEffect(() => {
    getinverterRanking()
    getSystemProfileList()
  }, [])

  const getinverterRanking = async () => {
    const { data = [] } = await apiStation({
      apiMethod: 'stat_order_inverter',
      stationId
    })
    setInverterRanking(data || [])
  }

  const getSystemProfileList = async () => {
    const { data = [] } = await apiStation({
      apiMethod: 'stat_device_count',
      stationId
    })
    setSystemProfileList(data || [])
  }

  const renderLeftItem = () => {
    return (
      <div className="ranking-body">
        <div>{t('nibianqipaiming')}</div>
        <div className="ranking-content">
          <div className="ranking-content-header">
            <div>{t('ninbianqimingcheng')}</div>
            <div>{t('dangripvfadianliangpaiming')}</div>
          </div>
          <div className="ranking-content-row-body">
            {inverterRankingList.map((info) => {
              return (
                <div className="ranking-content-row">
                  <div>{info.device_name}</div>
                  <div>{info.pv_all_power}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderSystemProfile = () => {
    return (
      <div className="renderSystemProfile-body">
        <div>{t('xitonggaiyao')}</div>
        <div className="renderSystemProfile-content">
          {systemProfileList.map((info) => {
            return (
              <div className="renderSystemProfile-content-item">
                <div className="renderSystemProfile-content-labelValue">
                  <div style={styleLabelSize}>{info.typeName}</div>
                </div>
                <div className="renderSystemProfile-content-labelValue">
                  <div style={styleLabelSize}>{t('zaixian')}</div>
                  <div style={styleValueSize}>{info.online}</div>
                </div>
                <div className="renderSystemProfile-content-labelValue">
                  <div style={styleLabelSize}>{t('lixian')}</div>
                  <div style={styleValueSize}>{info.offline}</div>
                </div>
                <div className="renderSystemProfile-content-labelValue">
                  <div style={styleLabelSize}>{t('gaojing')}</div>
                  <div style={styleValueSize}>{info.alarm}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="dataBoardTable-body">
      {renderLeftItem()}
      {renderSystemProfile()}
    </div>
  )
}

export default dataBoardTable
