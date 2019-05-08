<template>
  <div class="role-manage">
    <a-button class="add-btn" type="primary" @click="handleAdd">新增角色</a-button>
    <a-table class="role-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" v-if="record.systemRole && record.role !=='超级管理员'" @click.stop="openChange(record.id)">编辑</a>
        <a href="javascript:;" v-if="record.systemRole" @click.stop="showDeleteConfirm(record.id)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit">
      <a-form :form="form">
        <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入角色名称" autocomplete="false" type="text" v-decorator="[
              'role',
              {rules: [{required: true, message: '请输入角色名称'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
      </a-form>
      <a-tree
        checkable
        :autoExpandParent="autoExpandParent"
        v-model="checkedKeys"
        @check="onCheck"
        :treeData="treeData"
      />
    </a-modal>
  </div>
</template>
<script>
import { getRoleList, deleteRole, getRole, saveRole } from '@/config/api'

const columns = [
  {
    title: '角色名称',
    dataIndex: 'role',
    align: 'center',
    key: 'role'
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const treeData = [
  {
    title: '用户管理',
    key: 12
  },
  {
    title: '营销参数管理',
    key: 13
  },
  {
    title: '学校管理',
    key: '0-0',
    children: [
      { title: '校区管理', key: 1 },
      { title: '年级管理', key: 2 },
      { title: '班级管理', key: 3 },
      { title: '角色管理', key: 4 }
    ]
  },
  {
    title: '咨询单管理',
    key: 5
  },
  {
    title: '学生管理',
    key: '0-2',
    children: [
      { title: '学生管理', key: 6 },
      { title: '交费管理', key: 7 }
    ]
  },
  {
    title: '交费管理',
    key: 8
  },
  {
    title: '统计',
    key: '0-3',
    children: [
      { title: '交费统计', key: 9 },
      { title: '学生统计', key: 10 },
      { title: '咨询单统计', key: 11 },
      { title: '营销参数统计', key: 14 }
    ]
  }
]

export default {
  data () {
    return {
      columns,
      treeData,
      autoExpandParent: true,
      checkedKeys: [],
      data: [],
      userInfo: {},
      modalTitle: '新增角色',
      loading: false,
      showChange: false,
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
    this.getRoleList()
  },
  methods: {
    onCheck (checkedKeys, info) {
      this.checkedKeys = checkedKeys
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['role'], { force: true }, (err, values) => {
        if (err) return
        if (!this.checkedKeys.length) return this.$message.error('请选择角色权限')
        saveRole({
          ...this.userInfo,
          ...values,
          menuIdList: JSON.stringify(this.checkedKeys.filter(a => !isNaN(a)))
        }).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getRoleList()
        })
      })
    },
    openChange (roleId) {
      this.modalTitle = '编辑角色'
      this.showChange = true
      getRole({ roleId }).then(({ data }) => {
        this.userInfo.id = data.id
        this.form.setFieldsValue({ role: data.role })
        this.checkedKeys = data.menuIdList.split(',').map(a => +a)
      })
    },
    handleAdd () {
      this.modalTitle = '新增角色'
      this.showChange = true
      this.form.setFieldsValue({ role: '' })
      this.checkedKeys = []
      this.userInfo = {}
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '是的',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteRole(id)
        }
      })
    },
    deleteRole (roleId) {
      deleteRole({ roleId }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getRoleList()
      })
    },
    getRoleList () {
      this.loading = true
      getRoleList({
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loading = false
        this.data = res.data.list
        this.pagination.total = res.data.total
      })
    },
    pageChange ({ current, pageSize }) {
      this.pagination.page = current
      this.pagination.pageSize = pageSize
      this.getSchoolList()
    }
  }
}
</script>
<style lang="less" scoped>
.role-manage {
  .role-table {
    margin-top: 20px;
  }
}
</style>
