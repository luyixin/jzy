<template>
  <div class="campus-manage">
    <a-button class="add-btn" type="primary" @click="handleAdd">新增校区</a-button>
    <a-table class="campus-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.id)">编辑</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.id)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit">
      <a-form :form="form">
        <a-form-item label="校区名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入校区名称" autocomplete="false" type="text" v-decorator="[
              'schoolName',
              {rules: [{required: true, message: '请输入校区名字'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="校长名字" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入校长名字" autocomplete="false" type="text" v-decorator="[
              'principalId',
              {rules: [{required: true, message: '请输入校长名字'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="校区位置" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请点击选择地理位置" disabled autocomplete="false" type="text" v-decorator="[
              'address',
              {rules: [{required: true, message: '请点击选择地理位置'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
      </a-form>
      <a-map ref="map" @updateAddress="updateAddress" :lngLat="lngLat"/>
    </a-modal>
  </div>
</template>
<script>
import { getSchoolList, deleteSchool, saveSchool, getSchool } from '@/config/api'
import aMap from '@/components/a_map'

const columns = [
  {
    title: '校区名称',
    dataIndex: 'schoolName',
    align: 'center',
    key: 'schoolName'
  },
  {
    title: '地址',
    dataIndex: 'address',
    align: 'center',
    key: 'address'
  },
  {
    title: '校长',
    dataIndex: 'principalId',
    align: 'center',
    key: 'principalId'
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
    aMap
  },
  data () {
    return {
      data: [],
      columns,
      modalTitle: '新增校区',
      loading: false,
      showChange: false,
      lngLat: {},
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
    this.getSchoolList()
  },
  methods: {
    updateAddress (address, {lng, lat}) {
      this.form.setFieldsValue({ address })
      this.lngLat = {...this.lngLat, lng, lat}
    },
    openChange (schoolId) {
      this.modalTitle = '编辑校区'
      this.showChange = true
      getSchool({ schoolId }).then(({ data }) => {
        this.lngLat = {
          id: schoolId,
          lng: data.lng,
          lat: data.lat
        }
        this.form.setFieldsValue({ schoolName: data.schoolName })
        this.form.setFieldsValue({ principalId: data.principalId })
        this.form.setFieldsValue({ address: data.address })
        this.$nextTick(() => {
          this.$refs.map.setMarker()
        })
      })
    },
    handleAdd () {
      this.modalTitle = '新增校区'
      this.showChange = true
      this.lngLat = {}
      this.form.setFieldsValue({ schoolName: '' })
      this.form.setFieldsValue({ principalId: '' })
      this.form.setFieldsValue({ address: '' })
      this.$nextTick(() => {
        this.$refs.map.removeMarker()
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['schoolName', 'principalId', 'address'], { force: true }, (err, values) => {
        if (err) return
        saveSchool({
          ...values,
          ...this.lngLat
        }).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getSchoolList()
        })
      })
    },
    getSchoolList () {
      this.loading = true
      getSchoolList({
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize
      }).then(res => {
        this.loading = false
        this.data = res.data.list
        this.pagination.total = res.data.total
      })
    },
    deleteSchool (schoolId) {
      deleteSchool({ schoolId }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getSchoolList()
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
          this.deleteSchool(id)
        }
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
.campus-manage {
  .campus-table {
    margin-top: 20px;
  }
}
</style>
