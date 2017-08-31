<template>
  <div>
    <ul v-for="key in Object.keys(metrics)">
      <li>{{key}} {{ metrics[key] }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'metricHolder',
  props: ['metrics']
}
</script>

<style>
</style>
