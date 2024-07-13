import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Button, Form, Input, message } from 'antd'
import { connect } from 'dva'
import React from 'react'
import { history } from 'umi'
import style from './Personal.less'
import { apiBase } from '@/services/api'
import { useTranslation, Trans } from 'react-i18next'
const actionRef = React.createRef()
@connect(({ account, loading }) => ({
	account,
	btnLoading: loading.effects['account/getDetail']
}))
class Personal extends React.Component {
	formRef = React.createRef()

	constructor(props) {
		super(props)
		this.state = {
			proType: '1',

			sKVisible: '',
			secretKey: '*******************',

			email: '',
			oplogList: [],
			isShowPwdModal: false,
			isShowChangePhoneModal: false,
			isShowEmailModal: false,
			name: '',
			officialWebsite: '',
			company: '',
			address: '',
			companyInfo: null,
			phone: '',
			keyType: '1',
			pageSize: 10,
			userInfo: {},
		}
	}

	componentDidMount() {


		this.getUserInfo()
	}

	getUserInfo = async () => {
		const userId = localStorage.getItem('userId')
		const { data } = await apiBase({ apiMethod: 'getUserInfo', userId })
		this.setState({
			userInfo: data
		})

		this.formRef && this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
	}

	getOplogList = (params) => {

	}





	updateCompanyInfo = async (values) => {
		const { code, msg } = await apiBase({
			...this.state.userInfo,
			...values,
			apiMethod: 'updateUser'
		})
		if (code !== '000000') {
			message.error(msg)
			return
		}
		message.success(msg)
		this.getUserInfo()
	}

	onTabChange = (keyType) => {
		// this.setState({
		// 	keyType
		// })
		// actionRef.current.reload()
	}


	personalBase = () => {
		const { userInfo } = this.state
		return (
			<Form ref={this.formRef} onFinish={this.updateCompanyInfo} initialValues={userInfo} className={style.proCardBlock} >
				<div className={style.topBlock}>
					<Form.Item className={style.baseBlock} name="userName" colon={false} label={<div className={style.baseName}><Trans>yonghuming_youxiang</Trans></div>}>
						<Input className={style.baseInput} disabled style={{ border: "none", background: '#fff', color: '#000', marginLeft: -10 }} />
					</Form.Item>
					<Form.Item className={style.baseBlock} name="roleName" colon={false} label={<div className={style.baseName}><Trans>juese</Trans></div>}>
						<Input className={style.baseInput} disabled style={{ border: "none", background: '#fff', color: '#000', marginLeft: -10 }} />
					</Form.Item>
					<Form.Item className={style.baseBlock} name="firstName" colon={false} label={<div className={style.baseName}><Trans>xing</Trans></div>}>
						<Input className={style.baseInput} />
					</Form.Item>
					<Form.Item className={style.baseBlock} name="lastName" colon={false} label={<div className={style.baseName}><Trans>ming</Trans></div>}>
						<Input className={style.baseInput} />
					</Form.Item>

					<Form.Item className={style.baseBlock} rules={[

						{
							pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
							message: <Trans>youxianggeshicuowu</Trans>
						}
					]} name="email" colon={false} label={<div className={style.baseName}><Trans>email_</Trans></div>}>
						<Input className={style.baseInput} />
					</Form.Item>
				</div>

				<div className={style.save}>
					<Button type="primary" htmlType="submit">
						<Trans>baocun</Trans>
					</Button>
				</div>
			</Form>
		);
	}

	operationLog = () => {
		const { pageSize } = this.state
		const columns = [
			{
				title: '登录IP',
				width: 100,
				dataIndex: 'ip',
				key: 'ip',
				fixed: 'left'
			},
			{
				title: '操作',
				width: 100,
				dataIndex: 'action',
				key: 'action',
				fixed: 'left'
			},
			{
				title: '时间',
				width: 100,
				dataIndex: 'updated_at',
				key: 'updated_at',
				fixed: 'left'
			}
		]
		return (
			<div className={style.proCardBlock}>
				<div className={style.operationLogTitle}>
					操作日志记录了您在本账号中进行的所有操作。防止异常操作的出现，便于您的核查。
				</div>
				<div className={style.proTable}>
					<ProTable
						actionRef={actionRef}
						columns={columns}
						request={(params) => {
							return this.getOplogList(params)
						}}
						editable={{
							type: 'multiple'
						}}
						search={false}
						rowKey="id"
						form={{}}
						pagination={{
							pageSize: pageSize || 10,
							showSizeChanger: true
						}}
						toolBarRender={false}
						dateFormatter="string"
					/>
				</div>
			</div>
		)
	}
	render() {
		const {
			keyType
		} = this.state

		return (
			<div className={style.block}>
				<PageContainer
					fixedHeader
					header={{
						title: <Trans>zhanghaozhongxin</Trans>,
						extra: [
							<Button
								key="1"
								type="primary"
								onClick={() => {
									history.goBack()
								}}
							>
								<Trans>fanhui</Trans>
							</Button>
						]
					}}
					tabActiveKey={keyType}
					onTabChange={this.onTabChange}
					tabList={[
						{
							tab: <Trans>jichuxinxi</Trans>,
							key: '1',
							children: this.personalBase(),
							forceRender: true
						},

						// {
						// 	tab: <Trans>caozuorizhi</Trans>,
						// 	key: '4',
						// 	children: this.operationLog(),
						// 	forceRender: true
						// }
					]}
				></PageContainer>

			</div>
		)
	}
}

export default Personal
