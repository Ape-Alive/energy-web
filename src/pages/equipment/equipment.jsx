import { useRef, useState, useEffect } from 'react'
import ProTable, {
  IntlProvider,
  enUSIntl,
  zhCNIntl
} from '@ant-design/pro-table'
import {
  PlusOutlined,
  DeleteFilled,
  UserAddOutlined,
  ExclamationCircleOutlined,
  LineOutlined,
  UserDeleteOutlined
} from '@ant-design/icons'
import EquipmentDetailModal from './equipmentDetailModal'
import EquipmentDrawer from './equipmentDrawer'
import DistributionModal from './distributionModal'
import { Button, Tooltip, Modal, message, ConfigProvider } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'

import PowerStationBindingEquipment from './powerStationBindingEquipment'
import { apiDevice, apiBase } from '@/services/api'
import { history } from 'umi'

const { confirm } = Modal
const Equipment = ({ powerStationId }) => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const formRef = useRef()
  const [pageSize, setPageSize] = useState(10)
  const [showEquipmentDetailModal, setShowEquipmentDetailModal] =
    useState(false)
  const [showEquipmentDrawer, setShowEquipmentDrawer] = useState(false)
  const [showDistributionModal, setShowDistributionModal] = useState(false)

  const [
    showPowerStationBindingEquipment,
    setShowPowerStationBindingEquipment
  ] = useState(false)

  const [equipmentgetTypeObject, setEquipmentgetTypeObject] = useState({})
  const [equipmentgettModelObject, setEquipmentgetModelObject] = useState({})
  const [clientObject, setClientObject] = useState({})
  const [record, setRecord] = useState({})

  useEffect(() => {
    equipmentgetType()
    equipmentgetModel()
    getClientList()

    const clientId = history.location.query.clientId
    if (clientId) {
      formRef.current?.setFieldsValue({
        client_id: clientId
      })
      formRef.current?.submit()
    }
  }, [])

  const cancelDistribution = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingqvxiaofenpeigaikehuma'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiDevice({
          apiMethod: 'updateDeviceInfo',
          client_id: 0,
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

  const deleteEquipment = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingshanchugaishebeima'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiDevice({
          apiMethod: 'deleteDeviceInfo',
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

  const untieEquipment = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingjiebang'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiDevice({
          apiMethod: 'bindDeviceStation',
          stationId: powerStationId,
          unBindIds: id
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

  const equipmentgetType = async () => {
    const { data = [] } = await apiDevice({ apiMethod: 'getDeviceType' })
    const obj = {}
    data.forEach((info) => {
      obj[info.id] = {
        text: info.name,
        status: info.id
      }
    })
    setEquipmentgetTypeObject(obj)
  }

  const equipmentgetModel = async () => {
    const { data = [] } = await apiDevice({ apiMethod: 'getDeviceModelList' })
    const obj = {}
    data.forEach((info) => {
      obj[info.id] = {
        text: info.model_name,
        status: info.id
      }
    })
    setEquipmentgetModelObject(obj)
  }

  const getClientList = async () => {
    const { data = [] } = await apiBase({
      apiMethod: 'getClientList',
      pageNum: 1,
      pageSize: 500
    })
    const obj = {}
    data.forEach((info) => {
      obj[info.id] = {
        text: info.title,
        status: info.id
      }
    })
    setClientObject(obj)
  }

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },

    {
      title: t('mingcheng'),
      key: 'device_name',
      dataIndex: 'device_name',
      hideInSearch: true
    },
    {
      title: t('shebeizhonglei'),
      key: 'device_type_id',
      dataIndex: 'device_type_id',
      valueType: 'select',
      valueEnum: equipmentgetTypeObject
    },
    {
      title: t('shebeixinghao'),
      key: 'model_id',
      dataIndex: 'model_id',
      valueType: 'select',
      valueEnum: equipmentgettModelObject
    },
    {
      title: t('suoshudianzhan'),
      key: 'station_name',
      dataIndex: 'station_name',
      hideInSearch: true
    },
    {
      title: t('biaoqian'),
      key: 'device_tag',
      dataIndex: 'device_tag',
      hideInSearch: true
    },
    {
      title: t('zaixianzhuangtai'),
      key: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: t('lixian'),
          status: 0
        },
        1: {
          text: t('zaixian'),
          status: 1
        }
      },
      render: (record) => {
        if (record.props.record.status === '0') {
          return <div style={{ color: 'red' }}>{t('lixian')}</div>
        }
        return t('zaixian')
      }
    },
    {
      title: t('baojingzhuangtai'),
      key: 'status_alarm',
      dataIndex: 'status_alarm',
      valueType: 'select',
      valueEnum: {
        1: {
          text: t('yougaojing'),
          status: 0
        },
        0: {
          text: t('wugaojing'),
          status: 1
        }
      }
    },
    {
      title: t('kehu'),
      key: 'client_id',
      dataIndex: 'client_id',
      valueType: 'select',
      valueEnum: clientObject,
      render: (node, record) => {
        if (record.client_id === '0') {
          return
        }
        return clientObject[record.client_id]?.text
      }
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
            <Tooltip placement="top" title={t('fenpeikehu')} arrow={true}>
              <UserAddOutlined
                className={`${
                  record.client_id !== '0' ? 'table-icon1' : 'table-icon'
                }`}
                alt=""
                onClick={(e) => {
                  e.stopPropagation()
                  if (record.client_id !== '0') {
                    return
                  }
                  setRecord(record)
                  setShowDistributionModal(true)
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title={t('qvxiaofenpeikehu')} arrow={true}>
              <UserDeleteOutlined
                className={`${
                  record.client_id !== '0' ? 'table-icon' : 'table-icon1'
                }`}
                alt=""
                onClick={(e) => {
                  e.stopPropagation()
                  if (record.client_id === '0') {
                    return
                  }
                  cancelDistribution(record.id)
                }}
              />
            </Tooltip>

            {!powerStationId && (
              <Tooltip placement="top" title={t('shanchu')} arrow={true}>
                <DeleteFilled
                  className="table-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteEquipment(record.id)
                  }}
                />
              </Tooltip>
            )}

            {powerStationId && (
              <Tooltip placement="top" title={t('jiebang')} arrow={true}>
                <LineOutlined
                  className="table-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    untieEquipment(record.id)
                  }}
                />
              </Tooltip>
            )}
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
          locale={enumLang[language]}
          actionRef={actionRef}
          formRef={formRef}
          columns={columns}
          request={async (params = {}) => {
            const { data, page = {} } = await apiDevice({
              ...params,
              apiMethod: 'getDeviceList',
              station_id: powerStationId,
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
          headerTitle={t('shebei')}
          onRow={(record, index) => {
            return {
              onClick: (a) => {
                setRecord(record)
                setShowEquipmentDrawer(true)
              }
            }
          }}
          toolBarRender={(e) => {
            return (
              <div>
                {powerStationId && (
                  <Button
                    key="button"
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => {
                      setShowPowerStationBindingEquipment(true)
                    }}
                  >
                    {t('xinzeng')}
                  </Button>
                )}
                {!powerStationId && (
                  <Button
                    key="button"
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => {
                      setShowEquipmentDetailModal(true)
                    }}
                  >
                    {t('xinjian')}
                  </Button>
                )}
              </div>
            )
          }}
        />
        {showEquipmentDetailModal && (
          <EquipmentDetailModal
            show={showEquipmentDetailModal}
            setShow={setShowEquipmentDetailModal}
            actionRef={actionRef}
            station_id={powerStationId}
          />
        )}
        {showEquipmentDrawer && (
          <EquipmentDrawer
            show={showEquipmentDrawer}
            setShow={setShowEquipmentDrawer}
            actionRef={actionRef}
            record={record}
          />
        )}
        {showDistributionModal && (
          <DistributionModal
            show={showDistributionModal}
            setShow={setShowDistributionModal}
            actionRef={actionRef}
            record={record}
          />
        )}
        {showPowerStationBindingEquipment && (
          <PowerStationBindingEquipment
            show={showPowerStationBindingEquipment}
            powerStationId={powerStationId}
            setShow={setShowPowerStationBindingEquipment}
            actionRef={actionRef}
          />
        )}
      </IntlProvider>
    </ConfigProvider>
  )
}

export default Equipment
