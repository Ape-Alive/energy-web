export default {
	base: '/',
	dev: {
    '/v2/api': {
			target:'http://tb.intlep.com:8080/',
			changeOrigin: true,
			pathRewrite: { '^/v2/api': '/api' },
		},
		'/api': {
			target:'http://60.204.170.245:9990/',
			changeOrigin: true,
			// pathRewrite: { '^/api': '' },
		}
	}
}
