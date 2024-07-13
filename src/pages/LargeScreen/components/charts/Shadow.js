import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import React, { Component } from 'react'

class Shadow extends Component {
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

  fontSize(res) {
    let docEl = document.documentElement,
      clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
    if (!clientWidth) return
    let fontSize = 100 * (clientWidth / 1920)
    return res * fontSize
  }

  // 加载完成后回调
  onChartReadyCallback = () => {}

  getOption() {
    const { projectStatisticsList, projectId } = this.props
    let townNameList = []
    let doneList = [] // 核查完成
    let unhandledList = [] // 未核查图斑
    let inspectAndProcessList = [] // 正在核查

    projectStatisticsList.forEach((info) => {
      if (info.project.id === projectId) {
        if (info.towns) {
          const softList = info.towns.slice().sort(function (a, b) {
            return a.total - b.total
          })
          townNameList = softList.map((item) => {
            return item.name
          })
          unhandledList = softList.map((item) => {
            return item.unhandled
          })
          inspectAndProcessList = softList.map((item) => {
            return item.inspect + item.process
          })
          doneList = softList.map((item) => {
            return item.done
          })
        }
      }
    })

    const chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['未核查图斑', '正在核查', '核查完成'],
        top: '0%',
        textStyle: {
          fontSize: this.fontSize(0.12),
          color: '#c0c9d2'
        }
      },
      grid: {
        top: '10%',
        left: '15%',
        right: '5%',
        bottom: '10%'
      },
      xAxis: {
        type: 'value',
        axisLine: {
          show: true
        },

        axisLabel: {
          color: '#BCDCF0'
        },
        splitLine: {
          show: false
        },
        boundaryGap: false
      },
      dataZoom: [
        //滑动条
        {
          yAxisIndex: 0, //这里是从X轴的0刻度开始
          show: true, //是否显示滑动条，不影响使用
          type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
          startValue: 0, // 从头开始。
          endValue: 13, // 一次性展示6个。
          color: '#d1e6eb'
        }
      ],
      yAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          show: true,
          margin: 10,

          textStyle: {
            color: '#d1e6eb',
            fontSize: this.fontSize(0.12)
          }
        },

        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
        axisLine: {
          show: true
        },

        axisTick: {
          show: false
        },
        data: townNameList
      },
      series: [
        {
          name: '未核查图斑',
          type: 'bar',
          stack: 'total',
          barWidth: this.fontSize(0.14),
          emphasis: {
            focus: 'series'
          },

          label: {
            show: true,
            position: 'inside',
            textStyle: {
              color: '#000'
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#d81e06'
                },
                {
                  offset: 0,
                  color: '#d81e0677'
                }
              ])
            }
          },
          data: unhandledList
        },
        {
          name: '正在核查',
          type: 'bar',
          stack: 'total',

          // label: {
          //   show: true,
          //   position: 'inside',
          //   textStyle: {
          //     color: '#000'
          //   }
          // },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#0d82c7'
                },
                {
                  offset: 0,
                  color: 'rgb(12, 109, 165)'
                }
              ])
            }
          },
          emphasis: {
            focus: 'series'
          },
          data: inspectAndProcessList
        },
        {
          name: '核查完成',
          type: 'bar',
          stack: 'total',
          // label: {
          //   show: true,
          //   position: 'inside',
          //   textStyle: {
          //     color: '#000'
          //   }
          // },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#87d068'
                },
                {
                  offset: 0,
                  color: 'rgba(0,179,42,0.3)'
                }
              ])
            }
          },
          emphasis: {
            focus: 'series'
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
        style={{ height: '90%', flex: 1 }}
        option={this.getOption()}
        notMerge
        lazyUpdate
        theme="theme_name"
        onChartReady={this.onChartReadyCallback}
      />
    )
  }
}

export default Shadow
