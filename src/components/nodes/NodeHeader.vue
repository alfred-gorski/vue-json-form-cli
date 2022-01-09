<template>
  <div class="header">{{ title }}</div>
</template>
<script setup>
// eslint-disable-next-line no-undef
defineProps({
  title: String,
});
</script>

<style scoped>
div {
  background: #494949;
  margin-top: -15px;
  margin-left: -15px;
  margin-right: -15px;
  padding: 10px 15px;
  margin-bottom: 15px;
}
</style>
