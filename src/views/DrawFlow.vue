<template>
  <el-container>
    <el-header class="header">
      <el-button type="info" @click="clearEditor">Clear</el-button>
      <el-button type="primary" @click="exportGraph">Export</el-button>
    </el-header>
    <el-container class="container">
      <el-aside width="250px" class="column">
        <ul>
          <li
            v-for="n in listNodes"
            :key="n.id"
            draggable="true"
            :data-node="n.id"
            class="drag-drawflow"
            @dragstart="drag($event)"
          >
            <div class="node">{{ n.friendly_names.en }}</div>
          </li>
        </ul>
      </el-aside>
      <el-main>
        <div
          id="drawflow"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
        ></div>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="dialogVisible" title="Export" width="50%">
    <span>Graphviz:</span>
    <pre><code>{{ dialogData }}</code></pre>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  onMounted,
  shallowRef,
  h,
  getCurrentInstance,
  render,
  ref,
  inject,
} from "vue";
import Drawflow from "drawflow";
// eslint-disable-next-line no-unused-vars
import styleDrawflow from "drawflow/dist/drawflow.min.css";
// eslint-disable-next-line no-unused-vars
import style from "@/assets/style.css";

import Node from "@/components/nodes/Node.vue";
import url from "@/config";

const axios = inject("axios");
const node = "Node";
const listNodesData = ref([]);
const listNodes = ref([]);
const editor = shallowRef({});
const dialogVisible = ref(false);
const dialogData = ref({});
const Vue = { version: 3, h, render };
const internalInstance = getCurrentInstance();
internalInstance.appContext.app._context.config.globalProperties.$df = editor;

function clearEditor() {
  editor.value.clearModuleSelected();
  listNodes.value.splice(0, listNodes.value.length);
  listNodes.value = listNodes.value.concat(listNodesData.value);
}

function exportGraph() {
  const nextNodeNames = (data, connections) => {
    let names = [];
    for (let n of connections) {
      names.push(data[n.node].data.friendly_names.en);
    }
    return names;
  };

  const data = editor.value.export().drawflow.Home.data;
  let content = "digraph graphname {\n";
  for (let key in data) {
    const nodeName = data[key].data.friendly_names.en;
    const connections = data[key].outputs.output_1.connections;
    const names = nextNodeNames(data, connections);
    for (let name of names) {
      content +=
        "  " +
        nodeName.split(" ").join("_") +
        "->" +
        name.split(" ").join("_") +
        "\n";
    }
  }
  content += "}\n";

  dialogData.value = content;
  dialogVisible.value = true;
}

const drag = (ev) => {
  if (ev.type === "touchstart") {
    mobile_item_selec = ev.target
      .closest(".drag-drawflow")
      .getAttribute("data-node");
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
  }
};
const drop = (ev) => {
  if (ev.type === "touchend") {
    var parentdrawflow = document
      .elementFromPoint(
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      )
      .closest("#drawflow");
    if (parentdrawflow != null) {
      addNodeToDrawFlow(
        mobile_item_selec,
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      );
    }
    mobile_item_selec = "";
  } else {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(data, ev.clientX, ev.clientY);
  }
};
const allowDrop = (ev) => {
  ev.preventDefault();
};

let mobile_item_selec = "";
let mobile_last_move = null;
function positionMobile(ev) {
  mobile_last_move = ev;
}

function addNodeToDrawFlow(id, pos_x, pos_y) {
  pos_x =
    pos_x *
      (editor.value.precanvas.clientWidth /
        (editor.value.precanvas.clientWidth * editor.value.zoom)) -
    editor.value.precanvas.getBoundingClientRect().x *
      (editor.value.precanvas.clientWidth /
        (editor.value.precanvas.clientWidth * editor.value.zoom));
  pos_y =
    pos_y *
      (editor.value.precanvas.clientHeight /
        (editor.value.precanvas.clientHeight * editor.value.zoom)) -
    editor.value.precanvas.getBoundingClientRect().y *
      (editor.value.precanvas.clientHeight /
        (editor.value.precanvas.clientHeight * editor.value.zoom));

  const nodeSelected = listNodes.value.find((ele) => ele.id == id);
  editor.value.addNode(
    node,
    1,
    1,
    pos_x,
    pos_y,
    node,
    nodeSelected,
    node,
    "vue"
  );

  // Remove from listNodes
  listNodes.value = listNodes.value.filter((ele) => ele.id != id);
}

onMounted(() => {
  const id = document.getElementById("drawflow");
  editor.value = new Drawflow(
    id,
    Vue,
    internalInstance.appContext.app._context
  );
  editor.value.start();

  editor.value.registerNode("Node", Node, {}, {});

  axios.get(`${url}/nodes`).then((res) => {
    listNodesData.value = listNodesData.value.concat(res.data);
    listNodes.value = listNodes.value.concat(listNodesData.value);
    var elements = document.getElementsByClassName("drag-drawflow");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("touchend", drop, false);
      elements[i].addEventListener("touchmove", positionMobile, false);
      elements[i].addEventListener("touchstart", drag, false);
    }
  });
});
</script>
<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #494949;
}
.container {
  min-height: calc(100vh - 100px);
}
.column {
  border-right: 1px solid #494949;
}
.column ul {
  padding-inline-start: 0px;
  padding: 10px 10px;
}
.column li {
  background: transparent;
}

.node {
  border-radius: 8px;
  border: 2px solid #494949;
  display: block;
  height: 60px;
  line-height: 40px;
  padding: 10px;
  margin: 10px 0px;
  cursor: move;
  background: #49494970;
}
#drawflow {
  width: 100%;
  height: 100%;
  text-align: initial;
  background: #2b2c30;
  background-size: 20px 20px;
  background-image: radial-gradient(#494949 1px, transparent 1px);
}
</style>
