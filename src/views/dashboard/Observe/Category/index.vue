<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道" />
          <el-radio-button label="线上" />
          <el-radio-button label="门店" />
        </el-radio-group>
      </div>
      <div ref="charts" class="charts" />
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Category',
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.charts)
    myChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      title: {
        text: '视频广告',
        subtext: '300',
        left: 'center',
        top: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 300, name: '视频广告' },
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广澳' }
          ]
        }
      ]
    })
    myChart.on('mouseover', (params) => {
      const { name, value } = params
      myChart.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  >>>.el-card__header{
    padding-bottom: 0;
  }

  .charts{
    width: 100%;
    height: 300px;
  }
</style>
