<template>
    <div class="home">
        <div class="switcher">
          <button class="auth" v-on:click="switcherClickHandler(false)">Авторизация</button>
          <button class="reg" v-on:click="switcherClickHandler(true)">Регистрация</button>
        </div>
        <div>
          <div class="forms"></div>
            <!-- <Reg v-if="switcher"/>
            <Auth v-if="!switcher"/> -->
            <Reg v-show="switcher"/>
            <Auth v-show="!switcher"/>
        </div>
    </div>
</template>
  
<script>
  // @ is an alias to /src
  // импортируем наши компоненты
  import Auth from '@/components/Auth.vue'
  import Reg from '@/components/Reg.vue'
  

  // регистрируем наши компоненты
  export default {
    name: 'Login',
    components: {
      Auth,
      Reg
    },
    data: () => ({
      switcher: false
    }),
  methods: {
    switcherClickHandler: function (isSwitch) {
      this.switcher = isSwitch
    }
  }
}
</script>

<style scoped lang="less">
@font-face {
  font-family: 'Gordita Light';
  src: local('Gordita Light'), local('Gordita Light'),
  url('@/assets/GorditaLight.woff') format('woff'),
}
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  border: 1px solid #dfdfdf;
  border-radius: 15px;
  box-shadow: 2px 2px 15px #dfdfdf;
  justify-content: center;
  z-index: 100;
  transform: translate(-50%, -50%);    
  left: 50%;
  top: 50%;    
}
.switcher {
  display: inline-flex;
  text-align: center;
  font-family: 'Gordita Light';
  margin-top: 15px;
  .auth, .reg {
    margin: 5px;
    text-align: center;
    border: 1px solid grey;
    border-radius: 10rem;
    width: 120px;
    height: 40px;
    padding: 5px;
    font-family: 'Gordita Light';
    color: white;
    background-color: grey;
  }
  .auth:hover, .reg:hover {
    background-color: rgb(62, 62, 62);
  }
}  
</style>