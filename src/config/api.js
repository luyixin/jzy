/*
* created by lu.yixin on 2019/02/23
*/

import request from '@/config/request'
import router from '@/config/router'

const baseUrl = 'http://dms.91xiangke.com/dms'

const requestWrapper = (method, url, params = {}) => {
  return new Promise((resolve, reject) => {
    request[method](url, params).then(res => {
      if (res.code === 509) return router.replace('/login')
      resolve(res)
    })
  })
}

// 登录
export const login = params => requestWrapper('get', `${baseUrl}/api/user/login`, params)

// 修改密码 POST /api/user/updatePassword
export const updatePassword = params => requestWrapper('post', `${baseUrl}/api/user/updatePassword`, params)

// 获取所有校区 POST /api/school/lists
export const getSchoolAll = params => requestWrapper('post', `${baseUrl}/api/school/lists`, params)

// 获取校区列表
export const getSchoolList = params => requestWrapper('post', `${baseUrl}/api/school/list`, params)

// 删除校区
export const deleteSchool = params => requestWrapper('get', `${baseUrl}/api/school/remove`, params)

// 保存校区
export const saveSchool = params => requestWrapper('post', `${baseUrl}/api/school/save`, params)

// 获取单个校区
export const getSchool = params => requestWrapper('get', `${baseUrl}/api/school/getSchoolById`, params)

// 获取所有角色 POST /api/role/getLists
export const getRoleAll = params => requestWrapper('post', `${baseUrl}/api/role/getLists`, params)

// 获取角色分页
export const getRoleList = params => requestWrapper('post', `${baseUrl}/api/role/getPageLists`, params)

// 删除角色
export const deleteRole = params => requestWrapper('get', `${baseUrl}/api/role/remove`, params)

// 获取单个角色
export const getRole = params => requestWrapper('get', `${baseUrl}/api/role/getRoleById`, params)

// 保存单个角色
export const saveRole = params => requestWrapper('post', `${baseUrl}/api/role/save`, params)

// 获取所有年级 POST /api/grade/getLists
export const getGradeAll = params => requestWrapper('post', `${baseUrl}/api/grade/getLists`, params)

// 获取所有年级分页 POST /api/grade/getPageList
export const getGradeList = params => requestWrapper('post', `${baseUrl}/api/grade/getPageList`, params)

// 获取单个年级 GET /api/grade/getGradeById
export const getGrade = params => requestWrapper('get', `${baseUrl}/api/grade/getGradeById`, params)

// 删除年级 GET /api/grade/remove
export const deleteGrade = params => requestWrapper('get', `${baseUrl}/api/grade/remove`, params)

// 保存年级POST /api/grade/save
export const saveGrade = params => requestWrapper('post', `${baseUrl}/api/grade/save`, params)

// 获取所有班级 POST /api/class/getPageList
export const getClassList = params => requestWrapper('post', `${baseUrl}/api/class/getPageList`, params)

// 获取当前校区全部班级，不分页 POST /api/class/getList
export const getAllClassList = params => requestWrapper('post', `${baseUrl}/api/class/getList`, params)

// 获取单个班级GET /api/class/getClassesById
export const getClass = params => requestWrapper('get', `${baseUrl}/api/class/getClassesById`, params)

// 删除班级 GET /api/class/remove
export const deleteClass = params => requestWrapper('get', `${baseUrl}/api/class/remove`, params)

// 保存班级 POST /api/class/save
export const saveClass = params => requestWrapper('post', `${baseUrl}/api/class/save`, params)

// 获取咨询单列表
export const getConsultList = params => requestWrapper('post', `${baseUrl}/api/consult/getListByPage`, params)

// 查询单个咨询单 GET /api/consult/getEntityById
export const getConsult = params => requestWrapper('get', `${baseUrl}/api/consult/getEntityById`, params)

// 删除咨询单 GET /api/consult/deleteById
export const deleteConsult = params => requestWrapper('get', `${baseUrl}/api/consult/deleteById`, params)

// 保存咨询单 POST /api/consult/save
export const saveConsult = params => requestWrapper('post', `${baseUrl}/api/consult/save`, params)

