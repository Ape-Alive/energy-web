import EchartsBtn from '@/components/EchartsBtn'
import getUnit from '@/utils/getUnit'
import { ProCard, StatisticCard } from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { Typography } from 'antd'
import { connect } from 'dva'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import moment from 'moment'
import RcResizeObserver from 'rc-resize-observer'
import React from 'react'
import { history } from 'umi'
import * as XLSX from 'xlsx'
const { Paragraph } = Typography
@connect(({ account, loading }) => ({
	account,
	btnLoading: loading.effects['account/getDetail']
}))
class Overview extends React.Component {
	formRef = React.createRef()
	echartsReact = React.createRef()
	constructor(props) {
		super(props)
		this.state = {
			billingOverview: null, // 计费流量
			duration: 'day',
			flowEchartList: [],
			flowInfo: null,
			bandwidthInfo: null,
			bandwidthEchartList: [],
			keyType: 'flow',
			certInUseCount: 0,
			certWillExpireCount: 0,
			domainActiveCount: 0,
			domainCount: 0,
			showLoading: true
		}
	}

	componentDidMount() {
		const { duration } = this.state

		this.getOverview(duration)
	}

	getOverview = (duration) => {
		const { dispatch } = this.props
		this.setState({
			showLoading: true
		})
		dispatch({
			type: 'billing/overview',
			payload: { duration, interval: '5m' }
		}).then((res) => {
			if (res && res.code === '000000') {
				const overview = res.data
				const flowInfo = (overview && overview.flowData.Summary) || null
				const flowEchartList = (overview && overview.flowData.Item) || []
				const bandwidthInfo =
					(overview && overview.bandwidthData.Summary) || null
				const bandwidthEchartList =
					(overview && overview.bandwidthData.Item) || []
				const certInUseCount = (overview && overview.certInUseCount) || 0
				const certWillExpireCount =
					(overview && overview.certWillExpireCount) || 0

				const domainActiveCount = (overview && overview.domainActiveCount) || 0

				const domainCount = (overview && overview.domainCount) || 0
				const customerFlowList = (overview && overview.customerFlowList) || []
				const customerBandwidthList =
					(overview && overview.customerBandwidthList) ||
					[]

				this.setState({
					flowEchartList,
					flowInfo,
					bandwidthInfo,
					bandwidthEchartList,
					certInUseCount,
					certWillExpireCount,
					domainActiveCount,
					domainCount,
					duration,
					customerFlowList,
					customerBandwidthList
				})
			}
			this.setState({
				showLoading: false
			})
		})
	}
	addDomain = () => {
		history.push({
			pathname: '/DomainManage/DomainList/DomainDetail',
			state: { drawerType: 'create' }
		})
	}
	onChartReady = (chart) => { }
	onChangeDayOrMonthTabs = (duration) => {
		this.getOverview(duration)
	}
	onChangeFlowOrBandwidthTab = (keyType) => {
		this.setState({
			keyType
		})
	}
	downloadFileToExcel = () => {
		const {
			duration,
			bandwidthInfo,
			flowEchartList,
			bandwidthEchartList,
			flowInfo,
			unitNum,
			keyType
		} = this.state

		let From = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
		let To = moment().format('YYYY-MM-DD HH:mm:ss')
		if (duration === 'month') {
			From = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
			To = moment().format('YYYY-MM-DD HH:mm:ss')
		}

		let dataList = [
			['查询开始时间', From],
			['查询结束时间', To],
			['加速区域', '中国大陆'],
			[
				'总流量(GB)',
				(Math.abs(flowInfo.Sum) / (1000 * 1000 * 1000)).toFixed(2)
			],
			[],
			['时间', '流量(byte)']
		]
		flowEchartList.forEach((info) => {
			dataList.push([info.Time, info.Total])
		})

		let name = `流量统计_${moment().format('YYYYMMDDHHmmss')}.xlsx`
		if (keyType === 'bandwidth') {
			name = `带宽统计_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			dataList = [
				['查询开始时间', From],
				['查询结束时间', To],
				[
					'峰值带宽（Mpbs）',
					(Math.abs(bandwidthInfo.Max) / (1000 * 1000)).toFixed(2)
				],

				[],
				['时间', '带宽(bps)']
			]
			bandwidthEchartList.forEach((info) => {
				dataList.push([info.Time, info.Total])
			})
		}
		const workbook = XLSX.utils.book_new() // 工作簿
		const worksheet = XLSX.utils.aoa_to_sheet(dataList) // 数据表

		const cols = [] // 设置每列的宽度
		// wpx 字段表示以像素为单位，wch 字段表示以字符为单位
		for (let i = 0; i <= dataList[0].length; i++) {
			const col = {}
			if (i == 0) {
				col.wch = 30
			} else {
				col.wch = 18
			}
			cols.push(col)
		}
		worksheet['!cols'] = cols // 设置列宽信息到工作表

		// 以下是样式设置，样式设置放在组织完数据之后，xlsx-js-style的核心API就是SheetJS的
		Object.keys(worksheet).forEach((key) => {
			// 非!开头的属性都是单元格
			if (!key.startsWith('!')) {
				worksheet[key].s = {
					font: {
						sz: '12'
					},
					alignment: {
						horizontal: 'left',
						vertical: 'center',
						wrapText: true
					},
					border: {
						top: { style: 'thin' },
						right: { style: 'thin' },
						bottom: { style: 'thin' },
						left: { style: 'thin' }
					}
				}
			}
		})
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
		XLSX.writeFile(workbook, name)
	}
	getOption() {
		const { flowEchartList, bandwidthEchartList, keyType } = this.state
		const list = bandwidthEchartList.map((info) => {
			return info.Total
		})

		let maxNum = Math.max(...list)

		let source = bandwidthEchartList.map((info) => {
			return {
				日期: info.Time,
				带宽: getUnit.bandwidth(info.Total, maxNum).label,
				单位: getUnit.bandwidth(info.Total, maxNum).unit
			}
		})
		let name = `带宽（${getUnit.bandwidth(maxNum, maxNum).unit}）`
		if (keyType === 'flow') {
			const list = flowEchartList.map((info) => {
				return info.Total
			})
			maxNum = Math.max(...list)
			source = flowEchartList.map((info) => {
				return {
					日期: info.Time,
					流量: getUnit.flow(info.Total, maxNum).label,
					单位: getUnit.flow(info.Total, maxNum).unit
				}
			})

			name = `流量（${getUnit.flow(maxNum, maxNum).unit}）`
		}

		const chartOption = {
			grid: {
				left: '70',
				right: '50'
			},

			//   title: {
			//     text: max
			//   },
			tooltip: {
				align: 'center',
				trigger: 'axis',
				position: function (pt) {
					return [pt[0], '10%']
				},

				formatter: (params) => {
					const time = params && params[0] && params[0].value.日期
					if (keyType === 'flow') {
						const value = params && params[0] && params[0].value.流量
						const unit = params && params[0] && params[0].value.单位
						return time + '<br/>' + value + unit
					}
					const value = params && params[0] && params[0].value.带宽
					const unit = params && params[0] && params[0].value.单位
					return time + '<br/>' + value + unit
				}
			},
			dataZoom: [
				{
					type: 'inside'
				}
			],
			dataset: {
				source
			},
			xAxis: {
				type: 'category'
			},
			yAxis: {
				type: 'value',
				name: name,
				splitNumber: 5,
				nameTextStyle: {
					color: '#000',
					nameLocation: 'start'
					//   padding: [0, 0, 0, 35]
				},
				axisLine: {
					show: false,
					minInterval: 1,
					lineStyle: {
						type: 'solid',
						color: '#CCCCCC', // 左边线的颜色
						width: '1' // 坐标线的宽度
					}
				},

				axisTick: false,
				splitLine: {
					// 坐标轴在grid区域中的分隔线（网格中的横线）
					show: true,
					lineStyle: {
						color: ['#CCCCCC'],
						width: 0.7,
						type: 'dashed'
					}
				},
				splitArea: {
					// 坐标轴在grid区域中的分隔区域（间隔显示网格区域）
					interval: 1, // 显示间隔的规律
					show: true,
					areaStyle: {
						// 分隔区域的样式
						color: ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0)']
					}
				},
				axisLabel: {
					textStyle: {
						color: '#5A5A5A' // 坐标值得具体的颜色
					},
					formatter: function (value) {
						return value
					}
				}
			},
			// Declare serveral bar series, each will be mapped
			// to a column of dataset.source by default.
			series: [
				{
					type: 'line',
					symbol: 'none',
					sampling: 'lttb',
					smooth: true,
					itemStyle: {
						color: 'rgb(0, 100, 200)'
					},
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: 'rgba(0, 100, 200, 0.116)'
							},
							{
								offset: 1,
								color: 'rgba(0, 100, 200, 0.116)'
							}
						])
					}
				}
			]
		}
		return chartOption
	}
	topLeftBlock = () => {
		const {
			bandwidthInfo,
			flowInfo,
			showLoading,
			keyType,
			customerFlowList,
			customerBandwidthList,
			duration
		} = this.state
		const flowColumns = [
			{
				title: '客户',
				width: 100,
				dataIndex: 'Customer',
				key: 'Customer'
			},
			{
				title: '流量',
				width: 100,
				dataIndex: 'Value',
				key: 'Value',
				render: (_, record) => {
					return (
						record &&
						record.Value &&
						getUnit.flow(record.Value, record.Value).label +
						getUnit.flow(record.Value, record.Value).unit
					)
				}
			},
			{
				title: '流量占比',
				width: 100,
				dataIndex: 'Value',
				key: 'Value',
				render: (_, record) => {
					return `${record.Value &&
						flowInfo.Sum &&
						((record.Value / flowInfo.Sum) * 100).toFixed(2)
						}%`
				}
			}
		]
		const bandwidthColumns = [
			{
				title: '客户',
				width: 100,
				dataIndex: 'Customer',
				key: 'Customer'
				// render: (_, record) => {
				//   return (
				//     <Paragraph
				//       copyable={{
				//         tooltips: ['复制', '复制成功'],
				//         onCopy: (e) => {
				//           return message.success('复制成功')
				//         }
				//       }}
				//     >
				//       {record.Customer}
				//     </Paragraph>
				//   )
				// }
			},
			{
				title: '峰值带宽',
				width: 100,
				dataIndex: 'Max',
				key: 'Max',
				render: (_, record) => {

					return (
						record &&
						record.Max &&
						getUnit.bandwidth(record.Max, record.Max).label +
						getUnit.bandwidth(record.Max, record.Max).unit
					)
				}
			},
			{
				title: '峰值带宽时间',
				width: 100,
				dataIndex: 'MaxTime',
				key: 'MaxTime'
			}
		]
		return (
			<ProCard split="horizontal" ghost bordered id="overview">
				<ProCard split="horizontal" ghost>
					<ProCard
						split="vertical"
						gutter={8}
						ghost
						tabs={{
							activeKey: keyType,
							onChange: this.onChangeFlowOrBandwidthTab,
							items: [
								{
									label: (
										<StatisticCard
											statistic={{
												title: '总流量',
												value:
													(flowInfo &&
														flowInfo.Sum &&
														getUnit.flow(flowInfo.Sum, flowInfo.Sum).label +
														getUnit.flow(flowInfo.Sum, flowInfo.Sum).unit) ||
													0
											}}
										/>
									),
									key: 'flow',
									children: (
										<div>
											<EchartsBtn
												onReload={() => {
													this.getOverview(duration)
												}}
												onDownload={() => {
													this.downloadFileToExcel()
												}}
											/>
											<ReactEcharts
												ref={(element) => {
													this.echarts_react = element
												}}
												style={{ height: '50vh' }}
												loadingOption={{
													text: '加载中..',
													color: '#0064c8'
												}}
												echarts={echarts}
												showLoading={showLoading}
												option={this.getOption()}
												notMerge={true}
											/>
											<div
												style={{
													borderTop: '1px solid #f0f0f0',
													fontSize: '14px',
													padding: '20px 30px'
												}}
											>
												流量排行
											</div>
											<ProTable
												columns={flowColumns}
												dataSource={customerFlowList}
												rowKey="id"
												options={false}
												pagination={false}
												search={false}
												dateFormatter="string"
												cardBordered={{ table: false }}
											/>
										</div>
									)
								},
								{
									label: (
										<StatisticCard
											statistic={{
												title: '峰值带宽',
												value:
													(bandwidthInfo &&
														getUnit.bandwidth(
															bandwidthInfo.Max,
															bandwidthInfo.Max
														).label +
														getUnit.bandwidth(
															bandwidthInfo.Max,
															bandwidthInfo.Max
														).unit) ||
													0
											}}
										/>
									),
									key: 'bandwidth',

									children: (
										<div>
											<EchartsBtn
												onReload={() => {
													this.getOverview(duration)
												}}
												onDownload={() => {
													this.downloadFileToExcel()
												}}
											/>
											<ReactEcharts
												ref={(element) => {
													this.echarts_react = element
												}}
												style={{ height: '50vh' }}
												loadingOption={{
													text: '加载中..',
													color: '#0064c8'
												}}
												echarts={echarts}
												showLoading={showLoading}
												option={this.getOption()}
												notMerge={true}
											/>
											<div
												style={{
													borderTop: '1px solid #f0f0f0',
													fontSize: '14px',
													padding: '20px 30px'
												}}
											>
												带宽排行
											</div>
											<ProTable
												columns={bandwidthColumns}
												dataSource={customerBandwidthList}
												rowKey="id"
												options={false}
												pagination={false}
												search={false}
												dateFormatter="string"
											/>
										</div>
									)
								}
							]
						}}
					></ProCard>
				</ProCard>
			</ProCard>
		)
	}
	render() {
		const {
			certInUseCount,
			certWillExpireCount,
			domainActiveCount,
			domainCount,
			duration
		} = this.state
		const columns = [
			{
				title: '登录IP',
				width: 100,
				dataIndex: 'name',
				key: 'name',
				fixed: 'left'
			},
			{
				title: '操作',
				width: 100,
				dataIndex: 'name1',
				key: 'name',
				fixed: 'left'
			},
			{
				title: '时间',
				width: 100,
				dataIndex: 'name2',
				key: 'name',
				fixed: 'left'
			}
		]
		return (
			<RcResizeObserver key="resize-observer">
				<ProCard split={'vertical'} gutter={8} ghost>
					<ProCard split="horizontal" gutter={8} ghost bordered>
						<ProCard
							split="horizontal"
							tabs={{
								activeKey: duration,
								type: 'card',
								onChange: this.onChangeDayOrMonthTabs,
								items: [
									{
										forceRender: true,
										label: '今日',
										key: 'day',
										children: this.topLeftBlock()
									},
									{
										forceRender: true,
										label: '本月',
										key: 'month',
										children: this.topLeftBlock()
									}
								]
							}}
						></ProCard>
					</ProCard>
					<ProCard split="horizontal" colSpan="25%" gutter={8} ghost bordered>
						<ProCard
							split="horizontal"
							title="域名详情"
							bordered
							gutter={8}
							style={{ marginBottom: '10px' }}
							headerBordered
						>
							<div
								style={{ padding: '15px 30px', borderTop: '1px solid #f0f0f0' }}
							>
								<div
									style={{
										display: 'flex',
										width: '100%',
										justifyContent: 'space-between',
										fontSize: '14px',
										paddingBottom: '15px'
									}}
								>
									<div>域名数量</div>
									<div style={{ fontWeight: 700 }}>{domainCount}</div>
								</div>
								<div
									style={{
										display: 'flex',
										width: '100%',
										justifyContent: 'space-between',
										fontSize: '14px'
									}}
								>
									<div>活跃域名</div>
									<div style={{ fontWeight: 700 }}>{domainActiveCount}</div>
								</div>
							</div>
						</ProCard>
						<ProCard
							split="vertical"
							title="SSL证书"
							bordered
							gutter={8}
							style={{ marginBottom: '10px' }}
							headerBordered
						>
							<div
								style={{ padding: '15px 30px', borderTop: '1px solid #f0f0f0' }}
							>
								<div
									style={{
										display: 'flex',
										width: '100%',
										justifyContent: 'space-between',
										fontSize: '14px',
										paddingBottom: '15px'
									}}
								>
									<div>已部署CDN证书</div>
									<div style={{ fontWeight: 700 }}>{certInUseCount}</div>
								</div>
								<div
									style={{
										display: 'flex',
										width: '100%',
										justifyContent: 'space-between',
										fontSize: '14px'
									}}
								>
									<div>即将过期证书</div>
									<div style={{ fontWeight: 700 }}>{certWillExpireCount}</div>
								</div>
							</div>
						</ProCard>
					</ProCard>
				</ProCard>
			</RcResizeObserver>
		)
	}
}

export default Overview
