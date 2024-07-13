import { Button, Drawer, Tabs } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import TabsEquipmentTypeDetail from './tabsEquipmentTypeDetail'

import TabsFirmware from './tabsFirmware'

const EquipmentTypeDrawer = ({ title, show, setShow, actionRef, record }) => {
  const { t } = useTranslation()
  const itemsArray = [
    {
      label: t('xiangqing'),
      key: t('xiangqing'),
      children: (
        <TabsEquipmentTypeDetail actionRef={actionRef} record={record} />
      )
    }

    // { label: t('gujian'), key: t('gujian'), children: <TabsFirmware /> }
  ]
  return (
    <Drawer
      title={t('shebeixinghaoxiangxixinxi')}
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

export default EquipmentTypeDrawer
