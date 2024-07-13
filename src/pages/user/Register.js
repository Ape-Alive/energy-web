import loginBg from '@/assets/loginBg.jpeg'
import Footer from '@/components/Footer'
import waitTime from '@/utils/waitTime'
import {
	LockOutlined,
	MailOutlined,
	MobileOutlined,
	UserOutlined
} from '@ant-design/icons'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { Button, message, Result } from 'antd'
import { connect } from 'dva'
import React, { PureComponent } from 'react'
import { history } from 'umi'
import styles from './Register.less'
const signsList = JSON.parse(localStorage.getItem('antd-pro-authority')) || []

@connect(() => ({}))
class Register extends PureComponent {
	formRef = React.createRef()

	state = {
		modalVisible: false,
		drawerType: 'create',
		nodeType: null,
		formData: null,
		nodeList: [],
		nodeTerminateStatusList: [],
		phone: '',
		regCode: '',
		isRegister: true
	}

	componentDidMount() { }
	goBack = () => {
		history.goBack()
	}
	success = () => {
		return (
			<Result
				status="success"
				title="注册成功!"

				extra={[
					<Button type="primary" key="goback" onClick={() => {
						this.setState({
							isRegister: true
						})
					}}>
						继续注册
					</Button>,
					<Button key="buy" onClick={() => {
						window.close()
					}}>关闭页面</Button>,
				]}
			/>
		)
	};
	render() {
		const { isRegister } = this.state
		return (
			isRegister && <div className={styles.container} id="login">
				<div className={styles.block}>
					<div className={styles.imgBlock}>
						<img src={loginBg}></img>
					</div>
					<div className={styles.registerContent}>
						<div className={styles.title}> 注册客户</div>
						<div className={styles.signupBase}>
							<ProForm
								formRef={this.formRef}
								submitter={{
									resetButtonProps: {
										style: {
											// 隐藏重置按钮
											display: 'none'
										}
									},
									submitButtonProps: {
										style: {
											width: '100%',
											padding: '8px 0',
											color: ' #FFF',
											fontSize: '16px',
											fontWeight: '400',
											border: 'none',
											borderRadius: '2px',
											backgroundColor: '#0064c8',
											lineHeight: '20px',
											height: '40px',
											marginBottom: '24px'
										}
									},
									render: (props, doms) => {
										return <div className={styles.button}>{doms}</div>
									}
								}}
								onFinish={async (values) => {
									await waitTime(1000)
									if (values.newPassword !== values.password) {
										message.error('两次输入密码需要一致')
										return false
									}
									const { dispatch } = this.props
									dispatch({
										type: 'user/register',
										payload: {
											...values,
											type: 'register'
										}
									}).then((res) => {
										if (res && res.code === '000000') {
											message.success('成功')
											this.setState({
												isRegister: false
											})
											return
										}
										return true
									})
								}}
							>
								<ProFormText
									fieldProps={{
										size: 'large',
										prefix: <MobileOutlined className={'prefixIcon'} />
									}}
									width='lg'
									name="phone"
									placeholder={'请输入手机号'}
									onChange={(e) => {
										this.setState({
											phone: e.target.value
										})
									}}
									rules={[
										{
											required: true,
											message: '请输入手机号！'
										},
										{
											pattern: /^1\d{10}$/,
											message: '手机号格式错误！'
										}
									]}
								/>
								{/* 	<ProFormCaptcha
									fieldProps={{
										size: 'large',
										prefix: <LockOutlined className={'prefixIcon'} />
									}}
									captchaProps={{
										size: 'large'
									}}
									placeholder={'请输入验证码'}
									captchaTextRender={(timing, count) => {
										if (timing) {
											return `${count} ${'获取验证码'}`
										}
										return '获取验证码'
									}}
									name="regCode"
									rules={[
										{
											required: true,
											message: '请输入验证码！'
										}
									]}
									onGetCaptcha={() => {
										const { dispatch } = this.props
										const { phone } = this.state
										if (!phone) {
											message.error('请输入手机号')
											return
										}

										dispatch({
											type: 'user/sendRegCodeRegister',
											payload: { phone: phone, codeType: 'register' }
										}).then((res) => {
											if (res && res.code === '000000') {
												message.success((res && res.msg) || '验证码获取成功')
												return
											}
											message.error((res && res.msg) || '验证码获取失败')
											return true
										})
									}}
								/> */}

								<ProFormText
									name="company"
									width='lg'
									fieldProps={{
										size: 'large',
										prefix: <UserOutlined className={'prefixIcon'} />
									}}
									placeholder={'请输入企业名称'}
									rules={[
										{
											required: true,
											message: '企业名称不能为空'
										}
									]}
								/>
								<ProFormText
									fieldProps={{
										size: 'large',
										prefix: <MailOutlined className={'prefixIcon'} />
									}}
									width='lg'
									name="email"
									rules={[
										{
											required: true,
											message: '邮箱不能为空'
										}
									]}
									placeholder={'请输入邮箱'}
								/>
								<ProFormText.Password
									name="password"
									width='lg'
									fieldProps={{
										size: 'large',
										prefix: <LockOutlined className={'prefixIcon'} />
									}}
									placeholder={'请输入密码'}
									rules={[
										{
											required: true,
											pattern:
												/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,30}$/,
											message:
												'密码强度正则，最少6位，字母、数字、特殊字符中的任意两种'
										}
									]}
								/>
								<ProFormText.Password
									name="newPassword"
									fieldProps={{
										size: 'large',
										prefix: <LockOutlined className={'prefixIcon'} />
									}}
									width='lg'
									placeholder="确认密码"
									rules={[
										{
											required: true,
											pattern:
												/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,30}$/,
											message:
												'密码强度正则，最少6位，字母、数字、特殊字符中的任意两种'
										}
									]}
								/>
							</ProForm>

						</div>
					</div>
				</div>
				<Footer />
			</div> || this.success()
		)
	}
}
export default Register
