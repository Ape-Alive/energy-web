import { useRef, useState } from 'react'
import ProTable, {
  IntlProvider,
  enUSIntl,
  zhCNIntl
} from '@ant-design/pro-table'
import {
  PlusOutlined,
  DeleteFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import RoleDetailModal from './roleDetailModal'

import { useTranslation } from 'react-i18next'
import { apiBase, apiDevice } from '@/services/api'
import { Button, Tooltip, Modal, message, ConfigProvider } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
const { confirm } = Modal
const RoleManageList = () => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const [pageSize, setPageSize] = useState(10)
  const [showRoleManageDetailModal, setShowRoleManageDetailModal] =
    useState(false)

  const [record, setRecord] = useState({})

  const deleteRoleManage = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingshanchugaijuesema'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiBase({
          apiMethod: 'deleteRole',
          roleId: id
        })
        if (code !== '000000') {
          message.error(msg)
          return
        }
        actionRef.current?.reload()
        message.success(msg)
      },
      onCancel() {}
    })
  }

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },

    {
      title: t('jusemingcheng'),
      key: 'roleName',
      dataIndex: 'roleName',
      hideInSearch: true
    },

    {
      title: t('beizhu'),
      key: 'note',
      dataIndex: 'note',
      hideInSearch: true
    },

    {
      title: '',
      key: 'opera',
      dataIndex: 'opera',
      hideInSearch: true,
      width: 100,
      render: (_, record) => {
        return (
          <div className="table-opera-body">
            <Tooltip placement="top" title={t('shanchu')} arrow={true}>
              {record.roleId !== '1' && (
                <DeleteFilled
                  className="table-icon"
                  onClick={(e) => {
                    e.stopPropagation()

                    deleteRoleManage(record.roleId)
                  }}
                />
              )}
            </Tooltip>
          </div>
        )
      }
    }
  ]
  const language = localStorage.getItem('language') || 'en'
  const enumLang = {
    en: enUS,
    zh: zhCN
  }
  const enumTableLang = {
    en: enUSIntl,
    zh: zhCNIntl
  }
  return (
    <ConfigProvider locale={enumLang[language]}>
      <IntlProvider value={enumTableLang[language]}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          request={async (params = {}) => {
            const { data, page = {} } = await apiBase({
              ...params,
              apiMethod: 'getRoleNameList',
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
          headerTitle={t('jueseguanli')}
          onRow={(record, index) => {
            return {
              onClick: (a) => {
                setRecord(record)
                setShowRoleManageDetailModal(true)
              }
            }
          }}
          toolBarRender={(e) => {
            return (
              <Button
                key="button"
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setRecord({})
                  setShowRoleManageDetailModal(true)
                }}
              >
                {t('xinjian')}
              </Button>
            )
          }}
        />
        {showRoleManageDetailModal && (
          <RoleDetailModal
            show={showRoleManageDetailModal}
            setShow={setShowRoleManageDetailModal}
            actionRef={actionRef}
            record={record}
          />
        )}
      </IntlProvider>
    </ConfigProvider>
  )
}

export default RoleManageList
