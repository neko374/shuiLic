import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '',
    hidden: true,
    children: [
      {
        path: '',
        redirect: '/mainWiring',
        meta: { }
      }
    ]
  },
  {
    path: '/mainWiring',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/mainWiring/index'),
        name: 'Dashboard',
        meta: { title: '主接线', icon: 'icon-zhujiexiantu', affix: true }
      }
    ]
  },
  {
    path: '/energy',
    redirect: '/energy/battery',
    component: Layout,
    meta: { title: '储能电池', icon: 'icon-chunengxitong' },
    children: [
      {
        path: 'battery',
        component: () => import('@/views/energy/battery/index'),
        name: 'Battery',
        meta: { title: '锂电池组', icon: 'icon-lidianchi' }
      },
      {
        path: 'converter',
        component: () => import('@/views/energy/converter/index'),
        name: 'Converter',
        meta: { title: '储能变流器', icon: 'icon-chunengdanyuan' }
      },
      {
        path: 'management',
        component: () => import('@/views/energy/management/index'),
        name: 'energyManagement',
        meta: { title: '信息管理', icon: 'icon-xinxiguanli' }
      }
    ]
  },
  {
    path: '/photovoltaic',
    redirect: '/photovoltaic/monitor',
    component: Layout,
    meta: { title: '光伏发电', icon: 'icon-guangfufadianchang' },
    children: [
      {
        path: 'monitor',
        component: () => import('@/views/photovoltaic/monitor/index'),
        name: 'Monitor',
        meta: { title: '运行监测', icon: 'icon-yunhangjiance' }
      },
      {
        path: 'electric',
        component: () => import('@/views/photovoltaic/electric/index'),
        name: 'Electric',
        meta: { title: '电气监测', icon: 'icon-chunengdanyuan' }
      },
      {
        path: 'management',
        component: () => import('@/views/photovoltaic/management/index'),
        name: 'pvManagement',
        meta: { title: '信息管理', icon: 'icon-xinxiguanli' }
      }
    ]
  },
  {
    path: '/systemControl',
    component: Layout,
    meta: { title: '运行控制', icon: 'icon-xitongkongzhi' },
    children: [
      {
        path: 'operate',
        component: () => import('@/views/systemControl/operate/index'),
        name: 'Operate',
        meta: { title: '系统配置', icon: 'icon-yunhangcanshu' }
      },
      {
        path: 'control',
        component: () => import('@/views/systemControl/control/index'),
        name: 'Control',
        meta: { title: '系统控制', icon: 'icon-xitongkongzhi1' }
      }
    ]
  },
  {
    path: '/systemState',
    component: Layout,
    meta: { title: '运行记录', icon: 'icon-xitongzhuangtai' },
    children: [
      {
        path: 'operateLog',
        component: () => import('@/views/systemState/operateLog/index'),
        name: 'OperateLog',
        meta: { title: '操作记录', icon: 'icon-cz-jl' }
      },
      {
        path: 'zt',
        component: () => import('@/views/systemState/zt/index'),
        name: 'Zt',
        meta: { title: '状态记录', icon: 'icon-xitongkongzhi1' }
      }
    ]
  },
  {
    path: '/systemState1',
    component: Layout,
    meta: { title: '故障告警', icon: 'icon-xitongzhuangtai' },
    children: [
      {
        path: 'failure',
        component: () => import('@/views/systemState/failure/index'),
        name: 'Failure',
        meta: { title: '告警记录', icon: 'icon-guzhang' }
      }
    ]
  },
  {
    path: '/manipulation',
    component: Layout,
    meta: { title: '数据操作', icon: 'icon-datadisplay' },
    children: [
      {
        path: '',
        component: () => import('@/views/manipulation/history/index'),
        name: 'History',
        meta: { title: '历史库列表', icon: 'icon-lishi' }
      },
      {
        path: 'currentData',
        component: () => import('@/views/manipulation/currentData/index'),
        name: 'CurrentData',
        meta: { title: '实时库列表', icon: 'icon-shishishuju' }
      }
    ]
  },
  {
    path: '/sys2',
    component: Layout,
    meta: { title: '项目台账', icon: 'icon-xitongzhuangtai' },
    children: [
      {
        path: 'systemList',
        component: () => import('@/views/stations/systemList'),
        name: 'Failure1',
        meta: { title: '平台信息', icon: 'icon-cz-jl' }
      },
      {
        path: '/stations/projectInfo',
        component: () => import('@/views/stations/projectInfo'),
        name: 'Failure2',
        meta: { title: '项目信息', icon: 'icon-xinxiguanli' }
      },
      {
        path: 'stations',
        component: () => import('@/views/stations/stations'),
        name: 'Failure3',
        meta: { title: '设备台账管理', icon: 'icon-lishi' }
      },
      {
        path: '/protocolConfig/collector',
        component: () => import('@/views/protocolConfig/collector'),
        name: 'Failure4',
        meta: { title: '采集终端', icon: 'icon-tuoputu' }
      },
    ]
  },
  {
    path: '/systemState3',
    component: Layout,
    meta: { title: '系统拓扑', icon: 'icon-xitongzhuangtai' },
    children: [
      {
        path: 'systemRun',
        component: () => import('@/views/systemState/systemRun/index'),
        name: 'systemRun',
        meta: { title: '系统拓扑', icon: 'icon-tuoputu' }
      }
    ]
  },
  // {
  //   path: '/systemSetting',
  //   component: Layout,
  //   meta: { title: '系统设置', icon: 'icon-shuju' },
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/systemSetting/serve/index'),
  //       name: 'Serve',
  //       meta: { title: '服务设置', icon: 'icon-shuju' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
