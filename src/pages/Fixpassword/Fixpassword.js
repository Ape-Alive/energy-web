import waitTime from '@/utils/waitTime'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, message } from 'antd'
import { connect } from 'dva'
import React from 'react'
import { history } from 'umi'
import { withTranslation } from 'react-i18next';
import style from './Fixpassword.less'
import { apiBase } from '@/services/api'

import MD5 from 'MD5'
import md5 from 'MD5'
@connect(({ account, user, loading }) => ({
	account,
	btnLoading: loading.effects['account/getDetail']
}))
class Fixpassword extends React.Component {
	formRef = React.createRef()

	constructor(props) {
		super(props)
		this.state = {

			isSubmit: false
		}
	}

	componentDidMount() { }

	onSubmit = async () => {
		const { t } = this.props;
		console.log(this.formRef)
		this.formRef.current.validateFields().then(async (values) => {
			if (values.old === values.password) {
				message.error(t('zhanghumimaxiugaishi,buyunxvyudangqianmimayizhi'))
				return false
			}
			if (values.newPassword !== values.password) {
				message.error(t('liangcishurumimaxvyaoyizhi'))
				return false
			}
			this.setState({
				isSubmit: true,
			})


			const { code, msg } = await apiBase({
				oldPwd: md5(values.old),
				newPwd: md5(values.newPassword),
				apiMethod: 'modifyPwd'
			})
			if (code !== '000000') {
				message.error(msg)
				return
			}
			message.success(msg)
			history.push('/user/login')
			this.setState({
				isSubmit: false
			})
			return true
		})

	}

	render() {
		const { t } = this.props;
		return (
			<div className={style.block}>
				<PageContainer
					style={{ background: '#fff' }}
					waterMarkProps={{ content: '' }}
					ghost
					header={{
						title: t('xiugaimima'),
						extra: [
							<Button
								key="1"
								type="primary"
								onClick={() => {
									history.goBack()
								}}
							>
								{t('fanhui')}
							</Button>
						]
					}}


				>
					<div className={style.connect}>
						<ProForm
							formRef={this.formRef}
							submitter={{
								render: () => {
									return [
										<Button key="rest" onClick={() => { this.formRef.current.resetFields() }}>{t('chongzhi')}</Button>,
										<Button key="submit" type="primary" htmlType="button" onClick={this.onSubmit}>
											{t('tijiao')}
										</Button>,
									]
								}
							}}
							onFinish={this.onSubmit}
						>
							<ProFormText.Password
								label={t('jiumima')}
								width="400px"
								name="old"
								placeholder={t('mima')}
								rules={[
									{
										required: true,
										message: t('qingshurujiumima')
									}
								]}
							/>
							<ProFormText.Password
								label={t('xinmima')}
								width="400px"
								name="password"
								placeholder={t('xinmima')}
								rules={[
									{
										required: true,
										pattern:
											/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,30}$/,
										message:
											t('mimaguize')
									}
								]}
							/>
							<ProFormText.Password
								label={t('querenmima')}
								width="400px"
								name="newPassword"
								placeholder={t('querenmima')}
								rules={[
									{
										required: true,
										pattern:
											/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,30}$/,
										message:
											t('mimaguize')
									}
								]}
							/>
						</ProForm>
					</div>
				</PageContainer>
			</div>
		)
	}
}

export default withTranslation()(Fixpassword) 
