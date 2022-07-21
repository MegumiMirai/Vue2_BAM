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
        // 设置最小和最大
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }
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
