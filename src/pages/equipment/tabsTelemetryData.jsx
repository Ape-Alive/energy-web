import { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popconfirm, Popover, Tree } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiCharger, apiDevice } from '@/services/api'
import moment from 'moment'

const TabsTelemetryData = ({ record }) => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const [pageSize, setPageSize] = useState(10)

  let columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },

    {
      title: t('value_timestamp'),
      key: 'value_timestamp',
      dataIndex: 'value_timestamp',
      hideInSearch: true,
      render: (value) => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: t('measurand'),
      key: 'measurand',
      dataIndex: 'measurand',
      hideInSearch: true
    },
    {
      title: t('location'),
      key: 'location',
      dataIndex: 'location',
      hideInSearch: true
    },
    {
      title: t('phase'),
      key: 'phase',
      dataIndex: 'phase',
      hideInSearch: true
    },
    {
      title: t('format'),
      key: 'format',
      dataIndex: 'format',
      hideInSearch: true
    },
    {
      title: t('reading_context'),
      key: 'reading_context',
      dataIndex: 'reading_context',
      hideInSearch: true
    },
    {
      title: t('value'),
      key: 'value',
      dataIndex: 'value',
      hideInSearch: true
    },
    {
      title: t('unit'),
      key: 'unit',
      dataIndex: 'unit',
      hideInSearch: true
    }
  ]

  if (record.device_type_name === 'Inverter') {
    columns = [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48
      },

      {
        title: t('zuihougengxinshijian'),
        key: 'updated_time',
        dataIndex: 'updated_time',
        hideInSearch: true
      },
      {
        title: t('jianming'),
        key: 'attr_name',
        dataIndex: 'attr_name',
        hideInSearch: true
      },
      {
        title: t('shuzhi'),
        key: 'attr_value',
        dataIndex: 'attr_value',
        hideInSearch: true
      }
    ]
  }

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          let api = apiCharger
          let info = {
            ...params,
            apiMethod: 'ocppChargeMeter',
            pageNum: params.current,
            pageSize: params.pageSize,
            device_sn: record.device_sn
          }
          if (record.device_type_name === 'Inverter') {
            api = apiDevice
            info = {
              ...params,
              apiMethod: 'getDeviceAttrLastList',
              type: 2,

              device_sn: record.device_sn
            }
          }
          const { data, page = {} } = await api(info)
          return {
            data: data,
            success: true,
            total: page.totalCount
          }
        }}
        editable={{
          type: 'multiple'
        }}
        rowKey="id"
        search={false}
        form={{}}
        pagination={{
          pageSize: pageSize || 10,
          showSizeChanger: true,
          onChange: (_, pageSize) => {
            setPageSize(pageSize)
          }
        }}
        dateFormatter="string"
        headerTitle={t('zuixinyaoceshujv')}
      />
    </div>
  )
}

export default TabsTelemetryData
