import { Tabs, ConfigProvider } from 'antd'
import TabsPowerStationDetail from './tabsPowerStationDetail'
import TabsDataBoard from './tabsDataBoard'
import { Trans, useTranslation } from 'react-i18next'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import Equipment from '../equipment/equipment'

const PowerStationDetail = (props) => {
  const { t } = useTranslation()
  const id = props.location.query.id

  const itemsArray = [
    {
      label: t('shujvkanban'),
      key: t('shujvkanban'),
      children: <TabsDataBoard id={id} />
    },
    {
      label: t('xiangqing'),
      key: t('xiangqing'),
      children: (
        <div style={{ backgroundColor: '#fff', padding: '0 20px' }}>
          <TabsPowerStationDetail id={id} />
        </div>
      )
    },
    {
      label: t('shebei'),
      key: t('shebei'),
      children: (
        <div style={{ backgroundColor: '#fff', padding: '0 20px' }}>
          <Equipment powerStationId={id} />
        </div>
      )
    }
  ]

  const language = localStorage.getItem('language') || 'en'
  const enumLang = {
    en: enUS,
    zh: zhCN
  }

  return (
    <ConfigProvider locale={enumLang[language]}>
      <div style={{ backgroundColor: '#fff' }}>
        <Tabs
          onChange={() => {}}
          type="card"
          destroyInactiveTabPane={true}
          items={itemsArray.map((info, i) => {
            return {
              label: info.label,
              key: info.key,
              children: (
                <div style={{ backgroundColor: '#f0f2f5' }}>
                  {info.children}
                </div>
              )
            }
          })}
        />
      </div>
    </ConfigProvider>
  )
}

export default PowerStationDetail
