<template>
  <div class="user-manage">
    <a-button class="add-btn" type="primary" @click="handleAdd">新增用户</a-button>
    <a-table class="user-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.id)">编辑</a>
        <a href="javascript:;" v-if="!userInfo.isAdmin" @click.stop="resetPassword(record.id)">重置密码</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.id)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit">
      <a-form :form="form">
        <a-form-item label="登录名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入登录名称" autocomplete="false" type="text" v-decorator="[
              'loginName',
              {rules: [{required: true, message: '请输入登录名称'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="用户名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入用户名称" autocomplete="false" type="text" v-decorator="[
              'name',
              {rules: [{required: true, message: '请输入用户名称'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="联系电话" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入联系电话" autocomplete="false" type="text" v-decorator="[
              'tel',
              {rules: [{required: true, message: '请输入联系电话'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="校区名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            placeholder="请选择校区名称"
            v-decorator="[
              'schoolId',
              {rules: [{ required: true, message: '请选择校区名称' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of campusData" :key="i">
              {{a.schoolName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-checkbox-group :options="roles" v-model="selectRoles" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { Base64 } from 'js-base64'
import { getUserList, deleteUser, getUser, saveUser, getSchoolAll, getRoleAll, resetPassword } from '@/config/api'

const columns = [
  {
    title: '登录名',
    dataIndex: 'loginName',
    align: 'center',
    key: 'loginName'
  },
  {
    title: '用户姓名',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  },
  {
    title: '校区',
    dataIndex: 'schoolName',
    align: 'center',
    key: 'schoolName'
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName'
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  data () {
    return {
      data: [],
      campusData: [],
      roles: [],
      selectRoles: [],
      columns,
      modalTitle: '新增用户',
      loading: false,
      showChange: false,
      lngLat: {},
      userInfo: {},
      reg: /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/,
      form: this.$form.createForm(this),
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        size: 'big',
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return `当前第${range[0]} - ${range[1]}条， 共${total}条记录`
        }
      }
    }
  },
  mounted () {
    try {
      this.userInfo = JSON.parse(Base64.decode(Base64.decode(window.localStorage.getItem('userInfo'))))
    } catch (e) {
      this.userInfo = {}
    }
    this.getUserList()
    this.getSchoolAll()
    this.getRoleAll()
  },
  methods: {
    resetPassword (userId) {
      resetPassword({ userId }).then(res => {
        res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
        this.getUserList()
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['loginName', 'name', 'tel', 'schoolId'], { force: true }, (err, values) => {
        if (err) return
        if (!this.reg.test(values.tel)) return this.$message.error('请输入正确的手机号')
        if (!this.selectRoles.length) return this.$message.error('请选择角色')
        saveUser({
          ...values,
          ...this.formData,
          roleIdList: JSON.stringify(this.selectRoles)
        }).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getUserList()
        })
      })
    },
    getSchoolAll () {
      getSchoolAll().then(res => {
        this.campusData = res.data
      })
    },
    getRoleAll () {
      getRoleAll().then(({ data }) => {
        this.roles = data.map(a => {
          return {
            value: a.id,
            label: a.role
          }
        }).filter(a => a.value !== 1)
      })
    },
    handleAdd () {
      this.formData = {}
      this.selectRoles = []
      this.modalTitle = '新增用户'
      this.form.setFieldsValue({ loginName: '' })
      this.form.setFieldsValue({ name: '' })
      this.form.setFieldsValue({ tel: '' })
      this.form.setFieldsValue({ schoolId: '' })
      this.showChange = true
    },
    openChange (id) {
      this.modalTitle = '编辑用户'
      this.showChange = true
      this.formData = {
        id
      }
      getUser({userId: id}).then(({ data }) => {
        this.form.setFieldsValue({ loginName: data.loginName })
        this.form.setFieldsValue({ name: data.name })
        this.form.setFieldsValue({ tel: data.tel })
        this.form.setFieldsValue({ schoolId: data.schoolId })
        this.selectRoles = data.roles.map(a => a.id)
      })
    },
    deleteUser (userId) {
      deleteUser({ userId }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getUserList()
      })
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '是的',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteUser(id)
        }
      })
    },
    getUserList () {
      this.loading = true
      getUserList({
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loading = false
        this.data = res.data.list.map(a => {
          return {
            id: a.id,
            loginName: a.loginName,
            name: a.name,
            schoolName: a.school && a.school.schoolName,
            roleName: a.roles.map(a => a.role).join(',')
          }
        })
        this.pagination.total = res.data.total
      })
    },
    pageChange ({ current, pageSize }) {
      this.pagination.page = current
      this.pagination.pageSize = pageSize
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
.user-manage {
  .user-table {
    margin-top: 20px;
  }
}
</style>
