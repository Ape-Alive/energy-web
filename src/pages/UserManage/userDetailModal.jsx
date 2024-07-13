import { Form, Input, Row, Col, Modal, message, Select } from 'antd'

import { useEffect, useState } from 'react'
import { apiBase } from '@/services/api'

import { Trans, useTranslation } from 'react-i18next'
import md5 from 'MD5'
import { timeZone } from '@/utils/enum'

const { Option } = Select

const UserDetailModal = ({ show, setShow, actionRef, record = {} }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const [roleList, setRoleList] = useState([])
  const [dataValue, setDataValue] = useState({})

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  useEffect(() => {
    getRoleList()
    record.userId && getData()
  }, [])

  const getData = async () => {
    const { data } = await apiBase({
      apiMethod: 'getUserInfo',
      userId: record.userId
    })
    setDataValue(data)
    form.setFieldsValue(data)
  }

  const getRoleList = async () => {
    const { data } = await apiBase({
      apiMethod: 'getRoleNameList'
    })
    setRoleList(data)
  }

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      const utc_offsets = values.utc_name.split('UTC')[1].split(' ')[0] + ':00'
      values.utc_offsets = utc_offsets

      if (record.userId) {
        const { code, msg } = await apiBase({
          ...dataValue,
          ...values,
          apiMethod: 'updateUser'
        })
        if (code !== '000000') {
          message.error(msg)
          return
        }
        message.success(msg)
      }
      if (!record.userId) {
        const { code, msg } = await apiBase({
          ...values,
          password: md5('123456'),
          apiMethod: 'createUser'
        })
        if (code !== '000000') {
          message.error(msg)
          return
        }
        message.success(msg)
      }

      actionRef.current?.reload()
      setShow(false)
    })
  }

  return (
    <Modal
      title={record.roleId ? t('bianji') : t('xinzeng')}
      open={show}
      width={700}
      onOk={onOk}
      onCancel={() => {
        setShow(false)
      }}
    >
      <Form form={form} {...layout}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="userName"
              label={t('yonghuming_youxiang')}
              rules={[
                {
                  required: true,
                  message: t('qingshuru')
                }
              ]}
            >
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="roleId"
              label={t('juese')}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select allowClear>
                {roleList.map((info) => {
                  return <Option value={info.roleId}>{info.roleName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="firstName" label={t('xing')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="lastName" label={t('ming')}>
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="utc_name"
              label={t('shiqv')}
              rules={[
                {
                  required: true,
                  message: t('qingxuanze')
                }
              ]}
            >
              <Select allowClear>
                {timeZone.map((val) => {
                  return <Option value={val}>{t(val)}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email"
              label={t('email_')}
              rules={[
                {
                  pattern:
                    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: t('youxianggeshicuowu')
                }
              ]}
            >
              <Input placeholder="" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="i18n" label={t('yuyan')}>
              <Select allowClear>
                <Option value="zh">zh</Option>
                <Option value="en">en</Option>
              </Select>
            </Form.Item>
          </Col>
          <div style={{ marginLeft: 70 }}>{t('chushimima')}：123456</div>
        </Row>
      </Form>
    </Modal>
  )
}

export default UserDetailModal
