import { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popconfirm, Popover, Tree } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiDevice } from '@/services/api'

const TabsProperty = ({ record }) => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const [pageSize, setPageSize] = useState(10)

  const columns = [
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
  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          const { data, page = {} } = await apiDevice({
            ...params,
            apiMethod: 'getDeviceAttrLastList',
            pageNum: params.current,
            pageSize: params.pageSize,
            device_id: record.id,
            device_sn: record.device_sn,
            attr_type: 1
          })
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
        headerTitle={t('shuxing')}
      />
    </div>
  )
}

export default TabsProperty
