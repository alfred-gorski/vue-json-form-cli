<template>
  <div ref="el">
    <NodeHeader :title="title" />
    <el-button type="info" size="small" @click="drawer = true">Edit</el-button>
    <teleport to="body">
      <el-drawer
        v-model="drawer"
        title="JSON Schema"
        :direction="'rtl'"
        :before-close="handleClose"
      >
        <el-input
          v-model="textarea"
          :rows="8"
          df-script
          type="textarea"
          placeholder="Please input"
        />
        <el-button type="info" size="small" @click="redirect"
          >Check Form</el-button
        >
        <el-button type="info" size="small" @click="updateSelect"
          >Upload</el-button
        >
      </el-drawer>
    </teleport>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, onMounted, inject } from "vue";
import NodeHeader from "./NodeHeader.vue";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import url from "@/config";

const axios = inject("axios");
const router = useRouter();

const el = ref(null);
const textarea = ref("");
let df = null;
const nodeId = ref(0);
const dataNode = ref({});
const title = ref("");
const drawer = ref(false);
const handleClose = (done) => {
  ElMessageBox.confirm("Are you sure you want to close this?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
df = getCurrentInstance().appContext.config.globalProperties.$df.value;

const updateSelect = () => {
  dataNode.value.data.schema = JSON.stringify(JSON.parse(textarea.value));
  df.updateNodeDataFromId(nodeId.value, dataNode.value.data);
  axios.put(`${url}/nodes/${dataNode.value.data.id}`, dataNode.value.data);
};

onMounted(async () => {
  await nextTick();
  nodeId.value = el.value.parentElement.parentElement.id.slice(5);
  dataNode.value = df.getNodeFromId(nodeId.value);
  textarea.value = JSON.stringify(JSON.parse(dataNode.value.data.schema));
  title.value = dataNode.value.data.friendly_names.en;
});

const redirect = () => {
  let routeData = router.resolve(`/workstation/${dataNode.value.data.id}`);
  window.open(routeData.href, "_blank");
};
</script>
<style scoped>
p {
  margin: 5px;
  margin-bottom: 10px;
}
</style>
