<template>
  <router-view />
</template>

<style>
*,
:after,
:befor {
  box-sizing: border-box;
}
html {
  padding: 0;
  margin: 0;
  overflow: hidden;
  background: transparent;
}
body {
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  margin: 20px;
  padding: 0;
}
.el-main {
  padding: 0;
}
#app {
  font-family: Helvetica, Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
