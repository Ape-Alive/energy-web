import { Form, Input, Row, Col, Modal, message, Select } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import { apiDevice, apiBase } from '@/services/api'
import { useEffect, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { includes } from 'lodash'

const EquipmentDetailModal = ({ powerStationId, setShow, show, actionRef }) => {
  const { t } = useTranslation()

  const [equipmentgetTypeObject, setEquipmentgetTypeObject] = useState({})
  const [equipmentgettModelObject, setEquipmentgetModelObject] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [oldSelectedRowKeys, setOldSelectedRowKeys] = useState([])

  useEffect(() => {
    equipmentgetType()
    equipmentgetModel()
    getAlreadyBind()
  }, [])

  const onOk = async () => {
    const unBindIds = []

    oldSelectedRowKeys.forEach((id) => {
      if (!selectedRowKeys.includes(id)) {
        unBindIds.push(id)
      }
    })

    const { code, msg } = await apiDevice({
      apiMethod: 'bindDeviceStation',
      stationId: powerStationId,
      bindIds: selectedRowKeys.toString(),
      unBindIds: unBindIds.toString()
    })

    if (code !== '000000') {
      message.error(msg)
      return
    }
    actionRef.current?.reload()
    message.success(msg)
    setShow(false)
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

  const getAlreadyBind = async () => {
    const { data = [] } = await apiDevice({
      apiMethod: 'getDeviceList',
      station_id: powerStationId,
      pageNum: 1,
      pageSize: 1000
    })

    const array = data.map(({ id }) => id)
    setSelectedRowKeys(array)
    setOldSelectedRowKeys(array)
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
    }
  ]

  return (
    <Modal
      title={t('xinzeng')}
      open={show}
      width={1100}
      onOk={onOk}
      onCancel={() => {
        setShow(false)
      }}
    >
      <ProTable
        columns={columns}
        request={async (params = {}) => {
          const { data = [], page = {} } = await apiDevice({
            apiMethod: 'getDeviceList',
            un_station: 1,
            pageNum: 1,
            pageSize: 1000,
            station_id: powerStationId
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
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
          }
        }}
        scroll={{ y: 400 }}
        search={false}
        pagination={false}
        dateFormatter="string"
      />
    </Modal>
  )
}

export default EquipmentDetailModal
