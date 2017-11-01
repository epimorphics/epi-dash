<template>
  <div class="labelHolder">
    <div class="label" v-for="element in value">
      {{element.displayName}} <i v-on:click="removeMerge(element.name)" class="close-icon fa fa-times-circle" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ticketSelector',
  props: ['value'],
  methods: {
    removeMerge (name) {
      this.value = this.value.filter((elem) => elem.name !== name)
      this.$emit('input', this.value)
    }
  }
}
</script>

<style scoped>
.label {
  background: #afeda1;
  padding: 10px;
  margin: 10px;
}

.labelHolder {
  display: flex;
  flex-wrap: wrap;

}
</style>
