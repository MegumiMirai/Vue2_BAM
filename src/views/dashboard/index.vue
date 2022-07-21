<template>
  <div>
    <Card />
    <Sale style="margin: 20px 0" />
    <Observe />
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  mounted() {
    this.$store.dispatch('getDate')
  }
}
</script>

<style lang="scss" scoped>

</style>
