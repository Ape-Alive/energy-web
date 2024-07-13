import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class GroupBars extends Component {
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
          fontSize: 16,
          color: '#ccc',
        },
      },
      tooltip: {},
      dataset: {
        source: [
          ['type', '发现',  '核查','处理'],
          ['核心区', 2, 2, 2],
          ['缓冲区', 10, 8, 5],
          ['试验区', 4, 4, 3],
        ],
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          textStyle: {
            fontSize: 16,
            color: '#ccc',
          },
        },
      },
      yAxis: {
        axisLabel: {
          type: 'value',
          textStyle: {
            fontSize: 16,
            color: '#ccc',
          },
        },
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: { color: '#006c9a' },
          },
          label: {
            normal: {
              show: true,
              position: 'insideTop',
            },
          },
        },
        {
          type: 'bar',
          barGap: '-100%',
          barCategoryGap: '50%',
          itemStyle: {
            normal: { color: '#c1d04a' },
          },
          label: {
            normal: {
              show: true,
              position: 'insideTop',
            },
          },
        },
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

export default GroupBars;
