<template>
  <div class="wrapper">
    <div class="input">
        <div class="button" v-on:click="createChatButtonHandler">+</div>
        <input type="text">        
    </div>

    <div class="list">
      <div class="element"
      v-for="chat in availableChats"
      v-bind:key="chat._id" 
      v-on:click="chooseChatButtonHandler(chat._id)"
      >
      <!-- v-for - это vue атрибут, позволяет нам продублировать какой то элемент, как цикл
      в key мы передаем уникальный идентификатор -->
        <div class="leftContentWrapper">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl20U-Cn3Bd2KqDtcRya79hyXIH_hRO7T1_w&usqp=CAU">
        </div>
        <div class="rightContentWrapper">
          <div class="title">
            {{ chat.label }}
          </div>
          <div class="lastMessage">
            <div class="from">
                {{ chat.history.at(-1).from }}: &nbsp
                <!-- вытаскиваем последний элемент в массиве, последнее сообщение пользователя в чате -->
            </div>
            <div class="text">
                {{ chat.history.at(-1).text.slice(0, 20) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import EventBus from '@/EventBus'

export default {
  name: 'chatList',
  data: () => ({
    serverUrl: 'http://195.49.210.34/',
    availableChats: []
  }),
  
  async mounted () {
    // мы ожидаем когда произойдет событие userDataReady в Home.vue
    EventBus.$on('userDataReady', async (user) => {
      // console.log('userdata');
      // перед тем как перейти к следующему событию, нам нужно отобразить список чатов, поэтому запускаем:
      await this.update_chat_data(user)
      // далее когда событие userDataReady произойдет, то мы начинаем ожидать событие newChat в WebSocket Home.vue
      EventBus.$on('newChat', async (chat_data) => {
        await this.update_chat_data(user)
      })

      // // вариант написания кода без EventBus
      // const response = await this.sendRequest(`chat/user/${user.login}`, 'GET');
      // // console.log({response});
      
      // this.availableChats = response.payload;
      // // console.log(this.availableChats[0]);
      // // console.log(this);
        
      // setInterval(async() => await this.update_chat_data(user), 1000)
    })
  },

  methods: {
    sendRequest: async function (path, method, body) {
      const url = `${this.serverUrl}${path}`;
      if (method === 'GET') {
        return (await axios.get(url)).data
      } else {
        return (await axios.post(url, body)).data
      }
      
      // сокращенный вариант того же самого кода
      // axios - это какой то объект, у которого есть методы
      // method = method.toLowerCase()
      // return await axios[method](url).data
    },

    // создаем слушатель на клик открытия модального окна
    createChatButtonHandler: function () {
      this.$emit('openModalCreateChat') // $emit - это значит создать событие и прослушать его
    },

    chooseChatButtonHandler: function (chat_id) {
      this.$emit('chooseChat', chat_id) // передаем в аргументы chat_id из функции chooseChat в Ho
    },

    update_chat_data: async function (user) {
      this.availableChats = (await this.sendRequest(`chat/user/${user.login}`, 'GET')).payload
      // console.log(this.availableChats);
    }
  }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@font-face {
        font-family: 'Gordita Light';
        src: local('Gordita Light'), local('Gordita Light'),
        url('~@/assets/GorditaLight.woff') format('woff'),
        }
        .wrapper {
          // border: 1px solid rgba(37, 47, 37, 1);
          border-radius: 20px;
          background: linear-gradient(120deg, #17bebb, #f0a6ca);
          // margin: 50px;
          // height: 100vh;
          // padding-top: 20px;
          display: flex;
          flex-direction: column;
          width: 80%;
          .input {
            display: flex;  
            width: 90%;
            padding-top: 5px;
            text-align: center;
            align-items: center;
            justify-content: center;
            .button {
              color: white;
              padding-left: 15px;
              text-align: center;
              font-size: 70px;
              cursor: pointer;
            }
            input {
              border: 1px solid white;
              border-radius: 30px;
              width: 100%;
              height: 50px;
              margin-left: 20px;
            }
          }
          .list {
            width: 100%;
            height: 85%;
            padding-top: 5px;
            overflow-y: auto;
            .element {
              height: 80px;
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              margin: 20px;
              cursor: pointer;
              &:hover {
                background-color: rgba(37, 47, 37, .2);
              }
              .leftContentWrapper {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1.25% 2.5%;
                img {
                  // width: 100% !important;
                  height: 100% !important;
                  border-radius: 50%;
                }
              }
              .rightContentWrapper {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                padding: 7px;
                .title {
                  width: 100%;
                  height: 35%;
                  text-align: left;
                }
                .lastMessage {
                  width: 100%;
                  height: 50%;
                  display: flex;
                }
              }
            }
          }
          ::-webkit-scrollbar {
            width: 15px;
            height: 8px;
            border-radius: 9em;
            background-color: #f3faf7;
            border: 1px solid rgba(192, 191, 191, 0.466);
          }

          ::-webkit-scrollbar-thumb {
            background-color: rgba(192, 191, 191, 0.466);
            border-radius: 9em;
            box-shadow: inset 1px 1px 10px rgba(163, 161, 161, 0.1);
          }
          ::-webkit-scrollbar-thumb:hover {
            // background-color: #253861;
          }
        }
</style>