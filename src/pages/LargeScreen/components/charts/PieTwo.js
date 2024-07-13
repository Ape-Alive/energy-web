import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts/lib/echarts";
import { ActiveRingChart } from "@jiaminghi/data-view-react";
class Pid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selfItem: null,
    };
  }

  // 组件装载完毕
  componentDidMount() {}

  // 组件更新完毕
  componentDidUpdate() {
    // selfItem.setOption(value);
  }

  // 加载完成后回调
  onChartReadyCallback = () => {};
  fontSize(res) {
    let docEl = document.documentElement,
      clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
  }
  getOption() {
    const { pieData } = this.props;
    const data = pieData.map((info) => {
      return { value: info.total + 0.00001, name: info.label };
    });
    const chartOption = {
      radius: ["60%", "70%"],
      activeRadius: "70%",

      color: ["#37a2da", "#32c5e9", "#67e0e3", "#9fe6b8", "#ffdb5c"],
      data: data,
      digitalFlopStyle: {
        fontSize: this.fontSize(0.12),
        fill: "#bcdcff",
      },
      showOriginValue: true,
      lineWidth: 25,
    };
    return chartOption;
  }

  render() {
    return (
      <ActiveRingChart
        config={this.getOption()}
        style={{ height: "100%", width: "100%" }}
      />
    );
  }
}

export default Pid;
