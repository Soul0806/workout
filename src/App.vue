<template>
  <div id="app">
      <div class="navbar">
        <span>
        <router-link to="/">Insert</router-link>
        </span>
        <span>
        <router-link to="/train">Course</router-link>
        </span>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '@/assets/css/home.scss';
</style>