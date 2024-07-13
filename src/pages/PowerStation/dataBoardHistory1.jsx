import { Radio, DatePicker, Tabs } from 'antd'
import { useState, useEffect } from 'react'
import * as echarts from 'echarts'
import { Trans, useTranslation } from 'react-i18next'
import './dataBoardHistory.less'
import { apiStation } from '@/services/api'
import moment from 'moment'

let timeId = ''
let timeId1 = ''

let seriesGlobal = []
let time_Global = []

const DataBoardHistory = ({ stationId }) => {
  const { t } = useTranslation()

  const [useHistoryTimeType, setUseHistoryTimeType] = useState('month')

  const [haschangeBool, setHaschangeBool] = useState(false)

  useEffect(() => {
    getData1()

    return () => {
      timeId && clearInterval(timeId)
      timeId1 && clearInterval(timeId1)
    }
  }, [])

  const getData1 = async () => {
    const { series, time_ } = await initUseHistoryChar1()
    seriesGlobal = series
    time_Global = time_

    timeId1 = setInterval(async () => {
      const { series, time_ } = await initUseHistoryChar11(
        seriesGlobal,
        time_Global
      )
      seriesGlobal = series
      time_Global = time_
    }, 5 * 1000)
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

    const { data = [] } = await apiStation({
      apiMethod: 'stat_history_use_daily',
      stationId: stationId,
      ...params
    })

    const obj = {}
    const series = []
    let day = []

    data.forEach((info) => {
      Object.keys(info).forEach((key) => {
        if (!obj[key]) {
          obj[key] = []
        }
        obj[key].push(info[key])
      })
    })

    Object.keys(obj).forEach((key) => {
      if (key === 'day') {
        day = obj[key]
      } else {
        series.push({
          name: t(key),
          type: 'bar',
          data: obj[key]
        })
      }
    })

    const myChart = echarts.init(document.getElementById('char3'))
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
        data: day,
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

      series: series
    }
    !series.length && myChart.clear()
    myChart.setOption(option)
  }

  const initUseHistoryChar1 = async () => {
    const params = {}

    const date = moment().format('YYYY-MM-DD')
    params.date = date

    let { data } = await apiStation({
      apiMethod: 'stat_history_power',
      stationId: stationId,
      ...params
    })

    let obj = {}
    const series = []
    let time_ = []

    data.forEach((info) => {
      Object.keys(info).forEach((key) => {
        if (!obj[key]) {
          obj[key] = []
        }
        obj[key].push(info[key])
      })
    })

    Object.keys(obj).forEach((key) => {
      if (key === 'time_') {
        time_ = obj[key]
      } else {
        series.push({
          name: key,
          type: 'line',
          data: obj[key]
        })
      }
    })

    const myChart = echarts.init(document.getElementById('char4'))
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
        data: time_,
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

      series: series
    }
    !series.length && myChart.clear()
    myChart.setOption(option)

    return { series, time_ }
  }

  const initUseHistoryChar11 = async (series, time_) => {
    let { data } = await apiStation({
      apiMethod: 'stat_real_power_minute',
      stationId: stationId,
      date: moment().format('YYYY-MM-DD'),
      minute: moment().format('HH:mm:ss')
    })

    let obj = {}

    data.forEach((info) => {
      Object.keys(info).forEach((key) => {
        if (!obj[key]) {
          obj[key] = []
        }
        obj[key].push(info[key])
      })
    })

    Object.keys(obj).forEach((key) => {
      if (key === 'time_') {
        time_ = [...time_, ...obj[key]]
      } else {
        series.push({
          name: key,
          type: 'line',
          data: obj[key]
        })
      }
    })

    const myChart = echarts.init(document.getElementById('char4'))
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
        data: time_,
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

      series: series
    }

    !series.length && myChart.clear()
    myChart.setOption(option)
    return { series, time_ }
  }

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
            </Radio.Group>
            {useHistoryTimeType !== 'total' && (
              <DatePicker
                onChange={(e) => {
                  initUseHistoryChar(e)
                  timeId && clearInterval(timeId)
                  timeId = ''
                  if (useHistoryTimeType === 'day') {
                    timeId = setInterval(() => {
                      initUseHistoryChar(e)
                    }, 30 * 1000)
                  }
                }}
                picker={useHistoryTimeType}
                style={{ marginLeft: 10 }}
              />
            )}
          </div>
        </div>
        <div id="char3"></div>
      </div>
    )
  }

  const renderUserHistory1 = () => {
    return (
      <div className="">
        <div className="dataBoardHistory-header">
          <div></div>
        </div>
        <div id="char4"></div>
      </div>
    )
  }

  const itemsArray = [
    {
      label: t('gonglvlishi'),
      key: t('gonglvlishi'),
      children: renderUserHistory1()
    },
    {
      label: t('dianlianglishi'),
      key: t('dianlianglishi'),
      children: renderUserHistory()
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

          setHaschangeBool(true)
          initUseHistoryChar()
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
