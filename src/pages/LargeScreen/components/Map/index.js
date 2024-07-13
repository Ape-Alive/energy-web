import React from 'react';
import styles from './index.less';

const tiandiuMapSDK = '//api.tianditu.gov.cn/api?v=4.0&tk=9b9bda0085a73e201b7ff9bb8e2828bc';

class TMap extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { id, } = this.props;

		return (
			<div id={id} className={styles.container} />
		);
	}
}

export default TMap;
