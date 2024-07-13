import { useRef, useState } from 'react'
import ProTable, {
	IntlProvider,
	enUSIntl,
	zhCNIntl
} from '@ant-design/pro-table'
import {
	PlusOutlined,
	DeleteFilled,
	ExclamationCircleOutlined,

} from '@ant-design/icons'
import UserDetailModal from './userDetailModal'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'

import { useTranslation } from 'react-i18next'
import { apiBase } from '@/services/api'
import { Button, Tooltip, Modal, message, ConfigProvider } from 'antd'

const { confirm } = Modal
const UserManageList = () => {
	const { t } = useTranslation()
	const actionRef = useRef()
	const [pageSize, setPageSize] = useState(10)
	const [showUserManageDetailModal, setShowUserManageDetailModal] =
		useState(false)

	const [record, setRecord] = useState({})

	const deleteUserManage = (id) => {
		confirm({
			title: t('jinggao'),
			icon: <ExclamationCircleOutlined />,
			content: t('quedingshanchugaizhaohaoma'),
			cancelText: t('qvxiao'),
			okText: t('queding'),
			onOk: async () => {
				const { code, msg } = await apiBase({
					apiMethod: 'deleteUser',
					userId: id
				})
				if (code !== '000000') {
					message.error(msg)
					return
				}
				actionRef.current?.reload()
				message.success(msg)
			},
			onCancel() { }
		})
	}

	const columns = [
		{
			dataIndex: 'index',
			valueType: 'indexBorder',
			width: 48
		},

		{
			title: t('jusemingcheng'),
			key: 'roleName',
			dataIndex: 'roleName',
			hideInSearch: true
		},


		{
			title: t('yonghuming_youxiang'),
			key: 'userName',
			dataIndex: 'userName',
			hideInSearch: true
		},
		{
			title: t('xing'),
			key: 'firstName',
			dataIndex: 'firstName',
			hideInSearch: true
		},
		{
			title: t('ming'),
			key: 'lastName',
			dataIndex: 'lastName',
			hideInSearch: true
		},



		{
			title: t('email_'),
			key: 'email',
			dataIndex: 'email',
			hideInSearch: true
		},

		{
			title: '',
			key: 'opera',
			dataIndex: 'opera',
			hideInSearch: true,
			width: 100,
			render: (_, record) => {
				return (
					<div className="table-opera-body">
						<Tooltip placement="top" title={t('shanchu')} arrow={true}>
							<DeleteFilled
								className='table-icon'
								onClick={(e) => {
									e.stopPropagation()

									deleteUserManage(record.userId)
								}}
							/>
						</Tooltip>
					</div>
				)
			}
		}
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
							apiMethod: 'getUserList',
							pageNum: params.current,
							pageSize: params.pageSize
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
					search={false}
					form={{}}
					pagination={{
						pageSize: pageSize || 10,
						showSizeChanger: true,
						onChange: (_, pageSize) => {
							setPageSize(pageSize)
						}
					}}
					dateFormatter="string"
					headerTitle={t('zhanghaoguanli')}
					onRow={(record, index) => {
						return {
							onClick: (a) => {
								setRecord(record)
								setShowUserManageDetailModal(true)
							}
						}
					}}
					toolBarRender={(e) => {
						return (
							<Button
								key="button"
								icon={<PlusOutlined />}
								type="primary"
								onClick={() => {
									setRecord({})
									setShowUserManageDetailModal(true)
								}}
							>
								{t('xinjian')}
							</Button>
						)
					}}
				/>
				{showUserManageDetailModal && (
					<UserDetailModal
						show={showUserManageDetailModal}
						setShow={setShowUserManageDetailModal}
						actionRef={actionRef}
						record={record}
					/>

				)}
			</IntlProvider>
		</ConfigProvider>


	)
}

export default UserManageList
