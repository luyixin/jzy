<template>
  <div class="payment-manage">
    <select-box @onSearch="onSearch" hideOhter/>
    <a-table class="class-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.id, record)">编辑</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.id)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" title="修改收费记录" @ok="handleSubmit">
      <a-form :form="form">
        <a-form-item label="收费金额" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入收费金额" autocomplete="false" type="text" v-decorator="[
              'price',
              {rules: [{required: true, message: '请输入收费金额'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="收费人" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input disabled placeholder="请输入收费人" autocomplete="false" type="text" v-decorator="[
              'collectName',
              {rules: [{required: true, message: '请输入收费人'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import selectBox from '@/components/select_box'
import { getPaymentList, deletePayment, getPayment, savePayment } from '@/config/api'

const columns = [
  {
    title: '收费人',
    dataIndex: 'collectName',
    align: 'center',
    key: 'collectName'
  },
  {
    title: '录入人',
    dataIndex: 'createUser',
    align: 'center',
    key: 'createUser'
  },
  {
    title: '学生名字',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  },
  {
    title: '收费金额',
    dataIndex: 'price',
    align: 'center',
    key: 'price'
  },
  {
    title: '缴费时间',
    dataIndex: 'time',
    align: 'center',
    key: 'time'
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    selectBox
  },
  data () {
    return {
      columns,
      data: [],
      loading: false,
      showChange: false,
      form: this.$form.createForm(this),
      formData: {},
      queryObj: {},
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
    this.getPaymentList()
  },
  methods: {
    onSearch (queryObj = {}) {
      this.queryObj = queryObj
      this.pagination.page = 1
      this.getPaymentList()
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['price', 'collectName'], { force: true }, (err, values) => {
        if (err) return
        savePayment({
          ...this.formData,
          ...values
        }).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getPaymentList()
        })
      })
    },
    deletePayment (feesId) {
      deletePayment({ feesId }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getPaymentList()
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
          this.deletePayment(id)
        }
      })
    },
    openChange (id) {
      this.showChange = true
      this.formData = {
        id
      }
      getPayment({feesId: id}).then(({ data }) => {
        this.form.setFieldsValue({ price: data.price })
        this.form.setFieldsValue({ collectName: data.collectName })
      })
    },
    getPaymentList () {
      this.loading = true
      getPaymentList({
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize,
        ...this.queryObj
      }).then(res => {
        this.loading = false
        this.data = res.data.list.map(a => {
          return {
            id: a.id,
            time: a.time,
            collectName: a.collectName,
            createUser: a.inputUser.name,
            name: a.student ? a.student.name : '',
            price: a.price
          }
        })
        this.pagination.total = res.data.total
      })
    },
    pageChange ({ current, pageSize }) {
      this.pagination.page = current
      this.pagination.pageSize = pageSize
      this.getPaymentList()
    }
  }
}
</script>
<style lang="less" scoped>
.payment-manage {}
</style>
