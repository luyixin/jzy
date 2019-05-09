import Vue from 'vue'
import Router from 'vue-router'
import { Base64 } from 'js-base64'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'App',
    component: () => import('@/App'),
    redirect: () => !window.localStorage.getItem('userInfo') && '/login',
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login')
      },
      {
        path: '/recover',
        name: 'Recover',
        component: () => import('@/views/recover')
      },
      {
        path: '/base',
        name: 'Base',
        meta: {
          name: '主页',
          path: 'base'
        },
        component: () => import('@/views/base'),
        children: [
          {
            path: 'user/user_manage',
            name: 'UserManage',
            meta: {
              id: 12,
              name: '用户管理',
              iconType: 'team',
              fullPath: '/base/user/user_manage',
              path: 'user_manage'
            },
            component: () => import('@/views/user_manage')
          },
          {
            path: 'dictionary/dictionary_base',
            name: 'DictionaryBase',
            meta: {
              id: 13,
              name: '营销参数管理',
              iconType: 'database',
              fullPath: '/base/dictionary/dictionary_base',
              path: 'dictionary_base'
            },
            component: () => import('@/views/dictionary_base')
          },
          {
            path: 'school',
            name: 'School',
            meta: {
              name: '学校管理',
              iconType: 'home',
              key: 'school',
              path: 'base/school'
            },
            component: {
              template: '<router-view/>'
            },
            children: [
              {
                path: 'campus_manage',
                name: 'CampusManage',
                meta: {
                  id: 1,
                  name: '校区管理',
                  path: 'campus_manage',
                  fullPath: '/base/school/campus_manage'
                },
                component: () => import('@/views/campus_manage')
              },
              {
                path: 'grade_manage',
                name: 'GradeManage',
                meta: {
                  id: 2,
                  name: '年级管理',
                  path: 'grade_manage',
                  fullPath: '/base/school/grade_manage'
                },
                component: () => import('@/views/grade_manage')
              },
              {
                path: 'class_manage',
                name: 'ClassManage',
                meta: {
                  id: 3,
                  name: ' 班级管理',
                  path: 'class_manage',
                  fullPath: '/base/school/class_manage'
                },
                component: () => import('@/views/class_manage')
              },
              {
                path: 'role_manage',
                name: 'RoleManage',
                meta: {
                  id: 4,
                  name: '角色管理',
                  path: 'role_manage',
                  fullPath: '/base/school/role_manage'
                },
                component: () => import('@/views/role_manage')
              }
            ]
          },
          {
            path: 'receipt/receipt_manage',
            name: 'ReceiptManage',
            meta: {
              id: 5,
              name: '咨询单管理',
              iconType: 'file-text',
              fullPath: '/base/receipt/receipt_manage',
              path: 'receipt_manage'
            },
            component: () => import('@/views/receipt_manage')
          },
          {
            path: 'student',
            name: 'Student',
            meta: {
              name: '学生管理',
              iconType: 'team',
              key: 'student',
              path: 'base/student'
            },
            component: {
              template: '<router-view/>'
            },
            children: [
              {
                path: 'audition_manage',
                name: 'AuditionManage',
                meta: {
                  id: 6,
                  name: '试听学员',
                  path: 'audition_manage',
                  fullPath: '/base/student/audition_manage'
                },
                component: () => import('@/views/audition_manage')
              },
              {
                path: 'student_manage',
                name: 'StudentManage',
                meta: {
                  id: 7,
                  name: '正式学员',
                  path: 'student_manage',
                  fullPath: '/base/student/student_manage'
                },
                component: () => import('@/views/student_manage')
              }
            ]
          },
          {
            path: 'payment/payment_manage',
            name: 'PaymentManage',
            meta: {
              name: '交费管理',
              id: 8,
              iconType: 'red-envelope',
              fullPath: '/base/payment/payment_manage',
              path: 'payment_manage'
            },
            component: () => import('@/views/payment_manage')
          },
          {
            path: 'statistical',
            name: 'Statistical',
            meta: {
              name: '统计',
              iconType: 'stock',
              key: 'statistical',
              path: 'base/statistical'
            },
            component: {
              template: '<router-view/>'
            },
            children: [
              {
                path: 'statistical_payment',
                name: 'StatisticalPayment',
                meta: {
                  id: 9,
                  name: '交费统计',
                  path: 'statistical_payment',
                  fullPath: '/base/statistical/statistical_payment'
                },
                component: () => import('@/views/statistical_payment')
              },
              {
                path: 'statistical_student',
                name: 'StatisticalStudent',
                meta: {
                  id: 10,
                  name: '学员统计',
                  path: 'statistical_student',
                  fullPath: '/base/statistical/statistical_student'
                },
                component: () => import('@/views/statistical_student')
              },
              {
                path: 'statistical_advisory',
                name: 'StatisticalAdvisory',
                meta: {
                  id: 11,
                  name: '咨询单统计',
                  path: 'statistical_advisory',
                  fullPath: '/base/statistical/statistical_advisory'
                },
                component: () => import('@/views/statistical_advisory')
              },
              {
                path: 'statistical_marketing',
                name: 'StatisticalMarketing',
                meta: {
                  id: 14,
                  name: '营销参数统计',
                  path: 'statistical_marketing',
                  fullPath: '/base/statistical/statistical_marketing'
                },
                component: () => import('@/views/statistical_marketing')
              }
            ]
          }
        ]
      }
    ]
  }
]
const router = new Router({ routes })

function redirectUrl (routes, menusId) {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].meta && routes[i].meta.id && menusId.includes(routes[i].meta.id)) {
      return router.replace(routes[i].meta.fullPath)
    }
    routes[i].children && redirectUrl(routes[i].children, menusId)
  }
}

router.afterEach((to, from) => {
  const userInfo = window.localStorage.getItem('userInfo')
  if (!userInfo) return
  try {
    const menusId = JSON.parse(Base64.decode(Base64.decode(userInfo))).menus.map(a => +a)
    to.fullPath !== '/login' && to.fullPath !== '/recover' && to.meta.id !== menusId[0] && !menusId.includes(to.meta.id) && redirectUrl(routes, menusId)
  } catch (e) {
    router.replace('/login')
  }
})

export default router
