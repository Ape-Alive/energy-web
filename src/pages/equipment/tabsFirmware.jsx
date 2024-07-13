import { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popconfirm, Popover, Tree } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiInverter, apiCharger } from '@/services/api'

const TabsFirmware = ({ record }) => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const [pageSize, setPageSize] = useState(10)

  console.log(record)

  let columns = []

  if (record.device_type_id === '4') {
    columns = [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48
      },

      {
        title: t('gujianbanben'),
        key: 'fw_version',
        dataIndex: 'fw_version',
        hideInSearch: true
      },

      {
        title: t('gujianshengjizhuangtai'),
        key: 'fw_update_status',
        dataIndex: 'fw_update_status',
        hideInSearch: true
      },

      {
        title: t('gujianshengjishijian'),
        key: 'fw_update_timestamp',
        dataIndex: 'fw_update_timestamp',
        hideInSearch: true
      }
    ]
  } else {
    columns = [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48
      },

      {
        title: t('ruanjianbanben'),
        key: 'software_version',
        dataIndex: 'software_version',
        hideInSearch: true,
        render: (value) => {
          if (!value || value === '-') {
            return t('weihuoqvdaoshujv')
          }
          const values = value.split('.')
          const value1 =
            'app v' + values[0][0] + '.' + values[0][1] + values[0][2]

          const value2 =
            'bootloader v' + values[1][0] + '.' + values[1][1] + values[1][2]
          return value1 + ' , ' + value2
        }
      },
      {
        title: t('yingjianbanben'),
        key: 'hardware_version',
        dataIndex: 'hardware_version',
        hideInSearch: true,
        render: (value) => {
          if (!value || value === '-') {
            return t('weihuoqvdaoshujv')
          }
          const values = value.split('.')
          const value1 =
            '控制板 v' + values[0][0] + '.' + values[0][1] + values[0][2]

          const value2 =
            '功率板 v' + values[1][0] + '.' + values[1][1] + values[1][2]
          return value1 + ' , ' + value2
        }
      }
    ]
  }

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          let api = ''
          let info = {}
          if (record.device_type_id === '4') {
            info.device_sn = record.device_sn
            info.apiMethod = 'ocppChargeBox'
            api = apiCharger
          } else {
            info.id = record.id
            info.apiMethod = 'info'
            api = apiInverter
          }

          const { data = '', page = {} } = await api({
            ...params,
            ...info
          })
          return {
            data: data ? [data] : [],
            success: true
          }
        }}
        editable={{
          type: 'multiple'
        }}
        rowKey="id"
        search={false}
        form={{}}
        pagination={false}
        dateFormatter="string"
        headerTitle={t('gujian')}
      />
    </div>
  )
}

export default TabsFirmware
