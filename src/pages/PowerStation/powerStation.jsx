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
  UserDeleteOutlined
} from '@ant-design/icons'
import PowerStationDetailModal from './powerStationDetailModal'
import { Trans, useTranslation } from 'react-i18next'

import { history } from 'umi'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import PowerStationModal from './powerStationModal'
import { Button, Tooltip, Modal, message, ConfigProvider } from 'antd'
import { apiStation, apiBase } from '@/services/api'
const { confirm } = Modal
const PowerStation = () => {
  const { t } = useTranslation()
  const actionRef = useRef()
  const [pageSize, setPageSize] = useState(10)
  const [showPowerStationDetailModal, setShowPowerStationDetailModal] =
    useState(false)
  const [record, setRecord] = useState({})

  const [showPowerStationModal, setShowPowerStationModal] = useState(false)

  useEffect(() => {}, [])

  const cancelDistribution = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingqvxiaofenpeigaikehuma'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiStation({
          apiMethod: 'update',
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

  const deleteStation = (id) => {
    confirm({
      title: t('jinggao'),
      icon: <ExclamationCircleOutlined />,
      content: t('quedingshanchugaidianzhanma'),
      cancelText: t('qvxiao'),
      okText: t('queding'),
      onOk: async () => {
        const { code, msg } = await apiStation({
          apiMethod: 'delete',
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
      title: t('zhandianmingcheng'),
      key: 'station_name',
      dataIndex: 'station_name',
      hideInSearch: true
    },

    {
      title: t('kehu'),
      key: 'clientName',
      dataIndex: 'clientName',
      hideInSearch: true
    },

    {
      title: t('zaixianzhuangtai'),
      key: 'onlineStatus',
      dataIndex: 'onlineStatus',
      valueType: 'select',
      valueEnum: {
        0: {
          text: t('quanbu'),
          status: 0
        },
        1: {
          text: t('quanbuzaixian'),
          status: 1
        },
        2: {
          text: t('bufenzaixian'),
          status: 2
        },
        3: {
          text: t('quanbulixian'),
          status: 3
        }
      }
    },

    {
      title: t('gaojingzhaungtai'),
      key: 'alarmStatus',
      dataIndex: 'alarmStatus',
      valueType: 'select',
      valueEnum: {
        0: {
          text: t('quanbu'),
          status: 0
        },
        1: {
          text: t('quanbuzhengchang'),
          status: 1
        },
        2: {
          text: t('bufengaojingn'),
          status: 2
        },
        3: {
          text: t('quanbugaojing'),
          status: 3
        }
      }
    },

    {
      title: t('zaixianshuliang/zongliang'),
      key: 'online',
      dataIndex: 'online',
      hideInSearch: true,
      render: (_, record) => {
        const children = record.children || []

        let childrenOnlineTotal = 0
        let childrenOfflineTotal = 0

        children.forEach((value) => {
          console.log(value)
          const statusNum = value.statusNum || {}
          childrenOnlineTotal += statusNum.online
          childrenOfflineTotal += statusNum.offline
        })

        const statusNum = record.statusNum || {}
        return (
          (statusNum.online || 0) +
          childrenOnlineTotal +
          '/' +
          ((statusNum.online || 0) +
            childrenOnlineTotal +
            (statusNum.offline || 0) +
            childrenOfflineTotal)
        )
      }
    },

    {
      title: t('gaojingshuliang/zongliang'),
      key: 'alarm',
      dataIndex: 'alarm',
      hideInSearch: true,
      render: (_, record) => {
        const children = record.children || []

        let childrenAlarmTotal = 0
        let childrenNoAlarmTotal = 0

        children.forEach((value) => {
          const statusNum = value.statusNum || {}
          childrenAlarmTotal += statusNum.alarm
          childrenNoAlarmTotal += statusNum.noAlarm
        })

        const statusNum = record.statusNum || {}

        return (
          (statusNum.alarm || 0) +
          childrenAlarmTotal +
          '/' +
          ((statusNum.alarm || 0) +
            childrenAlarmTotal +
            (statusNum.noAlarm || 0) +
            childrenNoAlarmTotal)
        )
      }
    },

    {
      title: t('zhuangjirongliang'),
      key: 'station_power',
      dataIndex: 'station_power',
      hideInSearch: true
    },
    {
      title: t('fadiangonglv'),
      key: 'pvAllPower',
      dataIndex: 'pvAllPower',
      hideInSearch: true,
      render: (_, record) => {
        const statData = record.statData || {}
        return statData.pvAllPower || 0
      }
    },

    {
      title: t('dangrifadianliang'),
      key: 'curDateElecGen',
      dataIndex: 'curDateElecGen',
      hideInSearch: true,
      render: (_, record) => {
        const statData = record.statData || {}
        return statData.curDateElecGen || 0
      }
    },

    {
      title: t('dangrimanfaxiaoshi'),
      key: 'curDateElecHour',
      dataIndex: 'curDateElecHour',
      hideInSearch: true,
      render: (_, record) => {
        const statData = record.statData || {}
        return statData.curDateElecHour || 0
      }
    },

    {
      title: t('toufangshijian'),
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
                  setShowPowerStationModal(true)
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

            <Tooltip placement="top" title={t('shanchu')} arrow={true}>
              <DeleteFilled
                className="table-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteStation(record.id)
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
            const { data, page = {} } = await apiStation({
              ...params,
              apiMethod: 'list',
              pageNum: params.current,
              pageSize: params.pageSize,
              needChild: '1'
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
          headerTitle={t('dianzhan')}
          onRow={(record, index) => {
            return {
              onClick: (a) => {
                history.push('/powerStationDetail?id=' + record.id)
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
                  setShowPowerStationDetailModal(true)
                }}
              >
                {t('xinjian')}
              </Button>
            )
          }}
        />
        {showPowerStationDetailModal && (
          <PowerStationDetailModal
            show={showPowerStationDetailModal}
            setShow={setShowPowerStationDetailModal}
            actionRef={actionRef}
          />
        )}
        {showPowerStationModal && (
          <PowerStationModal
            show={showPowerStationModal}
            setShow={setShowPowerStationModal}
            record={record}
            actionRef={actionRef}
          />
        )}
      </IntlProvider>
    </ConfigProvider>
  )
}

export default PowerStation
