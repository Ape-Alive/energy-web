import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class MonthAILines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selfItem: null
    };
  }

  // 组件装载完毕
  componentDidMount() {
    const selfItem = this.echarts_react.getEchartsInstance();
    this.setState({ selfItem });
  }

  // 组件更新完毕
  componentDidUpdate() {
    const { value, option } = this.props;
    const { selfItem } = this.state;
    // selfItem.setOption(value);
  }

  // 加载完成后回调
  onChartReadyCallback = () => {
  };

  getOption() {
    const { option, values } = this.props;
    const chartOption = {
      grid: {
        left: '15%'
      },
      legend: {
        top: '3%',
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {},
      dataset: {
        source: [
          ['type', '每月平均处理速度（天）', 'AI识别数量'],
          ['1月', 4.2, 24],
          ['2月', 5.2, 12],
          ['3月', 6.2, 27],
          ['4月', 5.7, 41],
          ['5月', 5.3, 22],
          ['6月', 4.6, 25],
          ['7月', 4.5, 66],
          ['8月', 6.1, 35]
        ]
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          type: 'value',
          textStyle: {
            color: '#ccc'
          }
        }
      },
      yAxis: {
        axisLabel: {
          textStyle: {
            color: '#ccc'
          }
        }
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        {
          type: 'line',
          itemStyle: {
            normal: { color: '#006c9a' }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }
      ]
    };
    return chartOption;
  }

  render() {
    return (
      <ReactEcharts
        ref={element => {
          this.echarts_react = element;
        }}
        style={{ height: '100%', width: '100%' }}
        option={this.getOption()}
        notMerge
        lazyUpdate
        theme="theme_name"
        onChartReady={this.onChartReadyCallback}
      />
    );
  }
}

export default MonthAILines;
