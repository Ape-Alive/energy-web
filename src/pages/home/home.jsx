import { useState, useRef, useEffect } from 'react'
import { DatePicker, Radio, ConfigProvider } from 'antd'
import * as echarts from 'echarts'
import user from '@/assets/home/user.png'
import equipment from '@/assets/home/equipment.png'
import online from '@/assets/home/online.png'
import Offline from '@/assets/home/Offline.png'
import warn from '@/assets/home/warn.png'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import { Trans, useTranslation } from 'react-i18next'

import './home.less'
import { apiDashboard, apiDevice } from '@/services/api'
import moment from 'moment'

let timeoutId = ''
let timeoutChar1Id = ''

const Home = () => {
  const { t } = useTranslation()
  const [timeType, setTimeType] = useState('year')

  const [clientCount, setClientCount] = useState(0)
  const [deviceCount, setDeviceCount] = useState(0)
  const [deviceOnlineNum, setDeviceOnlineNum] = useState(0)
  const [deviceOfflineNum, setDeviceOfflineNum] = useState(0)
  const [deviceAlarm, setDeviceAlarm] = useState(0)

  const [deviceTypeList, setDeviceTypeList] = useState([])

  useEffect(() => {
    getGetDeviceType()

    return () => {
      timeoutId && clearInterval(timeoutId)
      timeoutChar1Id && clearInterval(timeoutChar1Id)
    }
  }, [])

  useEffect(() => {
    initBase()
    initChar1()
    initChar2()
    initChar3()
    initChar4(deviceTypeList)
    window.windowDeviceTypeList = deviceTypeList
    if (!timeoutId) {
      timeoutId = setInterval(() => {
        initBase()
        initChar2()
        initChar3()
        initChar4(window.windowDeviceTypeList)
      }, 30 * 1000)
    }
    if (!timeoutChar1Id) {
      timeoutChar1Id = setInterval(() => {
        initChar1()
      }, 30 * 1000)
    }
  }, [deviceTypeList])

  const getGetDeviceType = async () => {
    const { data = [] } = await apiDevice({ apiMethod: 'getDeviceType' })
    setDeviceTypeList(data)
  }

  const initBase = async () => {
    const { data = {} } = await apiDashboard({ apiMethod: 'base' })
    const {
      clientCount = 0,
      deviceCount = 0,
      deviceOfflineNum = 0,
      deviceOnlineNum = 0,
      deviceAlarmNum = 0
    } = data

    setClientCount(clientCount)
    setDeviceCount(deviceCount)
    setDeviceOnlineNum(deviceOnlineNum)
    setDeviceOfflineNum(deviceOfflineNum)
    setDeviceAlarm(deviceAlarmNum)
  }

  const initChar1 = async (time) => {
    const params = {}

    if (timeType === 'year' && time) {
      const year = moment(time).format('YYYY')
      params.year = year
    }

    if (timeType === 'month' && time) {
      const year = moment(time).format('YYYY')
      const month = moment(time).format('MM')
      params.year = year
      params.month = month
    }

    const { data = [] } = await apiDashboard({
      apiMethod: 'deviceIncrement',
      ...params
    })
    const obj = {}
    const objArrayValue = {}
    const typeNameArray = []
    const timeList = []
    data.forEach((info) => {
      typeNameArray.push(info.typeName)
      info.item.forEach((val) => {
        if (!obj[val.time_]) {
          obj[val.time_] = {}
        }
        obj[val.time_][info.typeName] = val.count_
      })
    })

    Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        const object = obj[key]
        timeList.push(key)
        typeNameArray.forEach((name) => {
          if (!objArrayValue[name]) {
            objArrayValue[name] = []
          }
          objArrayValue[name].push(Number(object[name] || 0))
        })
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
        right: '4%',
        bottom: '25px',
        top: '10%',
        containLabel: true
      },

      legend: {
        data: typeNameArray,
        bottom: '0px'
      },
      xAxis: [
        {
          type: 'category',
          // boundaryGap: false,
          data: timeList
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: typeNameArray.map((name) => {
        return {
          name: name,
          type: 'bar',

          data: objArrayValue[name]
        }
      })
    }
    myChart.clear()
    myChart.setOption(option)
  }

  const initChar2 = async () => {
    const { data = [] } = await apiDashboard({ apiMethod: 'deviceStatus' })
    const onlineArray = []
    const offlineArray = []
    const yAxis = []
    data.forEach(({ offline, online, typeName }) => {
      onlineArray.push(Number(online))
      offlineArray.push(Number(offline))
      yAxis.push(typeName)
    })
    const myChart = echarts.init(document.getElementById('char2'))
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '1%',
        right: '4%',
        bottom: '25px',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },

      legend: {
        data: [t('home.online'), t('home.offline')],
        bottom: '0px'
      },
      yAxis: {
        type: 'category',
        data: yAxis
      },
      series: [
        {
          name: t('home.online'),
          type: 'bar',
          data: onlineArray
        },
        {
          name: t('home.offline'),
          type: 'bar',
          data: offlineArray
        }
      ]
    }
    myChart.clear()
    myChart.setOption(option)
  }

  const initChar3 = async () => {
    const { data = [] } = await apiDashboard({ apiMethod: 'deviceAlarm' })
    const xAxis = []
    const yAxis = []

    data.forEach((info) => {
      xAxis.push(info.typeName)
      yAxis.push(Number(info.alarmCount))
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
        right: '4%',
        bottom: '5px',
        top: '10%',
        containLabel: true
      },

      xAxis: {
        type: 'category',
        data: xAxis
      },

      yAxis: {
        type: 'value'
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

  const initChar4 = async (array) => {
    const { data = [] } = await apiDashboard({ apiMethod: 'clientDevice' })

    const objArrayValue = {}
    const allName = array.map(({ name }) => {
      objArrayValue[name] = []
      return name
    })
    const clientNameList = []

    data.forEach((info) => {
      clientNameList.push(info.clientTitle)
      const keyValye = {}
      info.item.forEach((val) => {
        keyValye[val.name] = Number(val.num)
      })
      allName.forEach((name) => {
        const num = keyValye[name] || 0
        objArrayValue[name].push(num)
      })
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
        right: '4%',
        bottom: '25px',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false // 不显示坐标轴线
        }
      },
      legend: {
        data: allName,
        bottom: '0px'
      },
      dataZoom: [
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'none'
        }
      ],
      yAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false // 不显示坐标轴线
        },
        data: clientNameList
      },
      series: allName.map((name) => {
        return {
          name: name,
          type: 'bar',
          stack: 'total',

          emphasis: {
            focus: 'series'
          },
          data: objArrayValue[name]
        }
      })
    }
    myChart.clear()
    myChart.setOption(option)
  }

  const renderTag = () => {
    const list = [
      { number: clientCount, name: 'home.title1', image: user },
      { number: deviceCount, name: 'home.title2', image: equipment },
      { number: deviceOnlineNum, name: 'home.title3', image: online },
      { number: deviceOfflineNum, name: 'home.title4', image: Offline },
      { number: deviceAlarm, name: 'home.title5', image: warn }
    ]

    return (
      <div className="tag-body">
        {list.map((info) => {
          return (
            <div className="tag-item">
              <div>
                <img src={info.image} />
              </div>
              <div>
                <div className="tag-number">{info.number}</div>
                <div className="tag-name">
                  <Trans>{info.name}</Trans>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderChar1 = () => {
    return (
      <div className="renderChar1">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="char-title">
            <Trans>home.charTitle1</Trans>
          </div>
          <div>
            <Radio.Group
              value={timeType}
              onChange={(e) => {
                setTimeType(e.target.value)
              }}
            >
              <Radio.Button value="year">{t('nian')}</Radio.Button>
              <Radio.Button value="month">{t('yue')}</Radio.Button>
            </Radio.Group>

            <DatePicker
              onChange={(e) => {
                timeoutChar1Id && clearInterval(timeoutChar1Id)
                initChar1(e)

                timeoutChar1Id = setInterval(() => {
                  initChar1(e)
                }, 30 * 1000)
              }}
              picker={timeType}
              style={{ marginLeft: 10 }}
            />
          </div>
        </div>
        <div className="char-content">
          <div className="char" id="char1"></div>
        </div>
      </div>
    )
  }

  const renderChar2 = () => {
    return (
      <div className="renderChar2">
        <div className="char-title">
          <Trans>home.charTitle2</Trans>
        </div>
        <div className="char-content">
          <div className="char" id="char2"></div>
        </div>
      </div>
    )
  }

  const renderChar3 = () => {
    return (
      <div className="renderChar3">
        <div className="char-title">
          <Trans>home.charTitle3</Trans>
        </div>
        <div className="char-content">
          <div className="char" id="char3"></div>
        </div>
      </div>
    )
  }

  const renderChar4 = () => {
    return (
      <div className="renderChar4">
        <div className="char-title">
          <Trans>home.charTitle4</Trans>
        </div>
        <div className="char-content">
          <div className="char" id="char4"></div>
        </div>
      </div>
    )
  }

  const language = localStorage.getItem('language') || 'en'
  const enumLang = {
    en: enUS,
    zh: zhCN
  }

  return (
    <ConfigProvider locale={enumLang[language]}>
      <div className="home-body">
        {renderTag()}
        <div className="renderChart-body">
          <div className="renderChart-body-row">
            {renderChar1()}
            {renderChar2()}
          </div>
          <div className="renderChart-body-row">
            {renderChar3()}
            {renderChar4()}
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Home
