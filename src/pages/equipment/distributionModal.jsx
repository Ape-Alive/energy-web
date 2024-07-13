import { Modal, Select, message } from 'antd'
import { useState, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { apiBase, apiDevice } from '@/services/api'

const { Option } = Select

const DistributionModal = ({ show, setShow, record, actionRef }) => {
  const { t } = useTranslation()
  const [list, setList] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    getClientList()
  }, [])

  const getClientList = async () => {
    const { data = [] } = await apiBase({
      apiMethod: 'getClientList',
      pageNum: 1,
      pageSize: 500
    })

    setList(data)
  }

  const onOk = async () => {
    if (!value) {
      message.error(t('qingxuanze'))
      return
    }

    const { code, msg } = await apiDevice({
      apiMethod: 'updateDeviceInfo',
      client_id: value,
      id: record.id
    })
    if (code !== '000000') {
      message.error(msg)
      return
    }
    actionRef.current?.reload()
    message.success(msg)
    setShow(false)
  }

  return (
    <Modal
      title={t('jiangshebeifenpeigeikehu')}
      open={show}
      onCancel={() => {
        setShow(false)
      }}
      onOk={onOk}
    >
      <div>{t('qingxuanzekehufenpeishebei')}</div>
      <div>
        <Select
          value={value}
          allowClear
          style={{ width: 300, marginTop: 10 }}
          onChange={(value) => {
            setValue(value)
          }}
        >
          {list.map((info) => {
            return (
              <Option value={info.id} key={info.id}>
                {info.title}
              </Option>
            )
          })}
        </Select>
      </div>
    </Modal>
  )
}

export default DistributionModal
