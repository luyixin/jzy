<template>
  <div class="grade-manage">
    <a-button class="add-btn" type="primary" @click="handleAdd">新增年级</a-button>
    <a-table class="grade-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.id)">编辑</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.id)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit">
      <a-form :form="form">
        <a-form-item label="年级名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入年级名称" autocomplete="false" type="text" v-decorator="[
              'name',
              {rules: [{required: true, message: '请输入年级名字'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getGradeList, getGrade, deleteGrade, saveGrade } from '@/config/api'

const columns = [
  {
    title: '年级名称',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
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
      loading: false,
      showChange: false,
      form: this.$form.createForm(this),
      formData: {},
      modalTitle: '新增年级',
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
    this.getGradeList()
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['name'], { force: true }, (err, values) => {
        if (err) return
        saveGrade({
          ...values,
          ...this.formData
        }).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getGradeList()
        })
      })
    },
    handleAdd () {
      this.formData = {}
      this.modalTitle = '新增年级'
      this.showChange = true
      this.form.setFieldsValue({ name: '' })
    },
    openChange (id) {
      this.modalTitle = '修改年级'
      this.showChange = true
      this.formData = {
        id
      }
      getGrade({gradeId: id}).then(({ data }) => {
        this.form.setFieldsValue({ name: data.name })
      })
    },
    deleteGrade (gradeId) {
      deleteGrade({ gradeId }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getGradeList()
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
          this.deleteGrade(id)
        }
      })
    },
    getGradeList () {
      this.loading = true
      getGradeList({
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
      this.getGradeList()
    }
  }
}
</script>
<style lang="less" scoped>
.grade-manage {
  .add-btn {
    margin-bottom: 20px;
  }
}
</style>
