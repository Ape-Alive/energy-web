import { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popconfirm, Popover, Tree } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiDevice } from '@/services/api'

const TabsAlarm = ({ record }) => {
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
      title: t('chuangjianshijian'),
      key: 'create_at',
      dataIndex: 'create_at',
      hideInSearch: true
    },
    // {
    //   title: t('faqizhe'),
    //   key: 'todo2',
    //   dataIndex: 'todo2',
    //   hideInSearch: true
    // },
    {
      title: t('zhuangtai'),
      key: 'alarmStatus',
      dataIndex: 'alarmStatus',
      hideInSearch: true
    },
    {
      title: t('leixing'),
      key: 'alarmType',
      dataIndex: 'alarmType',
      hideInSearch: true
    },
    {
      title: t('miaoshu'),
      key: 'alarmDesc',
      dataIndex: 'alarmDesc',
      hideInSearch: true
    }

    // {
    //   title: t('xiangqing'),
    //   key: 'todo7',
    //   dataIndex: 'todo7',
    //   hideInSearch: true
    // }
  ]
  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          const { data, page = {} } = await apiDevice({
            ...params,
            apiMethod: 'getDeviceAlarmHis',
            device_type_id: record.device_type_id,
            device_sn: record.device_sn,
            pageNum: params.current,
            pageSize: params.pageSize
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
        headerTitle={t('gaojing')}
      />
    </div>
  )
}

export default TabsAlarm
