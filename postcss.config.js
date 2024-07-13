module.exports = {
	plugins: {
		'autoprefixer': {
			browsers: ['Android >= 4.0', 'iOS >= 7']
		},
		'postcss-pxtorem': {
			rootValue: 13.75, // 设计稿宽度/100，即分成多少份
			unitPrecision: 5, // 小数精度
			propList: ['*']
		}
	}
}
