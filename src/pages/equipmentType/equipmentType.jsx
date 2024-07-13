import { useRef, useState } from 'react'
import ProTable, {
  IntlProvider,
  enUSIntl,
  zhCNIntl
} from '@ant-design/pro-table'
import {
  PlusOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
  PushpinOutlined,
  CheckOutlined
} from '@ant-design/icons'
import EquipmentTypeDetailModal from './equipmentTypeDetailModal'
import EquipmentTypeDrawer from './equipmentTypeDrawer'
import { useTranslation } from 'react-i18next'
import { apiDevice } from '@/services/api'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import { Button, Tooltip, Modal, message, ConfigProvider } from 'antd'
const { confirm } = Modal
const EquipmentType = () => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const [pageSize, setPageSize] = useState(10)
  const [showEquipmentTypeDetailModal, setShowEquipmentTypeDetailModal] =
    useState(false)
  const [showEquipmentTypeDrawer, setShowEquipmentTypeDrawer] = useState(false)
  const [record, setRecord] = useState({})

  const setDefault = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingyaojiangshebeixinghaosheweimorenzhima'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiDevice({
          apiMethod: 'setModelDefault',
          id: id
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

  const deleteEquipmentType = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingshanchugaishebeixinghaoma'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiDevice({
          apiMethod: 'deleteDeviceModel',
          id: id
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
      title: t('mingcheng'),
      key: 'model_name',
      dataIndex: 'model_name',
      hideInSearch: true
    },

    {
      title: t('shebeizhonglei'),
      key: 'device_type_name',
      dataIndex: 'device_type_name',
      hideInSearch: true
    },
    {
      title: t('chuanshufangshi'),
      key: 'communication_type_name',
      dataIndex: 'communication_type_name',
      hideInSearch: true
    },

    {
      title: t('shuoming'),
      key: 'model_remarks',
      dataIndex: 'model_remarks',
      hideInSearch: true
    },

    {
      title: t('moren'),
      key: 'default_',
      dataIndex: 'default_',
      hideInSearch: true,
      render: (_, record) => {
        if (record.default_ === '1') {
          return <CheckOutlined />
        }
        return <div></div>
      }
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
            <Tooltip
              placement="top"
              title={t('sheweimorenxinghao')}
              arrow={true}
            >
              <PushpinOutlined
                className={`${
                  record.default_ !== '1' ? 'table-icon' : 'table-icon1'
                }`}
                alt=""
                onClick={(e) => {
                  e.stopPropagation()
                  if (record.default_ === '1') {
                    return
                  }
                  setDefault(record.id)
                }}
              />
            </Tooltip>

            <Tooltip placement="top" title={t('shanchu')} arrow={true}>
              <DeleteFilled
                className={`${
                  record.default_ !== '1' ? 'table-icon' : 'table-icon1'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (record.default_ === '1') {
                    return
                  }
                  deleteEquipmentType(record.id)
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
            const { data, page = {} } = await apiDevice({
              ...params,
              apiMethod: 'getDeviceModelList',
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
          headerTitle={t('shebeixinghao')}
          onRow={(record, index) => {
            return {
              onClick: (a) => {
                setRecord(record)
                setShowEquipmentTypeDrawer(true)
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
                  setShowEquipmentTypeDetailModal(true)
                }}
              >
                {t('xinjian')}
              </Button>
            )
          }}
        />
        {showEquipmentTypeDetailModal && (
          <EquipmentTypeDetailModal
            show={showEquipmentTypeDetailModal}
            setShow={setShowEquipmentTypeDetailModal}
            actionRef={actionRef}
          />
        )}
        {showEquipmentTypeDrawer && (
          <EquipmentTypeDrawer
            show={showEquipmentTypeDrawer}
            setShow={setShowEquipmentTypeDrawer}
            actionRef={actionRef}
            record={record}
          />
        )}
      </IntlProvider>
    </ConfigProvider>
  )
}

export default EquipmentType
