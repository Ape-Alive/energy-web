import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import React, { Component } from 'react'

class MonthBars extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selfItem: null
    }
  }

  // 组件装载完毕
  componentDidMount() {
    const selfItem = this.echarts_react.getEchartsInstance()
    this.setState({ selfItem })
  }

  // 组件更新完毕
  componentDidUpdate() {
    // selfItem.setOption(value);
  }

  // 加载完成后回调
  onChartReadyCallback = () => {}

  fontSize(res) {
    const docEl = document.documentElement,
      clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
    if (!clientWidth) return
    const fontSize = 100 * (clientWidth / 1920)
    return res * fontSize
  }

  getOption() {
    const { projectStatisticsList, projectId } = this.props

    let dateList = []
    let doneList = [] // 核查完成
    let processList = [] // 内业
    let inspectList = [] // 外业
    projectStatisticsList.forEach((info) => {
      if (info.project.id === projectId) {
        if (info.date) {
          dateList = info.date.map((item) => {
            return item.name
          })
          processList = info.date.map((item) => {
            return item.process
          })
          inspectList = info.date.map((item) => {
            return item.inspect
          })
          doneList = info.date.map((item) => {
            return item.done
          })
        }
      }
    })
    const chartOption = {
      title: {
        show: false
      },
      legend: {
        show: true,
        top: '0%',
        textStyle: {
          color: '#c0c9d2',
          fontSize: this.fontSize(0.12)
        }
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)'
                },
                {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }
              ],
              global: false
            }
          }
        }
      },
      grid: {
        top: '20%',
        left: '10%',
        right: '10%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: true
        },
        splitArea: {
          color: '#f00',
          lineStyle: {
            color: '#f00'
          }
        },
        axisLabel: {
          fontSize: this.fontSize(0.12),
          color: '#BCDCF0'
        },
        splitLine: {
          show: false
        },
        boundaryGap: false,
        data: dateList
      },

      yAxis: {
        type: 'value',
        min: 0,
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
        axisLine: {
          show: true
        },
        axisLabel: {
          show: true,
          margin: 10,
          textStyle: {
            color: '#d1e6eb'
          }
        },
        axisTick: {
          show: false
        }
      },
      series: [
        {
          name: '外业',
          type: 'line',
          lineStyle: {
            normal: {
              color: '#d81e06',
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5
            }
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#ffffff'
            }
          },
          // 去除点标记
          // symbolSize: 0,
          // 鼠标放上去还是要有颜色的
          itemStyle: {
            color: '#d81e06'
          },
          // 设置渐变色
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: '#d81e0677'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,179,244,0)'
                  }
                ],
                false
              ),
              shadowColor: '#d81e0677',
              shadowBlur: 20
            }
          },
          data: inspectList
        },
        {
          name: '内业',
          type: 'line',
          // 阴影
          lineStyle: {
            normal: {
              color: '#0d82c7',
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5
            }
          },
          label: {
            show: false,
            position: 'top',
            textStyle: {
              color: '#0d82c7'
            }
          },
          // 去除点标记
          symbolSize: 0,
          itemStyle: {
            color: '#0d82c7'
          },
          // 设置渐变色
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgb(12, 109, 165)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,202,149,0)'
                  }
                ],
                false
              ),
              shadowColor: 'rgb(12, 109, 165)',
              shadowBlur: 20
            }
          },
          data: processList
        },
        {
          name: '处理完成',
          type: 'line',
          lineStyle: {
            normal: {
              color: '#87d068',
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5
            }
          },
          label: {
            show: false,
            position: 'top',
            textStyle: {
              color: '#87d068'
            }
          },
          // 去除点标记
          symbolSize: 0,
          // 鼠标放上去还是要有颜色的
          itemStyle: {
            color: '#87d068'
          },
          // 设置渐变色
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(0,179,42,0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,179,42,0.3)'
                  }
                ],
                false
              ),
              shadowColor: 'rgba(0,179,42,0.3)',
              shadowBlur: 20
            }
          },
          data: doneList
        }
      ]
    }

    return chartOption
  }

  render() {
    return (
      <ReactEcharts
        ref={(element) => {
          this.echarts_react = element
        }}
        style={{ flex: 1, height: '90%' }}
        option={this.getOption()}
        notMerge
        lazyUpdate
        theme="theme_name"
        onChartReady={this.onChartReadyCallback}
      />
    )
  }
}

export default MonthBars
