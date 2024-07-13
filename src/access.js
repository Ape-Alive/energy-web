


export default function access(initialState) {
	const { menuList = [], currentUser = {} } = initialState || {}

	const menu = menuList.map(info => info.path)


	return {
		normalRouteFilter: (route) => {
			return menu.includes(route.path) || currentUser.roleId === '1'
		},
	}
}
