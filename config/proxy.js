export default {
	base: '/',
	dev: {
		'/api': {
			target:'http://60.204.170.245:9990/',
			changeOrigin: true,
			// pathRewrite: { '^/api': '' },
		}
	}
}
