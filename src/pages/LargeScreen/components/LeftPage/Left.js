import { connect } from "dva";

import { BorderBox12, BorderBox13 } from "@jiaminghi/data-view-react";
import { PureComponent } from "react";
import * as echarts from 'echarts'
import { Radio, DatePicker } from 'antd'
import moment from 'moment'
import { Trans, withTranslation } from 'react-i18next';
import styles from "./Left.less";
import { BorderBox9, BorderBox10 } from '@jiaminghi/data-view-react'
import { apiCharger, apiDashboard, apiInverter, apiStation } from "@/services/api";

import shidian from '@/assets/shidian.png'
import qita from '@/assets/qita.png'
import guangfu from '@/assets/guangfu.png'
import fangdian from '@/assets/fangdian.png'
import chongdianzhuang from '@/assets/chongdianzhuang.png'
import chongdian from '@/assets/chongdian.png'

import zhandaindizhi from '@/assets/zhandaindizhi.png'
import toufangshijian from '@/assets/toufangshijian.png'
import mingcheng from '@/assets/mingcheng.png'
import biaoti from '@/assets/biaoti.png'


let timeId = ''

let timeArray = []
let qtfzglArray = []  // 其他负载
let gfcdglArray = []  // 光伏
let cdzcdglArray = []  // 充电桩
let sdcdzglArray = []   //  市电

