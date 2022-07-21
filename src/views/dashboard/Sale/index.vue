<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!--   @tab-click="handleClick" -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale" />
          <el-tab-pane label="访问量" name="visit" />
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!-- 日历 -->
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          />
        </div>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="18">
            <div ref="charts" class="charts" />
          </el-col>
          <el-col :span="6">
            <h3 style="padding: 0">门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rIndex">1</span>
                <span>肯德基</span>
                <span class="rValue">123456</span>
              </li>
              <li>
                <span class="rIndex">2</span>
                <span>肯德基</span>
                <span class="rValue">123456</span>
              </li>
              <li>
                <span class="rIndex">3</span>
                <span>肯德基</span>
                <span class="rValue">123456</span>
              </li>
              <li>
                <span class="rIndex">4</span>
                <span>肯德基</span>
                <span class="rValue">123456</span>
              </li>
              <li>
                <span class="rIndex">5</span>
                <span>肯德基</span>
                <span class="rValue">123456</span>
              </li>
              <li>
                <span class="rIndex">6</span>
                <span>肯德基</span>
                <span class="rValue">123456</span>
              </li>
              <li>
                <span class="rIndex">7</span>
                <span>肯德基</span>
                <span class="rValue">123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      list: state => state.home.list
    })
  },
  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        xAxis: [
          {
            data: this.activeName === 'sale' ? this.list.orderFullYearAxis : this.list.userFullYearAxis
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.activeName === 'sale' ? this.list.orderFullYear : this.list.userFullYear,
            color: 'pink'
          }
        ]
      })
    },
    list() {
      this.myCharts = echarts.init(this.$refs.charts)
      this.myCharts.setOption({
        title: {
          text: '销售额趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.list.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.list.orderFullYear,
            color: 'pink'
          }
        ]
      })
    }
  },
  // mounted() {

  // },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
/* 深度选择器 */
>>> .el-card__header{
  border-bottom: none
}
.clearfix{
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab{
  width: 100%;
}
.right{
  position: absolute;
  right: 0;
}
.date{
  width: 250px;
  margin: 0 20px;
}
.right span{
  margin: 0 10px;
}
.charts{
  width: 100%;
  height: 300px;
}
ul{
  height: 300px;
  padding: 0;
}
ul li{
  height: 8%;
  margin: 10px 0;
  list-style: none;
}
.rIndex{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
  margin-right: 10px;
}
.rValue{
  float: right;
}
</style>
