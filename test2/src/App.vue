<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <p @click="$store.commit('add')">{{ $store.state.counter }}</p>
      <p @click="$store.dispatch('add')">{{ $store.state.counter }}</p>
      <p>double: {{$store.getters.doubleCounter}}</p>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a:not(:first-child) {
  margin-left: 20px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
