<template>
    <div class="wrapper">
        <!-- у нас есть 3 инпута,  v-model передает значение, оно связано с переменной, которое мы передаем в v-model, но если мы изменим переменную login, то у пользователя в интпуте это тоже отобразится-->
        <input v-model="regData.login" type="text" placeholder="Логин" class="login">
        <input v-model="regData.password" type="text" placeholder="Пароль" class="password">
        <input v-model="regData.tryPassword" type="text" placeholder="Повторите пароль" class="tryPassword">
        <!-- {{ response }} -->
        <button class="approve" v-on:click="registrationClickHandler">Зарегистрироваться</button>
    </div>
</template>
  
<script>
//   export default {
//     name: 'Reg',
//     data: () => ({
//         serverUrl: 'http://195.49.210.34/',
//         regData: {
//             login: '',
//             password: '',
//             tryPassword: ''
//         },
//         response: {}
//     }),
//     methods: {
//         registrationClickHandler: function () {
//             if(!this.regData.login || !this.regData.password || !this.regData.tryPassword)
//             return alert('Заполните все поля')
//             const request_body = {
//                 userData: {
//                     login: this.regData.login,
//                     password: this.regData.password,
//                     tryPassword: this.regData.tryPassword
//                 }
//             }

//             this.sendRequest('user/registration', "POST", request_body) 
//         },
        
        // sendRequest: function (pathword, method, body) {
        //     const request_config = {
        //         // url: `${this.serverUrl}${pathword}`,
        //         method, // GET запрос
        //         headers: {
        //             'Content-Type': 'application/json' // указываем что в запросе мы данные будем передавать в формате json
        //         },
        //         body: null // это данные, которые мы отправляем в формате JSON
        //     }

        //     if(method != 'GET') request_config.body = JSON.stringify(body);
            
        //     // const response = fetch (request_config);

        //     // let requestData // можно так создавать переменные
            
        //     // отправляем данные на сервер вариант 2
        //     async function (){
        //     }


        //     // отправляем данные на сервер вариант 1
        //     fetch (`${this.serverUrl}${pathword}`, request_config)
        //         .then (response => {
        //             console.log(response);
        //             response.json()
        //                 .then(jsonRes => {
        //                     this.response = jsonRes;
        //                 })
        //         })
        //         .catch (error => {
        //             console.log({error});
        //         })
        //     .catch (error => {
        //         console.log({error});
        //     })

        //     // console.log({response});
        //     return requestData;


export default {
    name: 'Reg',
    data: () => ({
        serverUrl: 'http://195.49.210.34/',
        regData: {
            login: '',
            password: '',
            tryPassword: ''
        },
        response: {}
    }),
    methods: {
        registrationClickHandler: async function () {
            if(!this.regData.login || !this.regData.password || !this.regData.tryPassword)
            return alert('Заполните все поля')

            const request_body = {
                userData: {
                    login: this.regData.login,
                    password: this.regData.password,
                    tryPassword: this.regData.tryPassword
                }
            }
            const response = await this.sendRequest('user/registration', "POST", request_body);

            // console.log({response});            

            if (response.info.status === 'Error'){
                return alert(response.payload);
            }else this.$router.push({ name: 'home', params: {id: response.payload._id}}); //передаем айди пользователя
        },

        sendRequest: async function (pathword, method, body) {
            const url = `${this.serverUrl}${pathword}`;
            const request_config = {
                method, // GET запрос
                headers: {
                    'Content-Type': 'application/json' // указываем что в запросе мы данные будем передавать в формате json
                },
                body: null // это данные, которые мы отправляем в формате JSON
            }

            if(method != 'GET') request_config.body = JSON.stringify(body);

            // отправляем данные на сервер вариант 2
            const response = await fetch (url, request_config)
            
            return await response.json();
        }
    }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  // здесь можно прописать стили для одного класса, если внутри есть разные классы
  // то есть по факту можно структурировать стили внутри одного класса,
  // чтобы не плодить стили для всех классов по отдельности
  // .container {
  //   width: 100%;
  //   &:hover {
  //     ...
  //   };
  //   .form {
  //     ....
  //   }
  // }
@font-face {
    font-family: 'Gordita Light';
    src: local('Gordita Light'), local('Gordita Light'),
    url('~@/assets/GorditaLight.woff') format('woff'),
}
body {
    font-family: 'Gordita Light';
}
.wrapper {
    display: grid;
    padding: 15px;
    .login, .password, .tryPassword {
        margin: 5px auto;
        text-align: center;
        border: 1px solid grey;
        border-radius: 10rem;        
        width: 300px;
        height: 30px;
        font-family: 'Gordita Light';
        color: grey;
    }
    .approve {
        margin: 5px auto;
        text-align: center;
        border: 1px solid #377978;
        border-radius: 10rem;
        width: 310px;
        height: 40px;
        padding: 5px;
        font-family: 'Gordita Light';
        color: white;
        background-color: #377978;
    }
    .approve:hover {
        background-color: rgb(62, 62, 62);
    }
}
</style>  