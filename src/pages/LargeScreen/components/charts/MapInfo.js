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
    const data = {
      title: '',
      dataNum: [
        {
          name: '待处理数量',
          value: '2',
        },
        {
          name: '处理中数量',
          value: '4',
        },
        {
          name: '已处理数量',
          value: '10',
        },
      ],
      dataArea: [
        {
          name: '待处理面积',
          value: '4299',
        },
        {
          name: '处理中面积',
          value: '6529',
        },
        {
          name: '已处理面积',
          value: '27834',
        },
      ],
    };
    const chartOption = {
      backgroundColor: 'transparent',
      color: ['#39b835', '#438bcc', '#cf4c48'],
      title: [
        {
          top: '10%',
          text: data.title + '图斑数量',
          textStyle: {
            color: '#eee',
            fontSize: 16,
            align: 'center',
          },
          left: '25%',
        },
        {
          top: '10%',
          text: data.title + '图斑面积',
          textStyle: {
            color: '#eee',
            fontSize: 16,
            align: 'center',
          },
          left: '65%',
        },
      ],
      series: [
        {
          color: ['#39b835', '#438bcc', '#cf4c48'],
          type: 'pie',
          radius: ['45%', '55%'],
          center: ['30%', '55%'],
          labelLine: {
            normal: {
              length: 10,
              length2: 30,
              lineStyle: {
                // color: '#41B3DC',
                type: 'solid',
              },
            },
          },
          label: {
            normal: {
              formatter: '{b}' + '\n' + '{d}%' + '\n' + '数量:{c}',
              borderWidth: 0,
              borderRadius: 4,
              padding: [0, -20],
              height: 70,
              fontSize: 16,
              align: 'center',
              // color: '#3494BD',
              rich: {
                b: {
                  fontSize: 16,
                  lineHeight: 16,
                  // color: '#41B3DC'
                },
              },
            },
          },
          data: data.dataNum,
        },
        {
          color: ['#40d93c', '#438bcc', '#cf4c48'],
          type: 'pie',
          radius: ['45%', '55%'],
          center: ['70%', '55%'],
          labelLine: {
            normal: {
              length: 10,
              length2: 30,
              lineStyle: {
                // color: '#41B3DC',
                type: 'solid',
              },
            },
          },
          label: {
            normal: {
              formatter: '{b}' + '\n' + '{d}%' + '\n' + '{c}㎡',
              borderWidth: 0,
              borderRadius: 4,
              padding: [0, -20],
              height: 70,
              fontSize: 16,
              align: 'center',
              // color: '#3494BD',
              rich: {
                b: {
                  fontSize: 16,
                  lineHeight: 16,
                  // color: '#41B3DC'
                },
              },
            },
          },
          data: data.dataArea,
        },
        //end
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
