<template>
  <div class="select-box">
    <a-radio-group v-model="queryType">
      <a-radio-button value="all">全部</a-radio-button>
      <a-radio-button value="time">按时间段</a-radio-button>
      <a-radio-button value="studentName" v-if="!hideOhter">按学生姓名</a-radio-button>
      <a-radio-button value="studentTel" v-if="!hideOhter">按学生电话</a-radio-button>
      <a-radio-button value="parentTel" v-if="!hideOhter">按家长电话</a-radio-button>
      <a-radio-button value="inputId">按录入人</a-radio-button>
    </a-radio-group>
    <a-row class="select-group">
      <a-col :span="12" class="select-item" v-if="queryType === 'time'">
        <a-range-picker format="YYYY-MM-DD HH:mm:ss" showTime @change="onChange" />
        <a-button type="primary" @click.stop="searchTime">筛选</a-button>
      </a-col>
      <a-col :span="8" class="select-item" v-if="queryType === 'studentName'">
        <a-input-search placeholder="请输入学生姓名筛选" v-model="queryObj.studentName" @search="onSearch('studentName')" enterButton="筛选"/>
      </a-col>
      <a-col :span="8" class="select-item" v-if="queryType === 'studentTel'">
        <a-input-search placeholder="请输入学生电话筛选" v-model="queryObj.studentTel" @search="onSearch('studentTel')" enterButton="筛选"/>
      </a-col>
      <a-col :span="8" class="select-item" v-if="queryType === 'parentTel'">
        <a-input-search placeholder="请输入家长电话筛选" v-model="queryObj.parentTel" @search="onSearch('parentTel')" enterButton="筛选"/>
      </a-col>
      <a-col :span="8" class="select-item" v-if="queryType === 'inputId'">
        <a-select placeholder="请选择录入人" style="min-width: 200px" @change="changeSelect">
          <a-select-option :value="a.id" v-for="a of users" :key="a.id">{{a.name}}</a-select-option>
        </a-select>
        <a-button type="primary" @click.stop="onSearch('inputId')">筛选</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { getUserAll } from '@/config/api'
import moment from 'moment'

export default {
  props: {
    hideOhter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      queryType: 'all',
      person: '',
      users: [],
      queryObj: {}
    }
  },
  watch: {
    queryType (v) {
      this.queryObj = {}
      v === 'all' && this.$emit('onSearch')
    }
  },
  mounted () {
    this.getUserAll()
  },
  methods: {
    changeSelect (e) {
      this.queryObj = {
        inputId: e
      }
    },
    onChange ([start, end]) {
      this.queryObj = {
        startTime: moment(start).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(end).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    searchTime () {
      this.$emit('onSearch', this.queryObj)
    },
    onSearch (key) {
      if (!this.queryObj[key]) return this.$message.error('请输入筛选条件')
      this.$emit('onSearch', this.queryObj)
    },
    getUserAll () {
      getUserAll().then(res => {
        this.users = res.data.map(a => {
          return {
            id: a.id,
            name: a.name
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.select-box {
  margin-bottom: 20px;
  .select-group {
    margin-top: 20px;
  }
}
</style>
