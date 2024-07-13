import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { default as React } from 'react'
import styles from './index.less'
class EchartsBtn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { onReload, onDownload } = this.props
    return (
      <div className={styles.btnBlock}>
        <Tooltip placement="top" title={'刷新'} className={styles.btn}>
          <ReloadOutlined onClick={onReload} style={{ fontSize: '16px' }} />
        </Tooltip>
        <Tooltip placement="top" title={'下载'} className={styles.btn}>
          <DownloadOutlined onClick={onDownload} style={{ fontSize: '16px' }} />
        </Tooltip>
      </div>
    )
  }
}
export default EchartsBtn
