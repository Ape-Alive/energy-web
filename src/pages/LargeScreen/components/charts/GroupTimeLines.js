import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class GroupTimeLines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selfItem: null,
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
  onChartReadyCallback = () => {};

  getOption() {
    const { option, values } = this.props;
    const chartOption = {
      grid: {
        left: '15%',
      },
      legend: {
        top: '3%',
        textStyle: {
          color: '#ccc',
        },
      },
      tooltip: {},
      dataset: {
        source: [
          ['type', '各小组平均处理速度（天）', 'AI识别数量'],
          ['组1', 5.5, 24],
          ['组2', 5.2, 12],
          ['组3', 5.7, 27],
          ['组4', 6.1, 41],
          ['组5', 4.9, 22],
          ['组6', 5.5, 25],
          ['组7', 5.3, 66],
          ['组8', 5.2, 35],
        ],
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          type: 'value',
          textStyle: {
            color: '#ccc',
          },
        },
      },
      yAxis: {
        axisLabel: {
          textStyle: {
            color: '#ccc',
          },
        },
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        {
          type: 'bar',
          barGap: '-100%',
          barCategoryGap: '50%',
          itemStyle: {
            normal: { color: '#089500' },
          },
          label: {
            normal: {
              show: true,
              position: 'insideTop',
            },
          },
        },
      ],
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

export default GroupTimeLines;
