import { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popconfirm, Popover, Tree } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

const TabsProperty = () => {
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
      key: 'todo1',
      dataIndex: 'todo1',
      hideInSearch: true
    },
    {
      title: t('jianming'),
      key: 'todo2',
      dataIndex: 'todo2',
      hideInSearch: true
    },
    {
      title: t('shuzhi'),
      key: 'todo3',
      dataIndex: 'todo3',
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
        headerTitle={t('shuxing')}
      />
    </div>
  )
}

export default TabsProperty
