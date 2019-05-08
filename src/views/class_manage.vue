<template>
  <div class="class-manage">
    <a-button class="add-btn" type="primary" @click="handleAdd">新增班级</a-button>
    <a-table class="class-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.id, record)">编辑</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.id)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit">
      <a-form :form="form">
        <a-form-item label="班级名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入班级名称" autocomplete="false" type="text" v-decorator="[
              'name',
              {rules: [{required: true, message: '请输入班级名称'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="年级名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            placeholder="请选择年级名称"
            v-decorator="[
              'gradeId',
              {rules: [{ required: true, message: '请选择年级名称' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of gradeData" :key="i">
              {{a.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="负责老师" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            placeholder="请选择负责老师"
            v-decorator="[
              'teacherId',
              {rules: [{ required: true, message: '请选择负责老师' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of teacherData" :key="i">
              {{a.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getClassList, getClass, deleteClass, saveClass, getGradeAll, getUserAll } from '@/config/api'

const columns = [
  {
    title: '班级名称',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  },
  {
    title: '所属年级',
    dataIndex: 'gradeName',
    align: 'center',
    key: 'gradeName'
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
      columns,
      data: [],
      gradeData: [],
      teacherData: [],
      loading: false,
      showChange: false,
      form: this.$form.createForm(this),
      formData: {},
      modalTitle: '新增班级',
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
    this.getClassList()
    this.getGradeAll()
    this.getUserAll()
  },
  methods: {
    getUserAll () {
      getUserAll().then(res => {
        this.teacherData = res.data
      })
    },
    getGradeAll () {
      getGradeAll().then(res => {
        this.gradeData = res.data
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['name', 'gradeId', 'teacherId'], { force: true }, (err, values) => {
        if (err) return
        saveClass({
          ...this.formData,
          ...values
        }).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getClassList()
        })
      })
    },
    handleAdd () {
      this.formData = {}
      this.modalTitle = '新增班级'
      this.showChange = true
      this.form = this.$form.createForm(this)
    },
    deleteClass (classesId) {
      deleteClass({ classesId }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getClassList()
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
          this.deleteClass(id)
        }
      })
    },
    openChange (id) {
      this.modalTitle = '修改班级'
      this.showChange = true
      this.formData = {
        id
      }
      getClass({classesId: id}).then(({ data }) => {
        this.form.setFieldsValue({ name: data.name })
        this.form.setFieldsValue({ gradeId: data.gradeId })
        this.form.setFieldsValue({ teacherId: data.teacherId })
      })
    },
    getClassList () {
      this.loading = true
      getClassList({
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loading = false
        this.data = res.data.list.map(a => {
          return {
            id: a.id,
            name: a.name,
            gradeName: a.grade ? a.grade.name : ''
          }
        })
        this.pagination.total = res.data.total
      })
    },
    pageChange ({ current, pageSize }) {
      this.pagination.page = current
      this.pagination.pageSize = pageSize
      this.getClassList()
    }
  }
}
</script>
<style lang="less" scoped>
.class-manage {
  .class-table {
    margin-top: 20px;
  }
}
</style>
