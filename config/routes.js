

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user',
				routes: [
					{
						name: 'login',
						path: '/user/login',

						component: './user/Login'
					},


				]
			},
			{
				component: './404'
			}
		]
	},

	{
		path: '/Personal',
		name: 'gerenzhongxin',
		layout: false,
		hideInMenu: true,
		component: './PersonalManage/Personal'

	},
	{
		path: '/Fixpassword',
		name: 'xiugaimima',
		layout: false,
		hideInMenu: true,
		footerRender: false,
		component: './Fixpassword/Fixpassword'
	},


	{
		path: '/home',
		name: 'shouye',
		icon: 'bank',
		access: 'normalRouteFilter',
		component: './home/home',
	},

	{
		path: '/client',
		name: 'kehu',
		icon: 'user',
		access: 'normalRouteFilter',
		component: './client/client',
	},

	{
		path: '/data-grid',
		footerRender: false,
		access: 'normalRouteFilter',
		headerRender: false,
		layout: 'top',
		icon: 'bars',
		name: 'dianzhankanban',
		// hideInMenu: true,
		component: './LargeScreen/LargeScreen'
	},

	{
		path: '/powerStation',
		name: 'dianzhan',
		icon: 'number',
		access: 'normalRouteFilter',
		component: './PowerStation/powerStation',
	},

	{
		path: '/powerStationDetail',
		name: 'dianzhanxiangqing',
		icon: '',
		hideInMenu: true,
		access: 'normalRouteFilter',
		component: './PowerStation/powerStationDetail',
	},

	{
		path: '/equipment',
		name: 'shebei',
		icon: 'apartment',
		access: 'normalRouteFilter',
		component: './equipment/equipment',
	},

	{
		path: '/equipmentType',
		name: 'shebeixinghao',
		icon: 'block',
		access: 'normalRouteFilter',
		component: './equipmentType/equipmentType',
	},


	{
		path: '/UserManage',
		name: 'zhanghaoguanli',
		icon: 'table',
		routes: [
			{
				icon: 'table',
				path: '/UserManage/UserManageList',
				access: 'isUserManageList',
				name: 'zhanghaoguanli',
				access: 'normalRouteFilter',
				component: './UserManage/UserManageList',
			},
			{
				path: '/UserManage/LogList',
				icon: 'table',
				access: 'isLogList',
				name: 'caozuorizhi',
				access: 'normalRouteFilter',
				component: './UserManage/LogList',
			},
			{
				access: 'isRoleManageList',
				path: '/UserManage/RoleManageList',
				name: 'jueseguanli',
				icon: 'table',
				access: 'normalRouteFilter',
				component: './RoleManage/RoleManageList',
			}
		]
	},

]
