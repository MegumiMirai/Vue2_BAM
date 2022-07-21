<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
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
          type: 'bar',
          data: [10, 7, 33, 95, 135, 65, 42, 12, 48, 23, 65, 84],
          color: 'pink'
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
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
