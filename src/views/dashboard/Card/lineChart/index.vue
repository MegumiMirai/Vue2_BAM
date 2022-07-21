<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
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
          data: [10, 7, 33, 12, 48, 23, 65, 84],
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
                offset: 0, color: 'purple' // 0% 处的颜色
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

<style scoped>
  .charts{
    width: 100%;
    height: 100%;
  }
</style>
