import { Button, Drawer, Tabs } from 'antd'

import TabsClientDetail from './tabsClientDetail'
import TabsProperty from './tabsProperty'
import TabsTelemetryData from './tabsTelemetryData'
import TabsAlarm from './tabsAlarm'
import { Trans, useTranslation } from 'react-i18next'

const ClientDrawer = ({ title, show, setShow, record, actionRef }) => {
  const { t } = useTranslation()
  const itemsArray = [
    {
      label: t('xiangqing'),
      key: t('xiangqing'),
      children: <TabsClientDetail record={record} actionRef={actionRef} />
    },
    { label: t('shuxing'), key: t('shuxing'), children: <TabsProperty /> },
    {
      label: t('zuixinyaoceshujv'),
      key: t('zuixinyaoceshujv'),
      children: <TabsTelemetryData />
    },
    { label: t('gaojing'), key: t('gaojing'), children: <TabsAlarm /> }
  ]
  return (
    <Drawer
      title={title || t('kehu')}
      width={1000}
      open={show}
      onClose={() => {
        setShow(false)
      }}
    >
      <Tabs
        onChange={() => {}}
        type="card"
        items={itemsArray.map((info, i) => {
          return {
            label: info.label,
            key: info.key,
            children: info.children
          }
        })}
      />
    </Drawer>
  )
}

export default ClientDrawer
