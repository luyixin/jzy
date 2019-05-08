<template>
  <div class="receipt-manage">
    <select-box @onSearch="onSearch"/>
    <a-button class="add-btn" type="primary" @click="handleAdd">新增咨询单</a-button>
    <a-table class="receipt-table" :columns="columns" :dataSource="data" bordered :pagination="pagination" :loading="loading" @change="pageChange">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click.stop="openChange(record.id, record)">编辑</a>
        <a href="javascript:;" @click.stop="showDeleteConfirm(record.id)">删除</a>
        <a href="javascript:;" v-if="!+record.state" @click.stop="importStudents(record.id)">导入学生库</a>
        <a href="javascript:;" @click.stop="getFollowList(record.id)">跟进</a>
        <a href="javascript:;" @click.stop="addBusiness(record.id)">设置提醒</a>
      </span>
    </a-table>
    <a-modal v-model="showChange" :title="modalTitle" @ok="handleSubmit" :width="860">
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item label="学生姓名" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-input placeholder="请输入学生姓名" autocomplete="false" type="text"
                v-decorator="[
                  'studentName',
                  {rules: [{required: true, message: '请输入学生姓名'}], validateTrigger: 'blur'}
                ]"/>
            </a-form-item>
            <a-form-item label="学生性别" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-select placeholder="请选择学生性别"
                v-decorator="[
                  'sex',
                  {rules: [{ required: true, message: '请选择学生性别' }]}
                ]">
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="2">女</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="家庭住址" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-input placeholder="请输入家庭住址" autocomplete="false" type="text" v-model="formData.homeAddress"/>
            </a-form-item>
            <a-form-item label="咨询时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-date-picker placeholder="请选择咨询时间" format="YYYY-MM-DD HH:mm" :showTime="true" v-decorator="[
                  'consultTime',
                  {rules: [{required: true, message: '请选择咨询时间'}]}
              ]"/>
            </a-form-item>
            <a-form-item label="价格敏感度" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-select placeholder="请选择价格敏感度" v-model="formData.priceSensitive">
                <a-select-option :value="a.value" v-for="(a, i) of dictionary['1004']" :key="i">{{a.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="来源" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-select placeholder="请选择来源" v-model="formData.source">
                <a-select-option :value="a.value" v-for="(a, i) of dictionary['1002']" :key="i">{{a.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="跟进老师" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-select placeholder="请选择跟进老师" v-model="formData.followTeacher">
                <a-select-option :value="a.id" v-for="(a, i) of userList" :key="i">{{a.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="年龄" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-input placeholder="请输入学生年龄" autocomplete="false" type="number" v-decorator="[
                  'age',
                  {rules: [{required: true, message: '请输入学生年龄'}], validateTrigger: 'blur'}
                ]"/>
            </a-form-item>
            <a-form-item label="年级" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-input placeholder="请输入年级" autocomplete="false" type="text"
                v-decorator="[
                  'grade',
                  {rules: [{required: true, message: '请输入年级'}], validateTrigger: 'blur'}
                ]"/>
            </a-form-item>
            <a-form-item label="学校" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-input placeholder="请输入学校" autocomplete="false" type="text" v-model="formData.school"/>
            </a-form-item>
            <a-form-item label="学生电话" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-input placeholder="请输入学生电话" autocomplete="false" type="text"
                v-decorator="[
                  'studentTel',
                  {rules: [{required: true, message: '请输入学生电话'}], validateTrigger: 'blur'}
                ]"/>
            </a-form-item>
            <a-form-item label="家长电话" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-input placeholder="请输入家长电话" autocomplete="false" type="text"
                v-decorator="[
                  'parentTel',
                  {rules: [{required: true, message: '请输入家长电话'}], validateTrigger: 'blur'}
                ]"/>
            </a-form-item>
            <a-form-item label="经济状况" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-select placeholder="请选择经济状况" v-model="formData.economic">
                <a-select-option :value="a.value" v-for="(a, i) of dictionary['1005']" :key="i">{{a.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="是否意向" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-select placeholder="请选择是否意向" v-model="formData.intention">
                <a-select-option value="0">是</a-select-option>
                <a-select-option value="1">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="放弃原因" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
              <a-select placeholder="请选择放弃原因" v-model="formData.abandon">
                <a-select-option :value="a.value" v-for="(a, i) of dictionary['1003']" :key="i">{{a.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="学科分析" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
          <a-textarea placeholder="请输入学科分析" :rows="3" v-model="formData.disciplineAnalysis"/>
        </a-form-item>
        <a-form-item label="性格分析" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
          <a-textarea placeholder="请输入性格分析" :rows="3" v-model="formData.characterAnalysis"/>
        </a-form-item>
        <a-form-item label="补习时间备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
          <a-textarea placeholder="请输入补习时间备注" :rows="3" v-model="formData.tutorialTimeRemark"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="showFollow" title="跟进信息" :width="860">
      <a-timeline v-if="followList.length">
        <a-timeline-item v-for="(a, i) of followList" :key="i">
          <p v-if="a.id">{{a.user.name}} | {{a.time}}</p>
          <a-textarea placeholder="请输入跟进内容" :rows="3" v-model="a.description" :disabled="!!a.id"/>
        </a-timeline-item>
      </a-timeline>
      <div v-else>
        暂无跟进信息
      </div>
      <template slot="footer">
        <a-button type="primary" @click="addFollow">新增</a-button>
        <a-button type="primary" :loading="followLoading" @click.stop="handleSubmitFollow">提交</a-button>
      </template>
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
    <a-modal v-model="visible" title="导入学生库" @ok="toStudent">
      <a-form :form="formStudent">
        <a-form-item label="导入学生类型" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
            <a-select placeholder="请选择导入学生类型"
              v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择导入学生类型' }]}
              ]">
              <a-select-option value="100100001">试听学员</a-select-option>
              <a-select-option value="100100002">正式学员</a-select-option>
            </a-select>
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { Base64 } from 'js-base64'
import selectBox from '@/components/select_box'
import moment from 'moment'
import { getConsultList, getConsult, deleteConsult, saveConsult, getFollowList, saveBusiness, getUserAll, saveFollow, getDictionarySingle } from '@/config/api'

const columns = [
  {
    title: '学生名字',
    dataIndex: 'studentName',
    align: 'center',
    key: 'studentName'
  },
  {
    title: '年级',
    dataIndex: 'grade',
    align: 'center',
    key: 'grade'
  },
  {
    title: '学生电话',
    dataIndex: 'studentTel',
    align: 'center',
    key: 'studentTel'
  },
  {
    title: '家长电话',
    dataIndex: 'parentTel',
    align: 'center',
    key: 'parentTel'
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
      followList: [],
      loading: false,
      showChange: false,
      showFollow: false,
      showTip: false,
      visible: false,
      followLoading: false,
      form: this.$form.createForm(this),
      formTip: this.$form.createForm(this),
      formStudent: this.$form.createForm(this),
      formData: {},
      tipId: 0,
      consultId: 0,
      studentId: -1,
      modalTitle: '新增咨询单',
      userInfo: JSON.parse(Base64.decode(Base64.decode(window.localStorage.getItem('userInfo')))),
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
      },
      dictionary: {
        '1002': [],
        '1003': [],
        '1004': [],
        '1005': []
      }
    }
  },
  mounted () {
    this.getConsultList()
    this.getUserAll()
    this.getDictionarySingle()
  },
  methods: {
    onSearch (queryObj = {}) {
      this.queryObj = queryObj
      this.pagination.page = 1
      this.getConsultList()
    },
    getDictionarySingle () {
      getDictionarySingle({value: '1002'}).then(res => {
        this.dictionary['1002'] = res.data
      })
      getDictionarySingle({value: '1003'}).then(res => {
        this.dictionary['1003'] = res.data
      })
      getDictionarySingle({value: '1004'}).then(res => {
        this.dictionary['1004'] = res.data
      })
      getDictionarySingle({value: '1005'}).then(res => {
        this.dictionary['1005'] = res.data
      })
    },
    onChangeTime (date, dateString) {
      this.formData.consultTime = dateString
    },
    getFollowList (consultId) {
      this.showFollow = true
      this.consultId = consultId
      getFollowList({ consultId }).then(({ data }) => {
        this.followList = data
      })
    },
    addFollow () {
      this.followList.push({
        teacher: this.userInfo.userId,
        consultId: this.consultId,
        description: ''
      })
    },
    handleSubmitFollow () {
      saveFollow(this.followList.filter(a => {
        !a.id && (a.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        return (a.description && !a.id)
      })).then(res => {
        this.showFollow = false
        res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
      })
    },
    getUserAll () {
      getUserAll().then(({ data }) => {
        this.userList = data
      })
    },
    saveBusiness (e) {
      e.preventDefault()
      const { formTip: { validateFields } } = this

      validateFields(['receiverId', 'time', 'content'], { force: true }, (err, values) => {
        if (err) return
        saveBusiness({
          ...values,
          bizType: '100600001',
          bizId: this.tipId,
          time: moment(values.time).format('YYYY-MM-DD HH:mm:ss')
        }).then(res => {
          this.showTip = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
        })
      })
    },
    addBusiness (id) {
      this.showTip = true
      this.tipId = id
      this.formTip.setFieldsValue({ receiverId: undefined })
      this.formTip.setFieldsValue({ time: null })
      this.formTip.setFieldsValue({ content: '' })
    },
    importStudents (id) {
      this.visible = true
      this.studentId = id
      this.formStudent.setFieldsValue({ type: '' })
    },
    toStudent (e) {
      e.preventDefault()
      const { formStudent: { validateFields } } = this
      validateFields(['type'], { force: true }, (err, values) => {
        if (err) return
        const url = values.type === '100100001' ? '/base/student/audition_manage' : '/base/student/student_manage'
        window.localStorage.setItem('advisoryId', this.studentId)
        this.$router.push(url)
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields(['studentName', 'sex', 'age', 'grade', 'studentTel', 'parentTel', 'consultTime'], { force: true }, (err, values) => {
        if (err) return
        const params = {
          ...this.formData,
          ...values
        }
        values.consultTime && (params.consultTime = moment(values.consultTime).format('YYYY-MM-DD HH:mm'))
        saveConsult(params).then(res => {
          this.showChange = false
          res.code === 200 ? this.$message.success(res.data) : this.$message.error(res.error)
          this.getConsultList()
        })
      })
    },
    handleAdd () {
      this.formData = {}
      this.form = this.$form.createForm(this)
      this.modalTitle = '新增咨询单'
      this.showChange = true
    },
    deleteConsult (id) {
      deleteConsult({ id }).then(res => {
        if (!res.status) return this.$message.error(res.error)
        this.$message.success('操作成功')
        this.getConsultList()
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
          this.deleteConsult(id)
        }
      })
    },
    openChange (id) {
      this.modalTitle = '修改咨询单'
      this.showChange = true
      this.formData = { id }
      getConsult({ id }).then(({ data }) => {
        this.form.setFieldsValue({ studentName: data.studentName })
        this.form.setFieldsValue({ age: data.age })
        this.form.setFieldsValue({ sex: data.sex })
        this.form.setFieldsValue({ grade: data.grade })
        this.form.setFieldsValue({ studentTel: data.studentTel })
        this.form.setFieldsValue({ parentTel: data.parentTel })
        this.formData = data
        this.form.setFieldsValue({ consultTime: moment(this.formData.consultTime) })
      })
    },
    getConsultList () {
      this.loading = true
      getConsultList({
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize,
        ...this.queryObj
      }).then(res => {
        this.loading = false
        this.data = res.data.list
        this.pagination.total = res.data.total
      })
    },
    pageChange ({ current, pageSize }) {
      this.pagination.page = current
      this.pagination.pageSize = pageSize
      this.getConsultList()
    }
  }
}
</script>
<style lang="less" scoped>
.receipt-manage {
  .receipt-table {
    margin-top: 20px;
  }
}
</style>
