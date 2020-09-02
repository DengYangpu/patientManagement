<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    window.addEventListener("unload", this.saveState);
    this.$nextTick(function () {
    // Code that will run only after the
    // entire view has been rendered
    sessionStorage.removeItem('state')
  })
  },
  methods: {
    saveState() {
      sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    },
  },
};
</script>

<style>
@import "./assets/css/main.css";
/* 深色主题 */
@import "./assets/css/color-dark.css";
/* 浅绿色主题 */
@import "./assets/css/theme-green/color-green.css";
</style>