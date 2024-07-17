import Footer from '@/components/Footer'
import RightContent from '@/components/RightContent'
import { apiUserInfo } from '@/services/api'
import { PageLoading } from '@ant-design/pro-layout'
import { history } from 'umi'
// import { version } from '../config/version'
// import { menuTree } from './services/account'
const isDev = process.env.NODE_ENV === 'development'
import {
  getToken
} from '@/utils/authority'

const loginPath = '/user/login'
// const registerPath = '/user/Register'
// const forgetPasswordPath = '/user/ForgetPassword'
import { useTranslation } from 'react-i18next'
import zh from '@/i18n/zh.json'
import en from '@/i18n/en.json'
import './i18n/config'
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />
}
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  //获取用户信息
  const fetchUserInfo = async () => {
    try {
      const msg = await apiUserInfo()
      console.log(msg)
      // try {
      //   //category=0代表超级管理员
      //   if (
      //     msg &&
      //     msg.data &&
      //     msg.data.role &&
      //     msg.data.role.category &&
      //     msg.data.role.category !== '0'
      //   ) {
      //     const roleInfo = await menuTree()
      //     const roleList = roleInfo.data || []
      //     return { ...msg.data, roleList }
      //   }
      // } catch (error) {
      //   history.push(loginPath)
      // }
      return msg.data
    } catch (error) {
      history.push(loginPath)
    }

    return undefined
  } // 如果是登录页面，不执行

  // const fetchMenu = async (roleId) => {
  //   const { data = [] } = await apiBase({
  //     apiMethod: 'getRoleMenuList',
  //     roleId
  //   })

  //   return data
  // }
  // if (
  //   history.location.pathname !== loginPath &&
  //   history.location.pathname !== registerPath &&
  //   history.location.pathname !== forgetPasswordPath
  // ) 
  if(getToken()){
    try {
      const currentUser = await fetchUserInfo()
      return {
        fetchUserInfo,
        // menuList,
        currentUser,
        settings: {}
      }
    } catch (error) {
      console.error(error)
    }
   

    // const menuList = await fetchMenu(currentUser.roleId)

    
  }

  return {
    fetchUserInfo,
    settings: {}
  }
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent initialState={initialState} />,
    routes: [],
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history // 如果没有登录，重定向到 login

      if (
        !initialState?.currentUser &&
        location.pathname !== loginPath &&
        location.pathname !== registerPath &&
        location.pathname !== forgetPasswordPath
      ) {
        history.push(loginPath)
      } else if (location.pathname === '/') {
        history.replace('/home')
      }
    },
    menuDataRender: (data) => {
      let json = {}
      const key = localStorage.getItem('language') || 'en'

      if (key === 'en') {
        json = en
      }
      if (key === 'zh') {
        json = zh
      }

      const changeNamge = (list) => {
        return list.map((value) => {
          const obj = { ...value, name: json[value.name] || '' }
          if (value.children) {
            obj.children = changeNamge(obj.children)
          }
          return obj
        })
      }
      const menuList = changeNamge(data)

      return menuList
    },
    links: isDev ? [] : [],

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
    ...initialState?.settings
  }
}
