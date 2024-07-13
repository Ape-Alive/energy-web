import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class GourpPie extends Component {
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
        backgroundColor: 'transparent',
        left: '15%',
      },
      polar: {},
      legend: {
        top: '3%',
        textStyle: {
          color: '#ccc',
        },
      },
      tooltip: {},
      dataset: {
        source: [
          ['type', '分派任务数', '处理任务数'],
          ['小组1', 24, 12],
          ['小组2', 13, 8],
          ['小组3', 27, 22],
          ['小组4', 42, 32],
          ['小组5', 22, 16],
          ['小组6', 27, 23],
          ['小组7', 67, 45],
          ['小组8', 37, 24],
        ],
      },
      angleAxis: {
        type: 'category',
        z: 10,
        axisLabel: {
          textStyle: {
            color: '#ccc',
          },
        },
      },
      radiusAxis: {
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
          coordinateSystem: 'polar',
          // stack: 'a',
          itemStyle: {
            normal: { color: '#006c9a' },
          },
          label: {
            normal: {
              show: true,
              // position: 'insideRight'
            },
          },
        },
        {
          type: 'bar',
          coordinateSystem: 'polar',
          // stack: 'a',
          barGap: '-100%',
          // barCategoryGap: '50%',
          itemStyle: {
            normal: { color: '#089500' },
          },
          label: {
            normal: {
              show: true,
              // position: 'insideRight'
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

export default GourpPie;
