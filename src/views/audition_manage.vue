<template>
  <div class="audition-manage">
    <select-box @onSearch="onSearch"/>
    <a-button class="add-btn" type="primary" @click="handleAdd">新增试听学员</a-button>
    <a-table class="audition-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="sex" slot-scope="text, record">
        {{ record.sex === '1' ? '男' : '女' }}
      </span>
      <span slot="classList" slot-scope="text, record">
        {{ record.classList.map(a => a.name).join(',') }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.id)">编辑</a>
        <a href="javascript:;" @click.stop="openFormal(record)">转为正式学员</a>
        <a href="javascript:;" @click.stop="addBusiness(record)">设置提醒</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.id)">删除</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit" @cancel="cancelSubmit">
      <a-form :form="form">
        <a-form-item label="学生名字" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入学生名字" autocomplete="false" type="text" v-decorator="[
              'name',
              {rules: [{required: true, message: '请输入学生名字'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="学生性别" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择学生性别"
            v-decorator="[
              'sex',
              {rules: [{ required: true, message: '请选择学生性别' }]}
            ]">
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学生年龄" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入学生年龄" autocomplete="false" type="text" v-decorator="[
              'age',
              {rules: [{required: true, message: '请输入学生年龄'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="选择年级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择年级" @change="changeGradeId"
            v-decorator="[
              'gradeId',
              {rules: [{ required: true, message: '请选择年级' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of gradeList" :key="i">{{a.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分配班级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择分配班级"
            mode="multiple"
            v-decorator="[
              'classIds',
              {rules: [{ required: true, message: '请选择分配班级' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of classList" :key="i">{{a.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学生电话" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入学生电话" autocomplete="false" type="text" v-decorator="[
              'studentTel',
              {rules: [{required: true, message: '请输入学生电话'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="父母电话" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入父母电话" autocomplete="false" type="text" v-decorator="[
              'parentTel',
              {rules: [{required: true, message: '请输入父母电话'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="家庭住址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入家庭住址" autocomplete="false" type="text" v-decorator="[
              'address',
              {rules: [{required: true, message: '请输入家庭住址'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="showFormal" title="转为正式学员" @ok="toFormal">
      <a-form :form="formFormal">
        <a-form-item label="收费金额" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入收费金额" autocomplete="false" type="text" v-decorator="[
              'price',
              {rules: [{required: true, message: '请输入收费金额'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="收费人" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入收费人" autocomplete="false" type="text" v-decorator="[
              'collectName',
              {rules: [{required: true, message: '请输入收费人'}], validateTrigger: 'blur'}
            ]"/>
        </a-form-item>
        <a-form-item label="选择年级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择年级" @change="changeGradeId"
            v-decorator="[
              'gradeId',
              {rules: [{ required: true, message: '请选择年级' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of gradeList" :key="i">{{a.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分配班级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择分配班级"
            mode="multiple"
            v-decorator="[
              'classIds',
              {rules: [{ required: true, message: '请选择分配班级' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of classList" :key="i">{{a.name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="showTip" title="设置提醒" @ok="saveBusiness">
      <a-form :form="formTip">
        <a-form-item label="提醒对象" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择提醒对象"
            v-decorator="[
              'receiverId',
              {rules: [{ required: true, message: '请选择提醒对象' }]}
            ]">
            <a-select-option :value="a.id" v-for="(a, i) of userList" :key="i">{{a.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="提醒时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-date-picker placeholder="请选择提醒时间" format="YYYY-MM-DD HH:mm" :showTime="true" v-decorator="[
            'time',
            {rules: [{type: 'object', required: true, message: '请输入提醒内容'}]}
          ]"/>
        </a-form-item>
        <a-form-item label="提醒内容" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea placeholder="请输入提醒内容" :rows="3" v-decorator="[
            'content',
            {rules: [{required: true, message: '请输入提醒内容'}], validateTrigger: 'blur'}
          ]"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import selectBox from '@/components/select_box'
import { getStudentList, deleteStudent, getUserAll, getStudentSingle, getConsult, saveBusiness, saveStudent, getAllClassList, getGradeAll } from '@/config/api'
import moment from 'moment'

const columns = [
  {
    title: '学生名字',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  },
  {
    title: '性别',
    align: 'center',
    key: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '年级',
    dataIndex: 'grade',
    align: 'center',
    key: 'grade'
  },
  {
    title: '班级',
    align: 'center',
    key: 'classList',
    scopedSlots: { customRender: 'classList' }
  },
  {
    title: '住址',
    dataIndex: 'address',
    align: 'center',
    key: 'address'
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
      userList: [],
      modalTitle: '新增试听学员',
      loading: false,
      showFormal: false,
      showChange: false,
      showTip: false,
      form: this.$form.createForm(this),
      formFormal: this.$form.createForm(this),
      formTip: this.$form.createForm(this),
      formData: {},
      advisoryId: window.localStorage.getItem('advisoryId'),
      classList: [],
      gradeList: [],
      tipId: 0,
      stuType: '100100001',
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
    this.advisoryId && this.getConsult()
    this.getGradeAll()
    this.getUserAll()
    this.getStudentList()
  },
  methods: {
    getUserAll () {
      getUserAll().then(({ data }) => {
        this.userList = data
      })
    },
    addBusiness ({ id }) {
      this.showTip = true
      this.tipId = id
      this.formTip.setFieldsValue({ receiverId: undefined })
      this.formTip.setFieldsValue({ time: null })
      this.formTip.setFieldsValue({ content: '' })
    },
    saveBusiness (e) {
      e.preventDefault()
      const { formTip: { validateFields } } = this

      validateFields(['receiverId', 'time', 'content'], { force: true }, (err, values) => {
        if (err) return
        saveBusiness({
          ...values,
          bizType: '100600002',
          bizId: this.tipId,
          time: moment(values.time).format('YYYY-MM-DD HH:mm:ss')
        }).then(res => {
          this.showTip = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
        })
      })
    },
    cancelSubmit () {
      delete window.localStorage.advisoryId
    },
    onSearch (queryObj = {}) {
      if (queryObj.studentName) {
        queryObj.name = queryObj.studentName
        delete queryObj.studentName
      }
      this.queryObj = queryObj
      this.pagination.page = 1
      this.getStudentList()
    },
    changeGradeId (gradeId) {
      this.getAllClassList(gradeId)
    },
    getConsult () {
      this.modalTitle = '新增试听学员'
      this.showChange = true
      getConsult({ id: this.advisoryId }).then(({ data }) => {
        this.form.setFieldsValue({ name: data.studentName })
        this.form.setFieldsValue({ sex: data.sex })
        this.form.setFieldsValue({ age: data.age })
        this.form.setFieldsValue({ studentTel: data.studentTel })
        this.form.setFieldsValue({ parentTel: data.parentTel })
        this.form.setFieldsValue({ address: data.homeAddress })
      })
    },
    getGradeAll () {
      getGradeAll().then(res => {
        this.gradeList = res.data
      })
    },
    getAllClassList (gradeId) {
      getAllClassList({ gradeId }).then(res => {
        this.classList = res.data
      })
    },
    getStudentList () {
      this.loading = true
      getStudentList({
        stuType: this.stuType,
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize,
        ...this.queryObj
      }).then(res => {
        this.loading = false
        this.data = res.data.list
        this.pagination.total = res.data.total
      })
    },
    handleAdd () {
      this.modalTitle = '新增试听学员'
      this.showChange = true
      this.formData = {}
      this.form = this.$form.createForm(this)
    },
    openFormal (student) {
      this.showFormal = true
      this.formData = { id: student.id }
      this.$nextTick(() => {
        this.formFormal.setFieldsValue({ gradeId: student.gradeId })
        this.formFormal.setFieldsValue({ classIds: student.classList.map(a => a.id) })
      })
    },
    toFormal (e) {
      e.preventDefault()
      const { formFormal: { validateFields } } = this
      validateFields(['price', 'collectName', 'gradeId', 'classIds'], { force: true }, (err, values) => {
        if (err) return
        saveStudent({
          gradeId: values.gradeId,
          classIds: values.classIds,
          feesVO: {
            price: values.price,
            collectName: values.collectName
          },
          ...this.formData,
          stuType: '100100002'
        }).then(res => {
          this.showFormal = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getStudentList()
        })
      })
    },
    openChange (id) {
      this.modalTitle = '编辑试听学员'
      this.showChange = true
      this.formData = { id }
      getStudentSingle({ studentId: id }).then(({ data }) => {
        this.form.setFieldsValue({ name: data.name })
        this.form.setFieldsValue({ sex: data.sex })
        this.form.setFieldsValue({ age: data.age })
        this.form.setFieldsValue({ gradeId: data.gradeId })
        this.form.setFieldsValue({ classIds: data.classList.map(a => a.id) })
        this.form.setFieldsValue({ studentTel: data.studentTel })
        this.form.setFieldsValue({ parentTel: data.parentTel })
        this.form.setFieldsValue({ address: data.address })
        this.changeGradeId(data.gradeId)
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this

      validateFields(['name', 'sex', 'age', 'gradeId', 'classIds', 'studentTel', 'parentTel', 'address'], { force: true }, (err, values) => {
        if (err) return
        console.log(values.classIds)
        const params = {
          ...values,
          ...this.formData,
          stuType: this.stuType
        }
        this.advisoryId && (params.consultId = this.advisoryId)
        saveStudent(params).then(res => {
          delete window.localStorage.advisoryId
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getStudentList()
        })
      })
    },
    deleteStudent (studentId) {
      deleteStudent({ studentId }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getStudentList()
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
          this.deleteStudent(id)
        }
      })
    },
    pageChange ({ current, pageSize }) {
      this.pagination.page = current
      this.pagination.pageSize = pageSize
      this.getStudentList()
    }
  }
}
</script>
<style lang="less" scoped>
.audition-manage {
  .audition-table {
    margin-top: 20px;
  }
}
</style>
