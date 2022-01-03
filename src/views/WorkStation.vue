<template>
  <div class="myform">
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      @change="onChange"
    />
    <el-button type="primary" @click="upload">Upload</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, inject } from "vue";
import { JsonForms, JsonFormsChangeEvent } from "@jsonforms/vue";
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import url from "@/config";

// eslint-disable-next-line no-undef
const props = defineProps<{ id: string }>();

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

const axios: any = inject("axios");

let node: any = null;
const schema = ref();
const data = ref();

const renderers = ref(Object.freeze([...vanillaRenderers]));

const onChange = (event: JsonFormsChangeEvent) => {
  data.value = event.data;
};

provide("styles", myStyles);

onMounted(() => {
  axios.get(`${url}/nodes/${props.id}`).then((res: any) => {
    node = res.data;
    schema.value = JSON.parse(node.schema);
  });
});

const upload = () => {
  node.form_data = JSON.stringify(data.value);
  console.log(data.value);
  console.log(JSON.stringify(node));
  axios.put(`${url}/nodes/${node.id}`, node, {
    headers: { "Content-Type": "application/json" },
  });
};
</script>
<style>
.mylabel {
  color: darkslategrey;
}

.vertical-layout {
  margin-left: 10px;
  margin-right: 10px;
}

.myform {
  width: 640px;
  margin: 0 auto;
}

.text-area {
  min-height: 80px;
}
</style>
