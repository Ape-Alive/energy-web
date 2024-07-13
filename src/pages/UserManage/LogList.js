import enumsHelp from '@/utils/enums'
import ProTable, {
	IntlProvider,
	enUSIntl,
	zhCNIntl
} from '@ant-design/pro-table'
import { connect } from 'dva'
import moment from 'moment'
import { withTranslation } from 'react-i18next';
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider } from 'antd'
import React, { PureComponent } from 'react'
import { apiBase } from '@/services/api';
@connect(() => ({}))
class logList extends PureComponent {
	formRef = React.createRef()

	state = {

		resourceType: null,
		modalVisible: false,
		pageSize: 10,
		userList: []
	}

	componentDidMount() {
		const { dispatch } = this.props
		dispatch({
			type: 'user/getUserList',
			payload: {
				page: 1,
				pageSize: 99999,

			}
		}).then(res => {
			if (res && res.data) {
				const list = res.data || []
				const userList = list.map((info) => {
					return { value: info.id, label: info.name }
				})
				this.setState({
					userList
				})
			}
		})
	}

	getData = (params) => {
		const { dispatch } = this.props
		this.setState({
			pageSize: params.pageSize
		})
		const { date } = params
		const startAt = date && moment(date[0]).unix()
		const endAt = date && moment(date[1]).endOf('day').unix()
		return dispatch({
			type: 'user/entireOplogList',
			payload: { ...params, page: params.current, pageSize: params.pageSize, startAt, endAt }
		})
	}

	onContent = (record) => {
		this.setState({
			drawerType: 'content',
			modalVisible: true,
			formData: record.content
		})
	}

	onErr = (record) => {
		this.setState({
			drawerType: 'error',
			modalVisible: true,
			formData: record.error
		})
	}

	onCancel = () => {
		this.setState({
			modalVisible: false,
			formData: null
		})
	}

	render() {
		const { pageSize, userList } =
			this.state
		const actionRef = React.createRef()

		const { t } = this.props;

		const userEnum = enumsHelp.createEnumFromList(userList);
		const columns = [
			{
				dataIndex: 'index',
				valueType: 'indexBorder',
				width: 48
			},
			{
				title: t('dengluzhanghao'),
				dataIndex: 'userName',
				valueType: 'userName',

				search: false,

			},
			{
				title: t('dengluIp'),
				dataIndex: 'msg_',
				valueType: 'msg_',
				search: false
			},

			{
				title: t('shijian'),
				dataIndex: 'create_at',
				search: false,
				valueType: 'create_at',
			},

			{
				title: t('caozuo'),
				dataIndex: 'do_type',
				valueType: 'do_type',
				search: false,

			},

		]
		const language = localStorage.getItem('language') || 'en'
		const enumLang = {
			en: enUS,
			zh: zhCN
		}
		const enumTableLang = {
			en: enUSIntl,
			zh: zhCNIntl
		}
		return (
			<ConfigProvider locale={enumLang[language]}>
				<IntlProvider value={enumTableLang[language]}>
					<ProTable
						actionRef={actionRef}
						columns={columns}
						request={async (params = {}) => {
							const { data, page = {} } = await apiBase({
								...params,
								apiMethod: 'getLog',
								pageNum: params.current,
								pageSize: params.pageSize,

							})
							return {
								data: data,
								success: true,
								total: page.totalCount
							}
						}}
						editable={{
							type: 'multiple'
						}}
						rowKey="id"
						form={{}}
						pagination={{
							pageSize: pageSize || 10,
							showSizeChanger: true
						}}
						search={false}
						dateFormatter="string"
						headerTitle={t('rizhiguanli')}
					/>
				</IntlProvider>

			</ConfigProvider>



		)
	}
}
export default withTranslation()(logList)
