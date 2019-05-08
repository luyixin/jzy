<template>
  <div class="statistical-marketing">
    <a-row class="item">
      <a-col class="lable" :span="3">筛选</a-col>
      <a-col :span="8">
        <a-radio-group :value="sign" buttonStyle="solid" @change="onChangeBtn">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="0">本月</a-radio-button>
          <a-radio-button value="2">本季度</a-radio-button>
          <a-radio-button value="1">本年</a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="item">
      <a-col class="lable" :span="3">营销字段</a-col>
      <a-col :span="10">
        <a-radio-group :value="systemValue" buttonStyle="solid" @change="onChangeFn">
          <a-radio-button value="1002">来源</a-radio-button>
          <a-radio-button value="1003">放弃原因</a-radio-button>
          <a-radio-button value="1004">价格敏感度</a-radio-button>
          <a-radio-button value="1005">经济状况</a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="item">
      <a-col class="lable" :span="3">时间段筛选</a-col>
      <a-col :span="8">
        <a-range-picker ref="time" @change="onChange" />
      </a-col>
    </a-row>
    <v-chart class="chart" :options="options"/>
  </div>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import { getMarketing } from '@/config/api'

export default {
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      sign: '',
      startTime: '',
      endTime: '',
      systemValue: '1002',
      options: {
        title: {
          left: 'center',
          text: '营销参数统计'
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
    this.getMarketing()
  },
  methods: {
    getMarketing () {
      const params = {
        sign: this.sign,
        startTime: this.startTime,
        endTime: this.endTime,
        systemValue: this.systemValue
      }
      getMarketing(params).then(res => {
        if (res.code !== 200) return this.$message.error(res.error)
        const { data } = res
        const values = data.map(a => a.value)
        this.$set(this.options.series[0], 'data', values)
        this.$set(this.options.series[1], 'data', values)
        this.$set(this.options.xAxis, 'data', data.map(a => a.name))
      })
    },
    onChangeFn ({ target: { value } }) {
      this.systemValue = value
      this.getMarketing()
    },
    onChangeBtn ({ target: { value } }) {
      const close = document.querySelector('.anticon-close-circle')
      close && close.click()
      this.startTime = ''
      this.endTime = ''
      this.sign = value
      this.getMarketing()
    },
    onChange ([start, end]) {
      if (!start || !end) return
      this.sign = ''
      this.startTime = start.format('YYYY-MM-DD')
      this.endTime = end.format('YYYY-MM-DD')
      this.getMarketing()
    }
  }
}
</script>
<style lang="less" scoped>
.statistical-marketing {
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
}
</style>
