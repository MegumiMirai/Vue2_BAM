<template>
  <div>
    <div class="header">
      <span class="header-search">搜索用户数</span>
      <i class="el-icon-warning-outline" />
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <i class="el-icon-caret-top" style="color: red" />
      <i class="el-icon-caret-bottom" style="color: green" />
    </div>
    <div class="footer">
      <div ref="charts" class="charts" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineCharts',
  mounted() {
    const chart = echarts.init(this.$refs.charts)
    chart.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: [94, 7, 33, 21, 48, 23, 65, 84],
          // 拐点的样式的设置
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'purple'
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'blue' // 0% 处的颜色
              }, {
                offset: 1, color: 'white' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      }
    })
  }
}
</script>

<style>
  .header{
    display: flex;
    vertical-align: middle;
    color: #666;
    margin-bottom: 20px;
  }
  .header-search{
    margin-right: 10px;
  }
  .main-title{
    font-size: 30px;
    margin-right: 30px;
  }
  .main-content{
    color: #666;
  }
  .charts{
    width: 100%;
    height: 50px;
  }
</style>
