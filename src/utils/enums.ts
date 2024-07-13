// 枚举类转换成所有可枚举属性的字符串数组(data:枚举对象,valueName:属性值名称，textName:属性名称),用作下拉框显示

const enumsHelp = {
	getEnumList: (list: [], key: "") => {
		let enumsList = [];
		list.forEach((info) => {
			if (info.key === key) {
				enumsList = info.value.list;
			}
		});
		return enumsList;
	},
	getValue: (
		enumList: [],
		searchKey: string,
		searchValue: any,
		resultKey: string
	) => {
		const item = this.searchItem(enumList, searchKey, searchValue);
		return item[resultKey];
	},

	searchItem: (enumList: [], searchKey: string, searchValue: any) => {
		let selectItem = null;
		enumList.some((item) => {
			if (item[searchKey] !== searchValue) {
				return false;
			}
			selectItem = item;
			return true;
		});
		return selectItem;
	},

	listToMap: (enumList: [], itemKey: string) => {
		const map = {};
		enumList.forEach((item) => {
			map[item[itemKey]] = item;
		});
		return map;
	},
	getTree: (data: []) => {
		const obj = {}
		data.forEach((item) => {
			obj[item.id || item.key] = item

		})
		// * obj -> {1001: {id: 1001, parent_id: 0, name: 'AA'}, 1002: {...}}
		// console.log(obj, "obj")
		const parentList = []
		data.forEach((item) => {
			const parent = obj[item.parent_id || item.parent_key]
			if (parent) {
				// * 当前项有父节点
				parent.children = parent.children || []
				parent.children.push(item)
			} else {
				// * 当前项没有父节点 -> 顶层
				parentList.push(item)
			}
		})
		return parentList
	},
	createEnumFromList: (list: []) => {
		const enumObject = {};
		list?.forEach((item) => {
			enumObject[item.value] = { text: item.label ?? 'null' };
		});
		return enumObject;
	}

};
export default enumsHelp;
