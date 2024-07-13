import { BorderBox12, BorderBox13 } from "@jiaminghi/data-view-react";
import { connect } from "dva";
import { PureComponent } from "react";
import * as echarts from 'echarts'
import { Radio, DatePicker } from 'antd'
import { apiCharger, apiDashboard, apiInverter } from "@/services/api";
import { Trans, withTranslation } from 'react-i18next';
import { BorderBox9, BorderBox10 } from '@jiaminghi/data-view-react'
import styles from "./Right.less";
import moment from "moment";
import { t } from "i18next";
import biaoti from '@/assets/biaoti.png'


const { RangePicker } = DatePicker;
let timeId = ''
@connect(({ }) => ({}))
class Right extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			jingjizhanbiType: 'all',
			zixitongshujvType: 'all',
			rangeTime: [moment(moment().format('YYYY-01-01')), moment()],
			powerData: [],
			power_kw: 0,
			times: 0,
			count: 0,
			times1: 0,
			chogndianzhaungshouyi: 0,
			chogndianzhaungchogndianliang: 0,
			chongdianzhuangliyonglv: 0,
		};
	}


	componentDidMount() {

	}

	componentWillUnmount() {

	}



	getPowerData = async () => {
		const { data } = await apiCharger({ apiMethod: 'ocppChargeReal' })
		if (!data) {
			return
		}

		const array = [...this.state.powerData, data]
		this.setState({ powerData: array })

	}


	bubbleSort = (array) => {
		const len = array.length
		if (len < 2) return array
		for (let i = 0; i < len; i++) {
			for (let j = 0; j < i; j++) {
				if (array[j] > array[i]) {
					const temp = array[j]
					array[j] = array[i]
					array[i] = temp
				}
			}
		}
		return array

	}

	getOcppAllPower = async () => {
		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}
		const { data = {} } = await apiCharger({ apiMethod: "ocppAllPower", stationId: value.id })
		this.setState({ power_kw: data.power_kw })
	}


	getCountAndChargerTimes = async () => {
		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}
		const { data = {} } = await apiCharger({ apiMethod: "getCountAndChargerTimes", stationId: value.id })

		this.setState({ times: data.times, count: data.count, charging: data.charging })
	}

	initRight1 = async () => {
		const { t } = this.props
		const { jingjizhanbiType } = this.state
		const params = {}

		if (jingjizhanbiType === 'year') {
			const year = moment().format('YYYY')
			params.year = year
		}

		if (jingjizhanbiType === 'month') {
			const month = moment().format('YYYY-MM')
			params.month = month
		}

		if (jingjizhanbiType === 'date') {
			const date = moment().format('YYYY-MM-DD')
			params.date = date
		}

		if (jingjizhanbiType === 'all') {

		}

		const value = this.props.stationListNochild[this.props.indexStation] || {}
		const price = Number(value.income_per_kWh || 1)


		if (!value.id) {
			return
		}
		const { data = {} } = await apiDashboard({ apiMethod: "sysRunStat", stationId: value.id, ...params })

		const guangfu = Number(data.dang_tian_pv_fa_dian_liang) * price
		const chuneng = ((Number(data.dian_chi_dang_tian_chong_dian_an_shi) / 1000) * 48 * price).toFixed(5)
		const chongdianzhuang = (Number(data.energy_active_import_register) * price).toFixed(5)

		const myChart = echarts.init(document.getElementById('right1'))
		const size = window.innerWidth / 100
		const option = {

			tooltip: {
				trigger: 'item'
			},

			grid: {
				left: '5%',
				right: '40px',
				bottom: '10px',
				top: '40px',
				containLabel: true
			},

			color: ['#ecdda6', '#79b7e8', '#92e9f0'],

			series: [
				{
					name: 'Access From',
					type: 'pie',
					radius: ['45%', '70%'],
					itemStyle: {
						borderRadius: 10,
					},
					data: [
						{ value: guangfu, name: t('gaungfushouyi') },
						{ value: chuneng, name: t('chunengshouyi') },
						{ value: chongdianzhuang, name: t('chongdianzhuangshouyi') },

					],
					label: {
						normal: {
							textStyle: {
								fontSize: size * 0.7 // 设置文字大小
							},
							formatter: function (params) {
								// 若需要在文字下面显示数值和占比
								return `${params.name}\n${params.value} (${params.percent}%)`;
							}
						}
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};
		myChart.clear()
		myChart.setOption(option)
	}


	initRight3 = async () => {

		const rangeTime = this.state.rangeTime || []

		const startDate = rangeTime[0] ? moment(rangeTime[0]).format('YYYY-MM-DD') : ''
		const endDate = rangeTime[1] ? moment(rangeTime[1]).format('YYYY-MM-DD') : ''

		const { data = [] } = await apiCharger({ apiMethod: 'ocppStatUseEnergy', startDate, endDate })

		const xAxis = []
		const yAxis = []

		data.forEach(({ time_, count_ }) => {
			xAxis.push(time_)
			yAxis.push(count_)
		});

		const myChart = echarts.init(document.getElementById('right3'))
		const option = {
			grid: {
				left: '5%',
				right: '40px',
				bottom: '10px',
				top: '40px',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6a7985'
					}
				},
				formatter: function (params) {
					return params[0].marker + "  " + params[0].seriesName + ' : ' + params[0].value + '  kWh'
				}
			},
			color: ['#76f0fb'],
			legend: { textStyle: { color: "#fff" } },
			xAxis: {
				type: 'category',
				data: xAxis,
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
			yAxis: {
				type: 'value',
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
					data: yAxis,
					name: t('chongdianzhuangchongdianliang1'),
					type: 'bar'
				}
			]
		};
		myChart.clear()
		myChart.setOption(option)
	}

	getZixitong = async () => {
		const { t } = this.props
		const { zixitongshujvType } = this.state
		const params = {}

		if (zixitongshujvType === 'year') {
			const year = moment().format('YYYY')
			params.year = year
		}

		if (zixitongshujvType === 'month') {
			const month = moment().format('YYYY-MM')
			params.month = month
		}

		if (zixitongshujvType === 'date') {
			const date = moment().format('YYYY-MM-DD')
			params.date = date
		}

		if (zixitongshujvType === 'all') {

		}

		const value = this.props.stationListNochild[this.props.indexStation] || {}

		const price = Number(value.income_per_kWh || 1)
		if (!value.id) {
			return
		}

		const result = await apiCharger({ apiMethod: "getCountAndChargerTimes", stationId: value.id, ...params }) || {}
		const { data = {} } = await apiDashboard({ apiMethod: "sysRunStat", stationId: value.id, ...params })

		const result1 = await apiCharger({ apiMethod: "getPowerUsagePrec", stationId: value.id, ...params }) || {}

		const chongdianzhuang = Number(data.energy_active_import_register) * price

		this.setState({ times1: result.data.times, chogndianzhaungshouyi: chongdianzhuang, chogndianzhaungchogndianliang: data.energy_active_import_register, chongdianzhuangliyonglv: result1.data })
	}


	renderRightItem1 = () => {
		return <div className={styles.rightItem1}>
			<div className={styles.header}><span><img src={biaoti} /><Trans>jingjizhanbi</Trans></span>
				<Radio.Group style={{ zIndex: 9999999 }} value={this.state.jingjizhanbiType} onChange={(e) => {
					this.setState({ jingjizhanbiType: e.target.value }, () => {
						this.initRight1()
					})
				}}>
					<Radio.Button value="date"><Trans>ri</Trans></Radio.Button>
					<Radio.Button value="month"><Trans>yue</Trans></Radio.Button>
					<Radio.Button value="year"><Trans>nian</Trans></Radio.Button>
					<Radio.Button value="all"><Trans>leiji</Trans></Radio.Button>
				</Radio.Group>
			</div>
			<div className={styles.body} id="right1"></div>
		</div>
	}


	renderRightItem2 = () => {
		return <div className={styles.rightItem2}>
			<div className={styles.header}><span><img src={biaoti} /><Trans>zixitongyunxingshujv</Trans></span></div>
			<div className={styles.body}>
				<div className={styles.right2Item1}>
					<BorderBox9 style={{ width: '12vw' }}>
						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>chongdianzhuangshishigonglv</Trans>KW</div>
							<div><span className="largeScreenValue">{this.state.power_kw || 0}</span></div>
						</div>
					</BorderBox9>
					<BorderBox9 style={{ width: '12vw' }}>
						<div className={styles.systemDataBodyRowItem}>
							<div><Trans>chongdianqiangshiyong/zongshu</Trans></div>
							<div><span className="largeScreenValue">{this.state.charging || 0} / {this.state.count || 0}</span></div>
						</div>
					</BorderBox9>
				</div>
				<div className={styles.right2Item2}>
					<Radio.Group value={this.state.zixitongshujvType} onChange={(e) => {
						this.setState({ zixitongshujvType: e.target.value }, () => {
							this.getZixitong()
						})
					}}>
						<Radio.Button value="date"><Trans>ri</Trans></Radio.Button>
						<Radio.Button value="month"><Trans>yue</Trans></Radio.Button>
						<Radio.Button value="year"><Trans>nian</Trans></Radio.Button>
						<Radio.Button value="all"><Trans>leiji</Trans></Radio.Button>
					</Radio.Group>
				</div>
				<div className={styles.right2Item3}>
					<div className={styles.systemDataBodyRow}>
						<BorderBox10 style={{ flex: 1, height: 60 }}>
							<div className={styles.systemDataBodyRowItem}>
								<div><Trans>chongdianzhuangshouyi</Trans></div>
								<div><span className="largeScreenValue">{this.state.chogndianzhaungshouyi || 0}</span></div>
							</div>
						</BorderBox10>
						<BorderBox10 style={{ flex: 1, height: 60, marginLeft: 20 }}>
							<div className={styles.systemDataBodyRowItem}>
								<div><Trans>chongdianzhuangchongdianliang</Trans></div>
								<div><span className="largeScreenValue">{this.state.chogndianzhaungchogndianliang || 0}</span> kWh</div>
							</div>
						</BorderBox10>

					</div>
					<div className={styles.systemDataBodyRow} style={{ marginTop: 20 }}>
						<BorderBox10 style={{ flex: 1, height: 60 }}>
							<div className={styles.systemDataBodyRowItem}>
								<div><Trans>chongdianzhuangliyonglv</Trans></div>
								<div><span className="largeScreenValue">{this.state.chongdianzhuangliyonglv || 0}</span></div>
							</div>
						</BorderBox10>
						<BorderBox10 style={{ flex: 1, height: 60, marginLeft: 20 }}>
							<div className={styles.systemDataBodyRowItem}>
								<div><Trans>chongdianzhuangshisyongcishu</Trans></div>
								<div><span className="largeScreenValue">{this.state.times1 || 0}</span></div>
							</div>
						</BorderBox10>

					</div>
				</div>
			</div>
		</div>
	}


	renderRightItem3 = () => {
		return <div className={styles.rightItem3}>
			<div className={styles.header}><span><img src={biaoti} /><Trans>chongdianzhuangchongdian</Trans></span><RangePicker value={this.state.rangeTime} onChange={e => {
				this.setState({ rangeTime: e }, () => {
					this.initRight3()
				})
			}} /></div>
			<div className={styles.body} id="right3"></div>
		</div>
	}

	componentDidUpdate(prevProps) {
		if (prevProps.indexStation !== this.props.indexStation) {
			this.initRight1()
			this.getOcppAllPower()
			this.getCountAndChargerTimes()
			this.getZixitong()
			this.initRight3()
		}

	}


	render() {
		return <div className={styles.right_block}>
			{this.renderRightItem1()}
			{this.renderRightItem2()}
			{this.renderRightItem3()}
		</div>;
	}
}

export default withTranslation()(Right);
