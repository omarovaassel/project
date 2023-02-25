<template>
  <div id="app">
    <div class="wrapper-block">
      <!-- <router-link to="/">Home</router-link> -->
      <!-- <router-link to="/auth" class="auth-block">Авторизация</router-link>
      <router-link to="/reg" class="reg-block">Регистрация</router-link> -->
    </div>
      <router-view/>
  </div>  
</template>

<style scoped lang="less"> 
#app {
  display: inline-flex;
  flex-direction: column-reverse;
  width: 35%;
  height: 100vh;
  @font-face {
    font-family: 'Gordita Light';
    src: local('Gordita Light'), local('Gordita Light'),
    url('~@/assets/GorditaLight.woff') format('woff');
  };
  body {
    text-align: center;
  };
  * {
    font-family: serif 'Gordita Light' !important;
  }
  .wrapper-block {
    margin: 0 auto;
    text-align: center;
    height: 100vh;
    .auth-block, .reg-block {
      margin: 0 auto;
      padding: 15px;
      font-family: 'Gordita Light';
    }
  }
}
</style>