import { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Trans, useTranslation } from 'react-i18next'
import { Button, message, Popconfirm, Popover, Tree } from 'antd'

const TabsAlarm = () => {
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
      key: 'todo1',
      dataIndex: 'todo1',
      hideInSearch: true
    },
    {
      title: t('faqizhe'),
      key: 'todo2',
      dataIndex: 'todo2',
      hideInSearch: true
    },
    {
      title: t('leixing'),
      key: 'todo3',
      dataIndex: 'todo3',
      hideInSearch: true
    },
    {
      title: t('miaoshu'),
      key: 'todo4',
      dataIndex: 'todo4',
      hideInSearch: true
    },
    {
      title: t('yanzhongchengdu'),
      key: 'todo5',
      dataIndex: 'todo5',
      hideInSearch: true
    },
    {
      title: t('zhuangtai'),
      key: 'todo6',
      dataIndex: 'todo6',
      hideInSearch: true
    },
    {
      title: t('xiangqing'),
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
        headerTitle={t('gaojing')}
      />
    </div>
  )
}

export default TabsAlarm
