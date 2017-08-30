<template>
  <div>
    <cardheader
      v-bind:source="project.source"
      v-bind:title="project.displayName"
      v-bind:contributors="project.avatars"
      v-bind:href="`#/repo?name=${project.name}`"
      v-bind:small="small"
      v-on:click.native="openRepo"
    >
    </cardheader>
    <div v-if="!open" class="body">
      <descriptionholder class="bodyleft" v-bind:description="project.description">
      </descriptionholder>
      <metricholder class="bodyright" v-bind:metrics="project.metrics"></metricholder>
    </div>
    <div class="bottom" v-if="!small" v-bind:class="project.test">
    </div>
  </div>
</template>

<script>
import CardHeader from './CardHeader'
import MetricHolder from './MetricHolder'
import DescriptionHolder from './DescriptionHolder'

export default {
  name: 'project',
  data () {
    return {
      closable: this.small,
      open: this.small
    }
  },
  components: {
    'cardheader': CardHeader,
    'descriptionholder': DescriptionHolder,
    'metricholder': MetricHolder
  },
  props: ['project', 'metricText', 'small', 'filtered'],
  methods: {
    openRepo () {
      if (this.closable) {
        this.open = !this.open
      }
    }
  }
}
</script>

<style scoped>
  .body {
    display: flex;
  }

  .bodyleft {
    width: 45%;
    padding: 10px;
    background-color: #aaaaaa;
  }

  .bodyright {
    width: 55%;
    padding: 10px;
    background-color: #888888;
  }

  .bottom {
    height: 20px;
    width: 100%;
  }

  .notests {
    background-color: #444455;
  }

  .testpass {
    background-color: #449944;
  }

  .testfail {
    background-color: #994444;
  }

  .projectName {
    font-size: 40px;
    margin: 10px;
  }
</style>