@connect(({ }) => ({}))
class Left extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			systemDataType: 'all',
			power_kw: "",
			battery_capacity: '',
			pv_all_power: '',
			systemData: {},
		};
	}

	// 设置时间
	componentDidMount() {


	}

	initChar1 = async () => {
		const { t } = this.props

		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}

		const { data } = await apiDashboard({ apiMethod: "getPowerRealtimeHis", stationId: value.id })





		data.forEach(info => {
			timeArray.push(info.time)
			qtfzglArray.push(info.data.qtfzgl || 0)
			gfcdglArray.push(info.data.gfcdgl || 0)
			cdzcdglArray.push(info.data.cdzcdgl || 0)
			sdcdzglArray.push(info.data.sdcdzgl || 0)
		});


		const myChart = echarts.init(document.getElementById('leftChart1'))
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

			legend: { textStyle: { color: "#fff" }, icon: "circle" },

			color: ['#ffffff', '#FFFF00', '#008000', '#FF0000'],
			grid: {
				left: '5%',
				right: '40px',
				bottom: '10px',
				top: '50px',
				containLabel: true
			},

			xAxis: {
				type: 'category',
				data: timeArray,
				axisLabel: {
					show: true,
					textStyle: {
						color: "#fff",
					},
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: "#fff",
					},
				},
			},
			yAxis:
			{
				type: 'value',
				name: "KW",
				axisLabel: {
					show: true,
					textStyle: {
						color: "#fff",
					},
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: "#fff",
					},

				},

			},

			series: [
				{
					data: qtfzglArray,
					type: 'line',
					smooth: true,
					name: t('qitafuzaigonglv'),
				},
				{
					data: gfcdglArray,
					type: 'line',
					smooth: true,
					name: t('guangfuchongdiangonglv'),
				},
				{
					data: cdzcdglArray,
					type: 'line',
					smooth: true,
					name: t('chongdianzhuangchongdiangonglv'),
				},
				{
					data: sdcdzglArray,
					type: 'line',
					smooth: true,
					name: t('shidianchongdiangonglv1'),
				}
			]
		}
		myChart.clear()
		myChart.setOption(option)
		timeId = setInterval(() => {
			this.initChar11()
		}, 60 * 1000)

	}

	initChar11 = async () => {
		const { t } = this.props
		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}

		const { data } = await apiDashboard({ apiMethod: "getPowerRealtimeHis", stationId: value.id, dateTime: moment().format('YYYY-MM-DD HH:mm') })

		data.forEach(info => {
			timeArray.push(info.time)
			qtfzglArray.push(info.data.qtfzgl || 0)
			gfcdglArray.push(info.data.gfcdgl || 0)
			cdzcdglArray.push(info.data.cdzcdgl || 0)
			sdcdzglArray.push(info.data.sdcdzgl || 0)
		});


		const myChart = echarts.init(document.getElementById('leftChart1'))
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
			legend: { textStyle: { color: "#fff" }, icon: "circle" },
			color: ['#ffffff', '#FFFF00', '#008000', '#FF0000'],
			grid: {
				left: '5%',
				right: '40px',
				bottom: '10px',
				top: '50px',
				containLabel: true
			},

			xAxis: {
				type: 'category',
				data: timeArray,
				axisLabel: {
					show: true,
					textStyle: {
						color: "#fff",
					},
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: "#fff",
					},
				},
			},
			yAxis:
			{
				type: 'value',
				name: "KW",
				axisLabel: {
					show: true,
					textStyle: {
						color: "#fff",
					},
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: "#fff",
					},

				},

			},

			series: [
				{
					data: qtfzglArray,
					type: 'line',
					smooth: true,
					name: t('qitafuzaigonglv'),
				},
				{
					data: gfcdglArray,
					type: 'line',
					smooth: true,
					name: t('guangfuchongdiangonglv'),
				},
				{
					data: cdzcdglArray,
					type: 'line',
					smooth: true,
					name: t('chongdianzhuangchongdiangonglv'),
				},
				{
					data: sdcdzglArray,
					type: 'line',
					smooth: true,
					name: t('shidianchongdiangonglv1'),
				}
			]
		}
		myChart.clear()
		myChart.setOption(option)
		return { timeArray, qtfzglArray, gfcdglArray, cdzcdglArray, sdcdzglArray }
	}


	renderLeftChangeStation = () => {
		return (<div className={styles.leftChangeStationBody}>
			<div className={styles.stationBtn} onClick={() => {
				let index = this.props.indexStation - 1
				if (index === -1) {
					index = this.props.stationListNochild.length - 1
				}
				this.props.changeIndexStation(index)
			}}> <Trans>shanggezhandian</Trans></div>
			<div>{this.props.indexStation + 1}/{this.props.stationListNochild.length}</div>
			<div className={styles.stationBtn} onClick={() => {
				let index = this.props.indexStation + 1
				if (index === this.props.stationListNochild.length) {
					index = 0
				}
				this.props.changeIndexStation(index)
			}}><Trans>xiagezhandian</Trans> </div>
		</div>)
	}


	getOcppAllPower = async () => {
		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}
		const { data = {} } = await apiCharger({ apiMethod: "ocppAllPower", stationId: value.id })
		this.setState({ power_kw: data.power_kw })
	}

	getMessageData = async () => {
		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}
		const { data = {} } = await apiInverter({ apiMethod: "info", id: value.id })
		this.setState({ battery_capacity: data && data.battery_capacity, pv_all_power: data && data.pv_all_power })
	}


	getSystemData = async () => {
		const { systemDataType } = this.state
		const params = {}

		if (systemDataType === 'year') {
			const year = moment().format('YYYY')
			params.year = year
		}

		if (systemDataType === 'month') {
			const month = moment().format('YYYY-MM')
			params.month = month
		}

		if (systemDataType === 'date') {
			const date = moment().format('YYYY-MM-DD')
			params.date = date
		}

		if (systemDataType === 'all') {

		}

		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}
		const { data = {} } = await apiDashboard({ apiMethod: "sysRunStat", stationId: value.id, ...params })
		this.setState({ systemData: data })
	}

	componentDidUpdate(prevProps) {
		if (prevProps.indexStation !== this.props.indexStation) {
			this.getOcppAllPower()
			this.getMessageData()
			this.getSystemData()
			timeArray = []
			qtfzglArray = []  // 其他负载
			gfcdglArray = []  // 光伏
			cdzcdglArray = []  // 充电桩
			sdcdzglArray = []
			timeId && clearInterval(timeId)
			this.initChar1()
		}

	}

	componentWillUnmount() {
		timeId && clearInterval(timeId)
	}


	rendererLeftContent1 = () => {
		const data = this.props.stationListNochild[this.props.indexStation] || {}
		return <div className={styles.content1Body}>
			<div className={styles.header}><span><img src={biaoti} /><Trans>zhandianxinxi</Trans></span></div>
			<div className={styles.baseMessageBody}>
				<div className={styles.baseMessageRow}><img src={mingcheng} className={styles.icon1} /><Trans>zhandianmingcheng</Trans>: {data.station_name}</div>
				<div className={styles.baseMessageRow}><img src={toufangshijian} className={styles.icon1} /><Trans>zhandiantoufangshijian</Trans>: {data.create_at}</div>
				<div style={{ height: '5vh' }} className={styles.baseMessageRow}><img src={zhandaindizhi} className={styles.icon1} /><Trans>zhandiandizhi</Trans>: {data.address}</div>
				<div className={styles.baseMessageRow1}>
					<div className={styles.baseMessageRow1Item}>
						<BorderBox9 style={{ width: '12vw' }}>
							<div className={styles.baseMessageRow1ItemBody}>
								<div><Trans>zhaungjirongliang</Trans></div>
								<div><span className="largeScreenValue">{data.station_power || 0}</span> kWh</div>
							</div>
						</BorderBox9>
					</div>
					<div className={styles.baseMessageRow1Item} >
						<BorderBox9 style={{ width: '12vw' }}>
							<div className={styles.baseMessageRow1ItemBody}>
								<div><Trans>guangfuzuchuangonglv</Trans></div>
								<div><span className="largeScreenValue">{this.state.pv_all_power || 0}</span> KW</div>
							</div>
						</BorderBox9>
					</div>
				</div>
				<div className={styles.baseMessageRow1}>
					<div className={styles.baseMessageRow1Item}>
						<BorderBox9 style={{ width: '12vw' }}>
							<div className={styles.baseMessageRow1ItemBody}>
								<div><Trans>chunengedingdianliang</Trans></div>
								<div><span className="largeScreenValue">{this.state.battery_capacity || 0}</span> AH</div>
							</div>
						</BorderBox9>
					</div>
					<div className={styles.baseMessageRow1Item} >
						<BorderBox9 style={{ width: '12vw' }}>
							<div className={styles.baseMessageRow1ItemBody}>
								<div><Trans>chongdianzhuangzonggonglv</Trans></div>
								<div> <span className="largeScreenValue">{this.state.power_kw || 0}</span> KW</div>
							</div>
						</BorderBox9>
					</div>
				</div>

			</div>
		</div>
	}

	rendererLeftContent2 = () => {
		const { systemData } = this.state
		return <div className={styles.content2Body}>
			<div className={styles.header}><span><img src={biaoti} /><Trans>xitongyunxingshujv</Trans></span>

				<Radio.Group value={this.state.systemDataType} onChange={(e) => {
					this.setState({ systemDataType: e.target.value }, () => {
						this.getSystemData()
					})
				}}>
					<Radio.Button value="date"><Trans>ri</Trans></Radio.Button>
					<Radio.Button value="month"><Trans>yue</Trans></Radio.Button>
					<Radio.Button value="year"><Trans>nian</Trans></Radio.Button>
					<Radio.Button value="all"><Trans>leiji</Trans></Radio.Button>
				</Radio.Group>
			</div>
			<div className={styles.systemDataBody}>
				<div className={styles.systemDataBodyRow}>
					<div className={styles.content2item}>

						<div className={styles.content2itemImage}><img src={shidian} /></div>
						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>shidianchongdianliang</Trans></div>
							<div><span className="largeScreenValue">{systemData.shi_dian_dang_tian_chong_dian_liang || 0}</span> AH</div>
						</div>
					</div>
					<div className={styles.content2item}>

						<div className={styles.content2itemImage}>	<img src={guangfu} /></div>
						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>guangfufadianliang</Trans></div>
							<div><span className="largeScreenValue">{systemData.dang_tian_pv_fa_dian_liang || 0}</span> kWh</div>
						</div>
					</div>

				</div>
				<div className={styles.systemDataBodyRow}>

					<div className={styles.content2item}>

						<div className={styles.content2itemImage}>	<img src={fangdian} /></div>
						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>chunengfangdianliang</Trans></div>
							<div><span className="largeScreenValue">{systemData.dian_chi_dang_tian_fang_dian_an_shi || 0}</span> AH</div>
						</div>
					</div>
					<div className={styles.content2item}>

						<div className={styles.content2itemImage}>	<img src={chongdianzhuang} /></div>
						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>chongdianzhuangyongdianliang</Trans></div>
							<div><span className="largeScreenValue">{systemData.energy_active_import_register || 0}</span> kWh</div>
						</div>
					</div>
				</div>
				<div className={styles.systemDataBodyRow}>

					<div className={styles.content2item}>
						<div className={styles.content2itemImage}>		<img src={qita} /></div>

						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>qitafuzaiyongdian</Trans></div>
							<div><span className="largeScreenValue">{systemData.fu_zai_dang_tian_yong_dian_liang || 0}</span> kWh</div>
						</div>
					</div>
					<div className={styles.content2item}>

						<div className={styles.content2itemImage}>	<img src={chongdian} /></div>
						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>chunengchongdianliang</Trans></div>
							<div><span className="largeScreenValue">{systemData.dian_chi_dang_tian_chong_dian_an_shi
								|| 0}</span> AH</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	}

	rendererLeftContent3 = () => {
		return <div className={styles.content3Body}>
			<div className={styles.header}><span><img src={biaoti} /><Trans>shishigonglv</Trans></span></div>
			<div className={styles.body} id="leftChart1"></div>
		</div>
	}


	render() {
		return (
			<div className={styles.left_block}>
				{this.renderLeftChangeStation()}
				{this.rendererLeftContent1()}
				{this.rendererLeftContent2()}
				{this.rendererLeftContent3()}
			</div>
		);
	}
}

export default withTranslation()(Left);
