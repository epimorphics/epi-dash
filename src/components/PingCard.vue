<template>
  <div>
    <cardheader v-bind:title="host + ' response time'" v-bind:source="'epi'"></cardheader>
    <chart ref="chart" v-bind:chartData="chartData"></chart>
  </div>
</template>

<script>
import Chart from './LineReact'
import CardHeader from './CardComponents/CardHeader'
export default {
  name: 'pingGraph',
  components: {
    'chart': Chart,
    'cardheader': CardHeader
  },
  props: ['host'],
  data () {
    return {
      chartData: {
        labels: [],
        datasets: [{
          label: 'Response Time (ms)',
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }
    }
  },
  socket: {
    events: {
      connect (msg) {
        if (this.host) {
          this.$socket.emit('interest', {host: this.host})
        }
      },
      past (rows) {
        console.log(rows)
        rows.map((row) => {
          if (row.host === this.host) {
            this.$refs.chart.update(row.time, row.date)
          }
        })
      },
      news (msg) {
        if (msg.host === this.host) {
          console.log('news!')
          this.$refs.chart.update(msg.diff, msg.time)
        }
      }
    }
  }
}
</script>

<style scoped>
.hostname {
  font-size: 20px;
}
</style>
