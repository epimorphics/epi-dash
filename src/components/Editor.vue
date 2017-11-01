<template>
  <form>
    <p>Merge</p>
    <div class="labels">
      <span v-for="newMetric in merged.sort()" v-on:click="setValues(newMetric)" class="mergeLabel">{{newMetric}} <i v-on:click="removeMerge(newMetric)" class="close-icon fa fa-times-circle" aria-hidden="true"></i></span>
    </div>
    <label>name</label>
    <input v-model="mergeName"></input>
    <br></br>
    <div v-for="metric in metricNames">
      <input :value="metric" v-model="fields" type="checkbox">{{metric}}</input>
    </div>
    <br></br>
    <button v-on:click="mergeButton">Merge</button>
    <p>Show</p>
    <input v-model="all" v-on:click="selectAll" type="checkbox">Select All</input>
    <br></br>
    <div v-for="metric in metricNames">
      <input :id="metric" :value="metric" v-model="show" type="checkbox">{{metric}}</input>
    </div>
  </form>
</template>

<script>
export default {
  name: 'editor',
  props: ['value', 'trello', 'repos'],
  data () {
    var transform = JSON.parse(this.value)
    return {
      show: transform.show ? transform.show : [],
      merge: transform.merge ? transform.merge : [],
      fields: [],
      mergeName: ''
    }
  },
  computed: {
    all: function () {
      return this.show.length === this.metricNames.length
    },
    merged: function () {
      return this.merge.map((elem) => elem.name)
    },
    metricNames: function () {
      let allMetrics = Array.concat(this.trello, this.repos)
      allMetrics = allMetrics.reduce((all, toflatten) => {
        if (toflatten != null) {
          return all.concat(Object.keys(toflatten.metrics), [])
        } else {
          return all
        }
      }, []).reduce((all, key) => {
        if (all.indexOf(key) <= -1) {
          all.push(key)
        }
        return all
      }, [])
      let mergedMetrics = this.merge.map((elem) => elem.name)
      return Array.concat(allMetrics, mergedMetrics)
    }
  },
  watch: {
    show () { this.emitTransform(this.merge, this.hide, this.show) },
    merge () { this.emitTransform(this.merge, this.hide, this.show) }
  },
  methods: {
    emitTransform (merge, hide, show) {
      this.$emit('input', JSON.stringify({merge, show}))
    },
    selectAll () {
      if (!this.all) {
        this.show = this.metricNames
      } else {
        this.show = []
      }
    },
    mergeButton () {
      this.removeMerge(this.mergeName)
      this.merge.push({name: this.mergeName, fields: this.fields})
      this.show.push(this.mergeName)
      this.fields = []
      this.mergeName = ''
    },
    removeMerge (name) {
      this.merge = this.merge.filter((elem) => elem.name !== name)
      this.show = this.show.filter((elem) => elem !== name)
    },
    setValues (newMetric) {
      var mergeObject = this.merge.find((elem) => elem.name === newMetric)
      this.fields = mergeObject.fields
      this.mergeName = mergeObject.name
    }
  }
}
</script>

<style scoped>

.labels {
  display: flex;
  flex-wrap: wrap;
}

.mergeLabel {
  background: #afeda1;
  padding: 10px;
  margin: 10px;
  max-height: 20px;
  overflow: none;
}

.closeIcon {
  float: right;
}

</style>
