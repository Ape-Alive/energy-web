import { Form, Input, Row, Col, TreeSelect, Modal, message, Select } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { apiBase, apiDevice } from '@/services/api'
import clientRoutes from '../../../config/routes'
import { Trans, useTranslation } from 'react-i18next'

const { Option } = Select

const RoleDetailModal = ({ show, setShow, actionRef, record = {} }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  useEffect(() => {
    record.roleId && getData()
    record.roleId && form.setFieldsValue({ ...record, name: record.roleName })
  }, [])

  const getData = async () => {
    const { data } = await apiBase({
      apiMethod: 'getRoleMenuList',
      roleId: record.roleId
    })
    form.setFieldsValue({
      data: data.map((value) => {
        return JSON.stringify({ path: value.path, authority: value.authority })
      })
    })
  }

  const onOk = async () => {
    form.validateFields().then(async (values) => {
      values.data = [...values.data].map((str) => {
        return JSON.parse(str)
      })
      if (record.roleId) {
        const { code, msg } = await apiBase({
          ...record,
          ...values,
          apiMethod: 'updateRole'
        })
        if (code !== '000000') {
          message.error(msg)
          return
        }
        message.success(msg)
      }
      if (!record.roleId) {
        const { code, msg } = await apiBase({
          ...values,
          apiMethod: 'addRole'
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

  const addReadOnlyOptions = (routes) => {
    return routes.map((route) => {
      if (route.component !== './404') {
        if (route.routes) {
          // 如果存在子路由，则递归处理子路由
          // 1查看，2操作，3全部
          return {
            path: JSON.stringify({ path: `${route.path}`, authority: '3' }),
            name: t(route.name),
            routes: addReadOnlyOptions(route.routes)
          }
        } else {
          if (
            route.path === '/client' ||
            route.path === '/powerStation' ||
            route.path === '/powerStationDetail' ||
            route.path === '/equipment' ||
            route.path === '/UserManage/RoleManageList' ||
            route.path === '/UserManage/UserManageList' ||
            route.path === '/UserManage/LogList' ||
            route.path === '/equipmentType'
          ) {
            return {
              name: t(t(route.name)),
              path: JSON.stringify({
                path: `${route.path}`,
                authority: '3'
              }),
              routes: [
                {
                  name: t(route.name) + t('chakan'),
                  path: JSON.stringify({
                    path: `${route.path}`,
                    authority: '1'
                  }),
                  isLeaf: true
                },
                {
                  name: t(route.name) + t('caozuo'),
                  path: JSON.stringify({
                    path: `${route.path}`,
                    authority: '2'
                  }),
                  isLeaf: true
                }
              ]
            }
          } else {
            return {
              name: t(route.name),
              path: JSON.stringify({
                path: `${route.path}`,
                authority: '3'
              })
            }
          }
        }
      }
    })
  }

  const _clientRoutes = clientRoutes.filter((info) => {
    return (
      info.path !== '/user' &&
      info.path !== '/Personal' &&
      info.path !== '/UserManage/LogList' &&
      // info.path !== '/UserManage' &&
      info.path !== '/Fixpassword' &&
      info.path !== '/DomainList/DomainDetail'
    )
  })

  const routerEnum = [
    { path: '', name: t('quanbu'), routes: addReadOnlyOptions(_clientRoutes) }
  ]

  return (
    <Modal
      title={record.roleId ? t('bianji') : t('xinzeng')}
      open={show}
      width={600}
      onOk={onOk}
      onCancel={() => {
        setShow(false)
      }}
    >
      <Form form={form} {...layout}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="name"
              label={t('jusemingcheng')}
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
            <Form.Item name="data" label={t('quanxian')}>
              <TreeSelect
                treeData={routerEnum}
                fieldNames={{
                  label: 'name',
                  value: 'path',
                  children: 'routes'
                }}
                treeCheckable={true}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="note" label={t('beizhu')}>
              <Input.TextArea rows={3} placeholder="" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default RoleDetailModal
