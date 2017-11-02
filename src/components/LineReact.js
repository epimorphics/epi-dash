import VueCharts from 'vue-chartjs'

export default VueCharts.Line.extend({
  mixins: [VueCharts.mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    update (data, label) {
      if (this._chart.data.labels.length > 100) {
        console.log('delet', this._chart.data.labels.length)
        this._chart.data.labels.splice(0, 1)
        this._chart.data.datasets[0].data.splice(0, 1)
      }
      this._chart.data.labels.push(label)
      this._chart.data.datasets[0].data.push(data)
      this._chart.update()
    }
  }
})
