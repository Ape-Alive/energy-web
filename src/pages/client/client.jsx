import { useRef, useState } from 'react'
import ProTable, {
  IntlProvider,
  enUSIntl,
  zhCNIntl
} from '@ant-design/pro-table'
import { Trans, useTranslation } from 'react-i18next'
import {
  PlusOutlined,
  DeleteFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import ClientDetailModal from './clientDetailModal'
import ClientDrawer from './clientDrawer'
import { Button, message, Tooltip, Modal, ConfigProvider } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import { history } from 'umi'
import equipmentMmanagement from '@/assets/client/equipmentMmanagement.png'
import './client.less'
import { apiBase } from '@/services/api'

const { confirm } = Modal

const Client = () => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const [pageSize, setPageSize] = useState(10)
  const [showClientDetailModal, setShowClientDetailModal] = useState(false)
  const [showClientDrawer, setShowClientDrawer] = useState(false)
  const [record, setRecord] = useState({})

  const deleteClient = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingshanchugaikehuma'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiBase({
          apiMethod: 'delClient',
          clientId: id
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
      title: t('kehu'),
      key: 'title',
      dataIndex: 'title'
    },
    {
      title: t('kehubianhao'),
      key: 'code',
      dataIndex: 'code',
      hideInSearch: true
    },
    {
      title: t('email'),
      key: 'email',
      dataIndex: 'email',
      hideInSearch: true
    },
    {
      title: t('guojia'),
      key: 'country',
      dataIndex: 'country',
      hideInSearch: true
    },
    {
      title: t('chengshi'),
      key: 'city',
      dataIndex: 'city',
      hideInSearch: true
    },
    {
      title: t('kehulujing'),
      key: 'todo6',
      dataIndex: 'todo6',
      hideInSearch: true
    },
    {
      title: t('chuangjianshijian'),
      key: 'create_at',
      dataIndex: 'create_at',
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
            <Tooltip placement="top" title={t('guanlikehushebei')} arrow={true}>
              <img
                className="table-icon"
                src={equipmentMmanagement}
                alt=""
                onClick={(e) => {
                  e.stopPropagation()
                  history.push('/equipment?clientId=' + record.id)
                }}
              />
            </Tooltip>

            <Tooltip placement="top" title={t('shanchu')} arrow={true}>
              <DeleteFilled
                className="table-icon"
                onClick={(e) => {
                  e.stopPropagation()

                  deleteClient(record.id)
                }}
              />
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
              apiMethod: 'getClientList',
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
          search={{
            labelWidth: 'auto',
            collapseRender: false,
            collapsed: false,
            span: 6
          }}
          form={{}}
          pagination={{
            pageSize: pageSize || 10,
            showSizeChanger: true,
            onChange: (_, pageSize) => {
              setPageSize(pageSize)
            }
          }}
          dateFormatter="string"
          headerTitle={t('kehu')}
          onRow={(record, index) => {
            return {
              onClick: (a) => {
                setRecord(record)
                setShowClientDrawer(true)
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
                  setShowClientDetailModal(true)
                }}
              >
                {t('xinjian')}
              </Button>
            )
          }}
        />
        {showClientDrawer && (
          <ClientDrawer
            show={showClientDrawer}
            setShow={setShowClientDrawer}
            actionRef={actionRef}
            record={record}
          />
        )}
        {showClientDetailModal && (
          <ClientDetailModal
            show={showClientDetailModal}
            setShow={setShowClientDetailModal}
            actionRef={actionRef}
          />
        )}
      </IntlProvider>
    </ConfigProvider>
  )
}

export default Client
