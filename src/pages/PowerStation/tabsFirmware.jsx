import { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popconfirm, Popover, Tree } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

const TabsFirmware = () => {
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
      title: t('biaoti'),
      key: 'todo1',
      dataIndex: 'todo1',
      hideInSearch: true
    },
    {
      title: t('banben'),
      key: 'todo2',
      dataIndex: 'todo2',
      hideInSearch: true
    },
    {
      title: t('banbenbiaoqian'),
      key: 'todo3',
      dataIndex: 'todo3',
      hideInSearch: true
    },
    {
      title: t('danyuan'),
      key: 'todo4',
      dataIndex: 'todo4',
      hideInSearch: true
    },
    {
      title: t('shengjileixing'),
      key: 'todo5',
      dataIndex: 'todo5',
      hideInSearch: true
    },
    {
      title: t('shengjizhuangtai'),
      key: 'todo6',
      dataIndex: 'todo6',
      hideInSearch: true
    },
    {
      title: t('chuangjianshijian'),
      key: 'todo7',
      dataIndex: 'todo7',
      hideInSearch: true
    }
  ]
  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={(params = {}) => {}}
        dataSource={[{ todo1: 1 }]}
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
        headerTitle={t('gujian')}
      />
    </div>
  )
}

export default TabsFirmware
