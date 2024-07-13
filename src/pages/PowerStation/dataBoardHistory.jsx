import { Radio, DatePicker, Tabs } from 'antd'
import { useState, useEffect } from 'react'
import * as echarts from 'echarts'
import { Trans, useTranslation } from 'react-i18next'
import './dataBoardHistory.less'
import { apiStation } from '@/services/api'
import moment from 'moment'

const DataBoardHistory = ({ stationId }) => {
  const { t } = useTranslation()
  const [generateHistoryTimeType, setGenerateHistoryTimeType] =
    useState('month')
  const [useHistoryTimeType, setUseHistoryTimeType] = useState('month')

  const [haschangeBool, setHaschangeBool] = useState(false)

  useEffect(() => {
    initUseHistoryChar()
  }, [])

  const language = localStorage.getItem('language') || 'en'
  const styleLabelSize = {
    fontSize: language === 'zh' ? '1.2vw' : '0.8vw'
  }
  const styleValueSize = {
    fontSize: language === 'zh' ? '1.9vw' : '1.9vw'
  }

  const initgenerateHistoryChar = async (time) => {
    const params = {}

    if (generateHistoryTimeType === 'year' && time) {
      const year = moment(time).format('YYYY')
      params.year = year
    }

    if (generateHistoryTimeType === 'month' && time) {
      const month = moment(time).format('YYYY-MM')
      params.month = month
    }

    if (generateHistoryTimeType === 'day' && time) {
      const date = moment(time).format('YYYY-MM-DD')
      params.date = date
    }

    const { data = {} } = await apiStation({
      apiMethod: 'stat_generate_history',
      stationId: stationId,
      ...params
    })

    const xAxis = []
    const yAxis = []

    data.forEach((info) => {
      xAxis.push(info.time_)
      yAxis.push(info.count_)
    })

    const myChart = echarts.init(document.getElementById('char1'))
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        left: '1%',
        right: '40px',
        bottom: '5px',
        top: '40px',
        containLabel: true
      },

      xAxis: {
        type: 'category',
        data: xAxis,
        axisLabel: {
          show: true
        },
        axisLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true
        },
        axisLine: {
          show: true
        }
      },

      series: [
        {
          data: yAxis,
          type: 'bar'
        }
      ]
    }
    myChart.clear()
    myChart.setOption(option)
  }

  const initUseHistoryChar = async (time) => {
    const params = {}

    if (useHistoryTimeType === 'year' && time) {
      const year = moment(time).format('YYYY')
      params.year = year
    }

    if (useHistoryTimeType === 'month' && time) {
      const month = moment(time).format('YYYY-MM')
      params.month = month
    }

    if (useHistoryTimeType === 'day' && time) {
      const date = moment(time).format('YYYY-MM-DD')
      params.date = date
    }

    const { data = {} } = await apiStation({
      apiMethod: 'stat_use_history',
      stationId: stationId,
      ...params
    })

    const xAxis = []
    const yAxis = []

    data.forEach((info) => {
      xAxis.push(info.time_)
      yAxis.push(info.count_)
    })

    const myChart = echarts.init(document.getElementById('char2'))
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        left: '1%',
        right: '40px',
        bottom: '5px',
        top: '40px',
        containLabel: true
      },

      xAxis: {
        type: 'category',
        data: xAxis,
        axisLabel: {
          show: true
        },
        axisLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true
        },
        axisLine: {
          show: true
        }
      },

      series: [
        {
          data: yAxis,
          type: 'bar'
        }
      ]
    }
    myChart.clear()
    myChart.setOption(option)
  }

  // 发电
  const renderGenerateHistory = () => {
    return (
      <div className="">
        <div className="dataBoardHistory-header">
          <div>
            <Radio.Group
              onChange={(e) => {
                setGenerateHistoryTimeType(e.target.value)
              }}
              value={generateHistoryTimeType}
            >
              <Radio.Button value="year">{t('nian')}</Radio.Button>
              <Radio.Button value="month">{t('yue')}</Radio.Button>
              <Radio.Button value="day">{t('ri')}</Radio.Button>
            </Radio.Group>
            {generateHistoryTimeType !== 'total' && (
              <DatePicker
                onChange={(e) => {
                  initgenerateHistoryChar(e)
                }}
                picker={generateHistoryTimeType}
                style={{ marginLeft: 10 }}
              />
            )}
          </div>
        </div>
        <div id="char1"></div>
      </div>
    )
  }

  // 用电
  const renderUserHistory = () => {
    return (
      <div className="">
        <div className="dataBoardHistory-header">
          <div>
            <Radio.Group
              onChange={(e) => {
                setUseHistoryTimeType(e.target.value)
              }}
              value={useHistoryTimeType}
            >
              <Radio.Button value="year">{t('nian')}</Radio.Button>
              <Radio.Button value="month">{t('yue')}</Radio.Button>
              <Radio.Button value="day">{t('ri')}</Radio.Button>
            </Radio.Group>
            {useHistoryTimeType !== 'total' && (
              <DatePicker
                onChange={(e) => {
                  initUseHistoryChar(e)
                }}
                picker={useHistoryTimeType}
                style={{ marginLeft: 10 }}
              />
            )}
          </div>
        </div>
        <div id="char2"></div>
      </div>
    )
  }

  const itemsArray = [
    {
      label: t('yongdianshishi'),
      key: t('yongdianshishi'),
      children: renderUserHistory()
    },
    {
      label: t('fadianshishi'),
      key: t('fadianshishi'),
      children: renderGenerateHistory()
    }
  ]

  return (
    <div className="dataBoardHistory-body">
      <Tabs
        forceRender={true}
        onChange={() => {
          if (haschangeBool) {
            return
          }
          initgenerateHistoryChar()
          setHaschangeBool(true)
        }}
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

export default DataBoardHistory
