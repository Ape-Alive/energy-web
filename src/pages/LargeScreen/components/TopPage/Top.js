import { Decoration10, Decoration8 } from '@jiaminghi/data-view-react'
import { Select } from 'antd'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Trans, withTranslation } from 'react-i18next';
import { PureComponent } from 'react'
import styles from './Top.less'
import moment from 'moment'
@connect(({ }) => ({}))
class Top extends PureComponent {
	timeId = ''
	constructor(props) {
		super(props)
		this.state = {
			indexTime: '',
			indexDate: ''
		}
	}

	// 设置时间
	componentDidMount() {
		this.timeId = setInterval(() => {
			const time = moment().format('HH:mm:ss')
			const indexDate = moment().format('YYYY-MM-DD')
			this.setState({
				indexTime: time,
				indexDate: indexDate
			})
		}, 1000);
	}

	componentWillUnmount() {
		this.timeId && clearInterval(this.timeId)
	}

	renderChooseProject = () => {
		return (
			<div className={styles.top_container}>
				<div className={styles.chooseBlock} id="homeTop">
					{this.state.indexTime}
				</div>

				<div className={styles.chooseBlock1} id="homeTop1">
					{this.state.indexDate}
				</div>

			</div>
		)
	}

	render() {
		const { statisticTypeData, common } = this.props
		const { regionMap } = common
		const code = statisticTypeData?.project?.code
		const regionName = code && regionMap && regionMap[code] && regionMap[code].name
		return (
			<div className={styles.top_block}>
				<div className={styles.top_left_block}>
					<div className={styles.top_icon_block}>
						<Decoration10
							style={{ width: '100%', height: '5px' }}
							color={['#568aea', '#081a3d']}
						/>
						<Decoration8
							style={{ width: '50%', height: '40px' }}
							color={['#568aea', '#081a3d']}
						/>
					</div>
					{this.renderChooseProject()}
				</div>
				<div className={styles.top_title_block}>
					<div className={styles.top_title}>Parasol Elite Power EMS</div>
				</div>
				<div className={styles.top_right_block}>
					<div className={styles.top_icon_block}>
						<Decoration8
							reverse
							style={{ width: '50%', height: '40px' }}
							color={['#568aea', '#081a3d']}
						/>
						<Decoration10
							style={{
								width: '100%',
								height: '5px',
								transform: 'rotateY(180deg)'
							}}
							color={['#568aea', '#081a3d']}
						/>
					</div>
					<Link to="/home">
						<div className={styles.top_right_enter}><Trans>jinruxitong</Trans></div>
					</Link>
				</div>
			</div>
		)
	}
}

export default Top
