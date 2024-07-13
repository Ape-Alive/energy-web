const getUnit = {
	flow: (value, maxNum, num) => {
		const _num = num || 1000
		if (
			Math.abs(maxNum) / (_num * _num * _num * _num * _num * _num * _num) >
			1
		) {
			return {
				label: (
					Math.abs(value) /
					(_num * _num * _num * _num * _num * _num * _num)
				).toFixed(2),
				unit: ' ZB'
			}
		} else if (
			Math.abs(maxNum) / (_num * _num * _num * _num * _num * _num) >
			1
		) {
			return {
				label: (
					Math.abs(value) /
					(_num * _num * _num * _num * _num * _num)
				).toFixed(2),
				unit: ' EB'
			}
		} else if (Math.abs(maxNum) / (_num * _num * _num * _num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num * _num * _num * _num)).toFixed(
					2
				),
				unit: 'PB'
			}
		} else if (Math.abs(maxNum) / (_num * _num * _num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num * _num * _num)).toFixed(2),
				unit: ' TB'
			}
		} else if (Math.abs(maxNum) / (_num * _num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num * _num)).toFixed(2),
				unit: ' GB'
			}
		} else if (Math.abs(maxNum) / (_num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num)).toFixed(2),
				unit: ' MB'
			}
		} else if (Math.abs(maxNum) / _num > 1) {
			return { label: (Math.abs(value) / _num).toFixed(2), unit: ' KB' }
		} else if (Math.abs(maxNum) > 1) {
			return { label: Math.abs(value).toFixed(2), unit: ' B' }
		} else {
			return {
				label: 0,
				unit: ''
			}
		}
	},
	bandwidth: (value, maxNum, num) => {
		const _num = num || 1000
		if (
			Math.abs(maxNum) / (_num * _num * _num * _num * _num * _num * _num) >
			1
		) {
			return {
				label: (
					Math.abs(value) /
					(_num * _num * _num * _num * _num * _num * _num)
				).toFixed(2),
				unit: ' Zbps'
			}
		} else if (
			Math.abs(maxNum) / (_num * _num * _num * _num * _num * _num) >
			1
		) {
			return {
				label: (
					Math.abs(value) /
					(_num * _num * _num * _num * _num * _num)
				).toFixed(2),
				unit: ' Ebps'
			}
		} else if (Math.abs(maxNum) / (_num * _num * _num * _num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num * _num * _num * _num)).toFixed(
					2
				),
				unit: ' Pbps'
			}
		} else if (Math.abs(maxNum) / (_num * _num * _num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num * _num * _num)).toFixed(2),
				unit: ' Tbps'
			}
		} else if (Math.abs(maxNum) / (_num * _num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num * _num)).toFixed(2),
				unit: ' Gbps'
			}
		} else if (Math.abs(maxNum) / (_num * _num) > 1) {
			return {
				label: (Math.abs(value) / (_num * _num)).toFixed(2),
				unit: ' Mbps'
			}
		} else if (Math.abs(maxNum) / _num > 1) {
			return {
				label: (Math.abs(value) / _num).toFixed(2),
				unit: ' Kbps'
			}
		} else if (Math.abs(maxNum) > 1) {
			return {
				label: Math.abs(value).toFixed(2),
				unit: ' bps'
			}
		} else {
			return {
				label: Math.abs(value).toFixed(2),
				unit: ' bps'
			}
		}
	},
	thousandAndDecimal: (num) => {
		if (num) {
			return parseFloat(num)
				.toFixed(2)
				.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
		} else {
			return '0.00'
		}
	}
}
export default getUnit
