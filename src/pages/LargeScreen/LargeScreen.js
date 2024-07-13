import { apiStation } from '@/services/api'
import { connect } from 'dva'
import { PureComponent } from 'react'
import styles from './LargeScreen.less'
import './LargeScreen1.less'
import CenterPage from './components/CenterPage/Center'
import LeftPage from './components/LeftPage/Left'
import RightPage from './components/RightPage/Right'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import TopPage from './components/TopPage/Top'
import { message, ConfigProvider } from 'antd'
@connect(({ common }) => ({ common }))
class Home extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			projectStatisticsList: [],
			projectId: '',
			productId: '',
			region: '',
			layerId: '',
			stationList: [],
			stationListNochild: [],
			dataInfo: {},
			indexStation: '',
		}
	}
	componentWillUnmount() {
		clearInterval(this.interval)
	}
	componentDidMount() {
		this.getStatBaseData()
		this.getStationList1()
		this.getStationList()

	}



	getStatBaseData = async () => {
		const data = await apiStation({
			apiMethod: 'stat_base'
		})
		if (data?.code !== '000000') {

			message.error(data?.msg)
			return
		}
		this.setState({
			dataInfo: data.data
		})
	}

	getStationList1 = async () => {
		const data = await apiStation({
			apiMethod: 'list',
			pageNum: 1,
			pageSize: 500,
		})
		if (data?.code !== '000000') {
			message.error(data?.msg)
			return
		}

		this.setState({
			stationListNochild: data.data
		})
		this.setState({ indexStation: 0 })
	}


	getStationList = async () => {
		const data = await apiStation({
			apiMethod: 'list',
		})
		if (data?.code !== '000000') {
			message.error(data?.msg)
			return
		}

		this.setState({
			stationList: data.data
		})
	}
	render() {
		const { common } = this.props
		const { dataInfo, stationList, projectStatisticsList, projectId, statisticTypeData, indexStation, stationListNochild } =
			this.state
		const language = localStorage.getItem('language') || 'en'
		const enumLang = {
			en: enUS,
			zh: zhCN
		}

		return (
			<ConfigProvider locale={enumLang[language]}>	<div className={`${styles.home_block} LargeScreen`}>
				<TopPage
					projectStatisticsList={projectStatisticsList}
					onChangeValue={this.onChangeValue}
					projectId={projectId}
					onChooseUnit={this.onChooseUnit}
					statisticTypeData={statisticTypeData}
					common={common}
					stationList={stationList}
					indexStation={indexStation}
				/>
				<div className={styles.indexPageContent}>
					<LeftPage
						projectStatisticsList={projectStatisticsList}
						projectId={projectId}
						onChooseUnit={this.onChooseUnit}
						dataInfo={dataInfo}
						stationListNochild={stationListNochild}
						stationList={stationList}
						indexStation={indexStation}
						changeIndexStation={(index) => { this.setState({ indexStation: index }) }}
					/>
					{/* 左侧内容 */}
					{/* 中间内容 */}
					<CenterPage
						stationList={stationList}
						indexStation={indexStation}
						stationListNochild={stationListNochild}
						dataInfo={dataInfo}

					/>
					{/* 右侧内容 */}
					<RightPage statisticTypeData={statisticTypeData}
						stationListNochild={stationListNochild}
						indexStation={indexStation}
					/>
				</div>
			</div></ConfigProvider>

		)
	}
}

export default Home