// 获取咨询单跟进信息
export const getFollowList = params => requestWrapper('post', `${baseUrl}/api/follow/getList`, params)

// 获取所有用户 POST /api/user/getList
export const getUserAll = params => requestWrapper('post', `${baseUrl}/api/user/getList`, params)

// 获取所有用户分页 POST /api/user/getPageList
export const getUserList = params => requestWrapper('post', `${baseUrl}/api/user/getPageList`, params)

// 删除用户 GET /api/user/remove
export const deleteUser = params => requestWrapper('get', `${baseUrl}/api/user/remove`, params)

// 根据用户ID查询用户 GET /api/user/getUserById
export const getUser = params => requestWrapper('get', `${baseUrl}/api/user/getUserById`, params)

// 保存用户 POST /api/user/save POST
export const saveUser = params => requestWrapper('post', `${baseUrl}/api/user/save`, params)

// 重置密码 GET /api/user/resetPassword
export const resetPassword = params => requestWrapper('get', `${baseUrl}/api/user/resetPassword`, params)

// 设置提醒 POST /api/business/save
export const saveBusiness = params => requestWrapper('post', `${baseUrl}/api/business/save`, params)

// 保存咨询单跟进信息 POST /api/follow/save
export const saveFollow = params => requestWrapper('post', `${baseUrl}/api/follow/save`, params)

// 查询字典 POST /api/sysCode/getSysCodeList
export const getDictionaryList = params => requestWrapper('post', `${baseUrl}/api/sysCode/getSysCodeList`, params)

// 保存字典表 POST /api/sysCode/save
export const saveDictionary = params => requestWrapper('post', `${baseUrl}/api/sysCode/save`, params)

// 查询单个字典 POST /api/sysCode/getSysCodeByValue
export const getDictionary = params => requestWrapper('post', `${baseUrl}/api/sysCode/getSysCodeByValue`, params)

// 删除字典 GET /api/sysCode/deleteByValue
export const deleteDictionary = params => requestWrapper('get', `${baseUrl}/api/sysCode/deleteByValue`, params)

// 获取字典表单个字段 GET /api/sysCode/getSysCodeByPent
export const getDictionarySingle = params => requestWrapper('get', `${baseUrl}/api/sysCode/getSysCodeByPent`, params)

// 获取学生分页 POST /api/student/getPageList
export const getStudentList = params => requestWrapper('post', `${baseUrl}/api/student/getPageList`, params)

// 删除学生GET /api/student/remove
export const deleteStudent = params => requestWrapper('get', `${baseUrl}/api/student/remove`, params)

// 查询单个学生 GET /api/student/getStudentById
export const getStudentSingle = params => requestWrapper('get', `${baseUrl}/api/student/getStudentById`, params)

// 保存学生 POST /api/student/save
export const saveStudent = params => requestWrapper('post', `${baseUrl}/api/student/save`, params)

// 获取收费列表 POST /api/fees/getListByPage
export const getPaymentList = params => requestWrapper('post', `${baseUrl}/api/fees/getListByPage`, params)

// 查询单个收费 GET /api/fees/getById
export const getPayment = params => requestWrapper('get', `${baseUrl}/api/fees/getById`, params)

// 删除收费 GET /api/fees/deleteById
export const deletePayment = params => requestWrapper('get', `${baseUrl}/api/fees/deleteById`, params)

// 保存收费 POST /api/fees/save
export const savePayment = params => requestWrapper('post', `${baseUrl}/api/fees/save`, params)

// 统计收费 POST /api/statistics/getFees
export const getFees = params => requestWrapper('post', `${baseUrl}/api/statistics/getFees`, params)

// 咨询单统计 POST /api/statistics/getConsult
export const getConsultStatistics = params => requestWrapper('post', `${baseUrl}/api/statistics/getConsult`, params)

// 学生统计 POST /api/statistics/getStudent
export const getStudentStatistics = params => requestWrapper('post', `${baseUrl}/api/statistics/getStudent`, params)

// 营销参数统计 POST /api/statistics/getMarketing
export const getMarketing = params => requestWrapper('post', `${baseUrl}/api/statistics/getMarketing`, params)
