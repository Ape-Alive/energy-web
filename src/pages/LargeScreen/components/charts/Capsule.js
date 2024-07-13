import React, { PureComponent } from 'react';
import { CapsuleChart } from '@jiaminghi/data-view-react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';

class Capsule extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fontSize(res) {
    const docEl = document.documentElement,
      clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    if (!clientWidth) return;
    const fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
  }

  getOption() {
    const { capsuleData } = this.props;

    const nameList = capsuleData.map((info) => {
      return info.label;
    });

    const labelList = capsuleData.map((info) => {
      return info.total;
    });
    const chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '0%',
        left: '27%',
        right: '2%',
        bottom: '10%'
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: '#BCDCF0'
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.1)',
            borderRadius: [10, 10, 10, 10]
          }
        }
      },
      // dataZoom: [
      //   //滑动条
      //   {
      //     yAxisIndex: 0, //这里是从X轴的0刻度开始
      //     show: true, //是否显示滑动条，不影响使用
      //     type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
      //     startValue: 0, // 从头开始。
      //     endValue: 13, // 一次性展示6个。
      //     color: "#d1e6eb",
      //   },
      // ],
      yAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          show: true,
          fontSize: this.fontSize(0.1),
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
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.1)',
            borderRadius: [10, 10, 10, 10]
          }
        },

        axisTick: {
          show: false
        },
        data: nameList
      },
      series: [
        {
          type: 'bar',

          data: labelList,
          barWidth: this.fontSize(0.1),
          label: {
            normal: {
              offset: [13, 0],
              show: true,
              position: 'insideRight',
              textStyle: {
                color: '#d1e6eb',
                fontSize: this.fontSize(0.1)
              }
            }
          },

          itemStyle: {
            emphasis: {
              barBorderRadius: 10
            },
            normal: {
              barBorderRadius: [10, 10, 10, 10],

              backgroundColor: 'rgba(255, 255, 255, 0)',
              color: function (params) {
                // build a color map as your need.
                const colorList = [
                  '#b7f3cc',
                  '#ffdb5c',
                  '#f7d896',
                  '#fdf8b0',
                  '#f7a65b',
                  '#ff9f7f',
                  '#f4d7ff',
                  '#37a2da',
                  '#32c5e9',
                  '#67e0e3',
                  '#ffdb5c',
                  '#68d38d',
                  '#9fe6b8',
                  '#b7f3cc',
                  '#ffdb5c',
                  '#32c5e9',
                  '#fdf8b0',
                  '#f7a65b',
                  '#ff9f7f',
                  '#ff67c5',
                  '#e9a1ff',
                  '#f4d7ff',
                  '#fb7293',
                  '#fdf8b0',
                  '#ffb6b6'
                ];

                return colorList[params.dataIndex];
              }
            }
          }
        }
      ]
    };
    return chartOption;
  }

  render() {
    const { capsuleData } = this.props;

    return (
      <ReactEcharts
        ref={(element) => {
          this.echarts_react = element;
        }}
        style={{ flex: 7.5, height: '100%' }}
        option={this.getOption()}
        notMerge
        lazyUpdate
        theme="theme_name"
        onChartReady={this.onChartReadyCallback}
      />
    );
  }
}

export default Capsule;
