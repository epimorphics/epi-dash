import VueCharts from 'vue-chartjs'

export default VueCharts.Line.extend({
  mixins: [VueCharts.mixins.reactiveProp],
  data () {
    return {
      colors: ['#1D0CCC', '#4597FF', '#FFC685', '#CC6523']
    }
  },
  props: ['chartData', 'options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
