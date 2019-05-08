<template>
  <div class="dictionary-economy">
    <a-radio-group v-model="tab" @change="changeTab">
      <a-radio-button value="1005">经济状况</a-radio-button>
      <a-radio-button value="1004">价格敏感度</a-radio-button>
      <a-radio-button value="1003">放弃原因</a-radio-button>
      <a-radio-button value="1002">来源</a-radio-button>
    </a-radio-group>
    <div class="btn-box">
      <a-button class="add-btn" type="primary" @click="handleAdd">新增</a-button>
    </div>
    <a-table class="dictionary-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.value, record)">编辑</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.value)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit">
      <a-form :form="form">
        <a-form-item label="字段名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入字典表字段名称" autocomplete="false" type="text" v-decorator="[
              'name',
              {rules: [{required: true, message: '请输入字典表字段名称'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getDictionaryList, saveDictionary, getDictionary, deleteDictionary } from '@/config/api'

const columns = [
  {
    title: '字典ID',
    dataIndex: 'value',
    align: 'center',
    key: 'value'
  },
  {
    title: '名称',
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
      modalTitle: '新增',
      tab: '1005',
      formData: {},
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
    this.getDictionaryList()
  },
  methods: {
    changeTab () {
      this.pagination.page = 1
      this.pagination.pageSize = 20
      this.getDictionaryList()
    },
    openChange (value) {
      this.modalTitle = '修改'
      this.showChange = true
      this.formData = {
        value
      }
      getDictionary({ value }).then(({ data }) => {
        this.form.setFieldsValue({ name: data.name })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['name'], { force: true }, (err, values) => {
        if (err) return
        saveDictionary({
          pid: this.tab,
          ...this.formData,
          ...values
        }).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getDictionaryList()
        })
      })
    },
    deleteDictionary (value) {
      deleteDictionary({ value }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getDictionaryList()
      })
    },
    showDeleteConfirm (value) {
      this.$confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '是的',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteDictionary(value)
        }
      })
    },
    handleAdd () {
      this.modalTitle = '新增'
      this.showChange = true
      this.formData = {}
      this.form.setFieldsValue({ name: '' })
    },
    getDictionaryList () {
      this.loading = true
      getDictionaryList({
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize,
        pid: this.tab
      }).then(res => {
        this.loading = false
        this.data = res.data.list.map(a => {
          return {
            pid: a.pid,
            value: a.value,
            name: a.name
          }
        })
        this.pagination.total = res.data.total
      })
    },
    pageChange ({ current, pageSize }) {
      this.pagination.page = current
      this.pagination.pageSize = pageSize
      this.getDictionaryList()
    }
  }
}
</script>
<style lang="less" scoped>
.dictionary-economy {
  .btn-box {
    margin-top: 20px;
  }
  .dictionary-table {
    margin-top: 20px;
  }
}
</style>
