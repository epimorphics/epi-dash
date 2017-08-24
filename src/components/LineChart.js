import {Line} from 'vue-chartjs'
import request from 'superagent'
import moment from 'moment'

export default Line.extend({
  data () {
    return {
      colors: ['#1D0CCC', '#4597FF', '#FFC685', '#CC6523']
    }
  },
  props: ['name'],
  mounted () {
    request(`http://localhost:4000/json/timeseries/${this.name}`)
      .then((response) => {
        let series = response.body
        this.datasets = Object.keys(series).map((key) => {
          let background = this.colors[Object.keys(series).findIndex((obj) => obj === key) % this.colors.length]
          return {
            label: key,
            pointBackgroundColor: background,
            pointBorderColor: background,
            lineColor: background,
            backgroundColor: background,
            borderWidth: 3,
            borderColor: background,
            fill: false,
            data: series[key].reduce((acc, obj) =>
            Array.concat(acc, Object.values(obj)), [])
          }
        })
        this.labels = Object.values(series).map(obj =>
          obj.reduce((all, data) => Array.concat(all, Object.keys(data).map((time) => moment(time, 'YYYY-MM-DDTHH:mm:ss+00:00').format('YYYY-MM-DD'))), []))
        console.log(this.labels)
      })
      .then(() => {
        this.renderChart({
          labels: this.labels[0],
          datasets: this.datasets},
          {responsive: true, maintainAspectRatio: false})
      })
  }
})
