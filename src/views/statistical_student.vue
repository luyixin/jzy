<template>
  <div class="statistical-student">
    <a-row class="item">
      <a-col class="lable" :span="3">年级筛选</a-col>
      <a-col :span="9">
        <a-checkbox-group v-model="selectGrade" :options="plainOptions"/>
      </a-col>
    </a-row>
    <a-row class="item">
      <a-col class="lable" :span="3">筛选</a-col>
      <a-col :span="9">
        <a-radio-group :value="sign" buttonStyle="solid" @change="onChangeBtn">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="0">本月</a-radio-button>
          <a-radio-button value="2">本季度</a-radio-button>
          <a-radio-button value="1">本年</a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="item">
      <a-col class="lable" :span="3">时间段筛选</a-col>
      <a-col :span="9">
        <a-range-picker @change="onChange" />
      </a-col>
    </a-row>
    <a-button class="btn" type="primary" @click.stop="getStudentStatistics">筛选</a-button>
    <v-chart class="chart" :options="options"/>
  </div>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import { getStudentStatistics, getGradeAll } from '@/config/api'

export default {
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      sign: '',
      startTime: '',
      endTime: '',
      plainOptions: [],
      selectGrade: [],
      options: {
        title: {
          left: 'center',
          text: '学员统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar'
          },
          {
            data: [],
            type: 'line',
            smooth: true
          }
        ]
      }
    }
  },
  mounted () {
    this.getGradeAll()
    this.getStudentStatistics()
  },
  methods: {
    handleChange (e) {
      console.log(e)
    },
    getGradeAll () {
      getGradeAll().then(res => {
        if (res.code !== 200) return this.$message.error(res.error)
        this.plainOptions = res.data.map(a => {
          return {
            label: a.name,
            value: a.id
          }
        })
      })
    },
    getStudentStatistics () {
      const params = {
        sign: this.sign,
        startTime: this.startTime,
        gradeIds: this.selectGrade,
        endTime: this.endTime
      }
      getStudentStatistics(params).then(res => {
        if (res.code !== 200) return this.$message.error(res.error)
        const { data } = res
        const values = data.map(a => a.value)
        this.$set(this.options.series[0], 'data', values)
        this.$set(this.options.series[1], 'data', values)
        this.$set(this.options.xAxis, 'data', data.map(a => a.day))
      })
    },
    onChangeBtn ({ target: { value } }) {
      const close = document.querySelector('.anticon-close-circle')
      close && close.click()
      this.startTime = ''
      this.endTime = ''
      this.sign = value
    },
    onChange ([start, end]) {
      if (!start || !end) return
      this.sign = ''
      this.startTime = start.format('YYYY-MM-DD')
      this.endTime = end.format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="less" scoped>
.statistical-student {
  .item {
    margin-top: 20px;
    .lable {
      font-size: 14px;
    }
  }
  .chart {
    margin-top: 20px;
    width: 100%;
  }
  .btn {
    margin-top: 10px;
  }
}
</style>
