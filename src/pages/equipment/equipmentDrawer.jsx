import { Button, Drawer, Tabs } from 'antd'

import TabsEquipmentDetail from './tabsEquipmentDetail'
import TabsProperty from './tabsProperty'
import TabsTelemetryData from './tabsTelemetryData'
import TabsFirmware from './tabsFirmware'
import TabsInverterView from './tabsInverterView'
import TabsAlarm from './tabsAlarm'
import TabsChargingPileView from './tabsChargingPileView'

import { Trans, useTranslation } from 'react-i18next'

const EquipmentDrawer = ({ title, show, setShow, actionRef, record }) => {
  const { t } = useTranslation()

  const enumDiv = {
    1: <TabsInverterView record={record} />,
    4: <TabsChargingPileView record={record} />
  }
  const itemsArray = [
    {
      label: t('xiangqing'),
      key: t('xiangqing'),
      children: <TabsEquipmentDetail actionRef={actionRef} record={record} />
    },
    {
      label: t('shuxingshitu'),
      key: t('shuxingshitu'),
      children: enumDiv[record.device_type_id]
    },
    {
      label: t('gujian'),
      key: t('gujian'),
      children: <TabsFirmware record={record} />
    },
    {
      label: t('shuxing'),
      key: t('shuxing'),
      children: <TabsProperty record={record} />
    },
    {
      label: t('zuixinyaoceshujv'),
      key: t('zuixinyaoceshujv'),
      children: <TabsTelemetryData record={record} />
    },
    {
      label: t('gaojing'),
      key: t('gaojing'),
      children: <TabsAlarm record={record} />
    }
  ]
  return (
    <Drawer
      title={t('shebeixiangxixinxi')}
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

export default EquipmentDrawer
