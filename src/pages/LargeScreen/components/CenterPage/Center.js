import NumericalAnimation from '@/components/NumericalAnimation/NumericalAnimation'
import { BorderBox10, BorderBox12 } from '@jiaminghi/data-view-react'
import { connect } from 'dva'
import 'ol/ol.css'
import { PureComponent } from 'react'
import $script from 'scriptjs'
import TMap from '../Map'
import styles from './Center.less'
import { Trans, withTranslation } from 'react-i18next';
import biaoti from '@/assets/biaoti.png'

import { t } from 'i18next'
import { apiCharger, apiDashboard, apiStation } from '@/services/api'
const tiandiuMapSDK =
	'//api.tianditu.gov.cn/api?v=4.0&tk=9b9bda0085a73e201b7ff9bb8e2828bc'

let timeId = ''
@connect(({ search, task }) => ({
	search,
	task
}))
class Center extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			map: null,
			powerData: [],
			jingjixiaoyi: {},
			shehuixiaoyi: {}
		}
	}

	componentWillMount() {
		if (!window.T) {
			$script([tiandiuMapSDK], (a, b) => { })
		}

	}
	componentDidMount(nextProps) {
		const { stationList } = this.props
		this.renderMap(stationList)
		this.getPowerData()
		timeId = setInterval(() => {
			this.getPowerData()
		}, 30 * 1000);



	}

	componentDidUpdate(prevProps) {
		if (prevProps.indexStation !== this.props.indexStation) {
			this.getJingjixiaoyi()
			this.getShehuixiaoyi()
		}

	}
	componentWillReceiveProps(nextProps) {
		if (
			nextProps.stationList !== this.props.stationList
		) {
			this.renderMap(nextProps.stationList)
		}


	}



	componentWillUnmount() {
		timeId && clearInterval(timeId)
	}

	getPowerData = async () => {
		const { data } = await apiCharger({ apiMethod: 'ocppChargeReal' })
		if (!data) {
			return
		}

		const array = [...this.state.powerData, data]
		this.setState({ powerData: array })

	}


	addMarks = (list) => {
		list.forEach((item) => {

			this.addOneMark('/mark/red-marker.png', [item.longitude, item.latitude])
		})
	}
	addOneMark = (pic, position) => {
		const { map } = this.state
		const icon = new window.T.Icon({
			iconUrl: pic,
			iconSize: new window.T.Point(30, 30),
			iconAnchor: new window.T.Point(10, 25)
		})
		// 向地图上添加自定义标注
		const marker = new window.T.Marker(
			new window.T.LngLat(position[0], position[1]),
			{ icon }
		)
		map.addOverLay(marker)
	}

	renderMap = (stationList) => {
		const _this = this


		let sing = '//t0.tianditu.gov.cn/cva_w/wmts?' +
			'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
			'&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9b9bda0085a73e201b7ff9bb8e2828bc'


		function listenerStorage() {
			if (window.T) {
				let { map: AppMap } = _this.state
				if (AppMap === null) {
					// 天地图卫星影像
					const imageURL = '//t0.tianditu.gov.cn/vec_w/wmts?' +
						'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
						'&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9b9bda0085a73e201b7ff9bb8e2828bc'
					const signURL = sing
					const tiandituImg_w = new window.T.TileLayer(imageURL, {
						minZoom: 1,
						maxZoom: 18
					})
					const sign = new window.T.TileLayer(signURL, {
						minZoom: 1,
						maxZoom: 18
					})


					AppMap = new window.T.Map('allmap', { layers: [tiandituImg_w, sign] })
				} else {
					AppMap.clearOverLays()
				}
				// 深圳坐标点

				AppMap.centerAndZoom(new window.T.LngLat(114.0501, 22.5419), 1)
				_this.setState(
					{

						map: AppMap
					},
					() => {
						_this.addMarks(stationList)
					}
				)
			} else {
				setTimeout(() => {
					listenerStorage()
				}, 800)
			}
		}
		listenerStorage()
	}

	renderRow1 = () => {

		const value = this.props.stationListNochild[this.props.indexStation] || {}
		const price = Number(value.income_per_kWh || 1)

		return <div className={styles.row1}>
			<div className={styles.row1Item}>
				<div className={styles.row1ItemHeader}><img src={biaoti} /><Trans>jingjixiaoyi</Trans></div>
				<div className={styles.row1ItemBody}>
					<div style={{ flex: 1 }}>
						<div className={styles.systemDataBodyRowItem}>
							<div><span className={styles.value}>{(this.state.jingjixiaoyi.month || 0) * price}</span> {value.income_currency}</div>
							<div><Trans>dangyuechongdianzhuangyongdianliang</Trans></div>

						</div>
					</div>
					<div className={styles.line}></div>
					<div style={{ flex: 1 }}>
						<div className={styles.systemDataBodyRowItem}>
							<div><span className={styles.value}>{(this.state.jingjixiaoyi.year || 0) * price}</span> {value.income_currency}</div>
							<div><Trans>dangnianchongdianzhuangyongdianliang</Trans></div>

						</div>
					</div>
					<div className={styles.line}></div>
					<div style={{ flex: 1 }}>
						<div className={styles.systemDataBodyRowItem}>
							<div><span className={styles.value}>{(this.state.jingjixiaoyi.total || 0) * price}</span> {value.income_currency}</div>
							<div><Trans>leijichongdianzhuangyongdianliang</Trans></div>

						</div>
					</div>
				</div>
			</div>
			<div className={styles.row1Item}>
				<div className={styles.row1ItemHeader}><img src={biaoti} /><Trans>shehuixiaoyi</Trans></div>
				<div className={styles.row1ItemBody}>
					<div style={{ flex: 1 }}>
						<div className={styles.systemDataBodyRowItem}>
							<div> <span className={styles.value}>{this.state.shehuixiaoyi.dxjym || 0}</span> <Trans>dun</Trans></div>
							<div><Trans>jieyuebiaozhunmei</Trans></div>

						</div>
					</div>
					<div className={styles.line}></div>
					<div style={{ flex: 1 }} >
						<div className={styles.systemDataBodyRowItem}>
							<div> <span className={styles.value}>{this.state.shehuixiaoyi.co2jpl || 0}</span> <Trans>dun</Trans></div>
							<div><Trans>c02jianpailiang</Trans></div>

						</div>
					</div>
					<div className={styles.line}></div>
					<div style={{ flex: 1 }}>
						<div className={styles.systemDataBodyRowItem}>
							<div> <span className={styles.value}>{this.state.shehuixiaoyi.dxzsl || 0}</span> <Trans>ke</Trans></div>
							<div><Trans>dengxiaozhishuliang</Trans></div>

						</div>
					</div>
				</div>
			</div>
		</div>
	}


	renderTable = () => {

		return <div className={styles.tableBody}>
			<BorderBox12 titleWidth={500} className={styles.borderBox12}>
				<div className={styles.right_echart}>
					<div className={styles.right_title_block}><div className={styles.right_title}>
						<svg
							t="1628246262766"
							className={styles.right_icon}
							viewBox="0 0 1024 1024"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							p-id="2057"
							width="17"
							height="17"
						>
							<path
								d="M938.666667 981.333333H85.333333c-25.6 0-42.666667-17.066667-42.666666-42.666666V85.333333c0-25.6 17.066667-42.666667 42.666666-42.666666s42.666667 17.066667 42.666667 42.666666v810.666667h810.666667c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666666z"
								p-id="2058"
								fill="#279fc8"
							/>
							<path
								d="M298.666667 768c-8.533333 0-12.8 0-17.066667-4.266667-21.333333-8.533333-29.866667-34.133333-17.066667-55.466666l170.666667-341.333334c4.266667-12.8 17.066667-21.333333 29.866667-21.333333 12.8-4.266667 25.6 0 38.4 8.533333l170.666666 153.6 187.733334-396.8c8.533333-21.333333 34.133333-29.866667 55.466666-21.333333 21.333333 8.533333 29.866667 34.133333 21.333334 55.466667l-213.333334 448c-4.266667 12.8-17.066667 21.333333-29.866666 25.6-12.8 4.266667-25.6 0-38.4-8.533334l-170.666667-153.6L341.333333 746.666667c-12.8 12.8-25.6 21.333333-42.666666 21.333333z"
								p-id="2059"
								fill="#279fc8"
							/>
						</svg>
						<span style={{ fontSize: '1vw' }}><Trans>chongdianjierushishishujv</Trans></span>
					</div>


					</div>
					<div className={styles.right_body3_row}>
						<div><Trans>shijian1</Trans></div>
						<div><Trans>mingcheng1</Trans></div>
						<div><Trans>zhuangtai1</Trans></div>

					</div>
					<div className={styles.right_body3}>
						{this.state.powerData.map(info => {
							return <div className={styles.right_body3_row}>
								<div>{info.status_timestamp}</div>
								<div>{info.device_name}</div>
								<div>{info.status}</div>

							</div>
						})}
					</div>
				</div>
			</BorderBox12></div>
	}

	getJingjixiaoyi = async () => {
		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}
		const { data = {} } = await apiDashboard({ apiMethod: "getEconomicBenefits", stationId: value.id })

		this.setState({ jingjixiaoyi: data })
	}

	getShehuixiaoyi = async () => {
		const value = this.props.stationListNochild[this.props.indexStation] || {}
		if (!value.id) {
			return
		}
		const { data = {} } = await apiDashboard({ apiMethod: "getSocialBenefit", stationId: value.id })
		this.setState({ shehuixiaoyi: data })
	}




	render() {
		return (
			<div className={styles.center_block}>
				{this.renderRow1()}
				<TMap lng="" lat="" id="allmap" />
				{this.renderTable()}
			</div>
		)
	}
}

export default withTranslation()(Center)






