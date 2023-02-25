<template>
<!-- важно! у тега template может быть только один дочерний тег -->
    <div class="wrapper">
        <!-- @openModalCreateChat - это слушатель событий -->
        <!-- v-on:click - это тоже самое что и @ -->

        <!-- открытие модального окна идет у нас из List.vue -->
        <ChatList @openModalCreateChat="openModalCreateChat" @chooseChat="chooseChat" :login="user.login" class="chatList"/>

        <ChatView :chat="currentChat" :login="user.login" class="chatView"/>
        <!-- строка выше - передаем данные из Home.vue в View.vue 
        то есть мы говорим, что переменная currentChat (ниже прописан) передается в props chat из файла View.vue-->
        
        <div class="createChatModalWrapper" v-if="createChatIsOpen">
            <!-- закрытие модального окна идет из Create.vue -->
            <ChatCreate @closeModalCreateChat="closeModalCreateChat"/>
        </div>
        
        <ChatSendMessage :chatId="currentChat._id" :login="user.login" class="chatSendMessage"/>
    </div>
</template>
  
<script>
// @ is an alias to /src
// импортируем наши компоненты
import ChatList from '@/components/chat/List.vue'
import ChatCreate from '@/components/chat/Create.vue'
import ChatView from '@/components/chat/View.vue'
import ChatSendMessage from '@/components/chat/SendMessage.vue'
// import ChatModal from '@/components/chat/Modal.vue'
import axios from 'axios'
import EventBus from '@/EventBus'


// регистрируем наши компоненты
export default {
    name: 'Chat',
    data: () => ({
        serverUrl: 'http://195.49.210.34/',
        webSocketServerUrl: 'ws://195.49.210.34/',
        createChatIsOpen: false,
        user: {},
        intervalId: '',
        webSocket: null,
        currentChat: {
            _id: '',
            history: []
        }
    }),
    components: {
        ChatCreate,
        ChatList,
        ChatView,
        ChatSendMessage
        // ChatModal
    },
    methods: {
        openModalCreateChat: function () {
            this.createChatIsOpen = true
        },
        closeModalCreateChat: function () {
            this.createChatIsOpen = false
        },
        chooseChat: async function (chat_id) {
            // вариант написания кода с setInterval:
            // если intervalId пустой (а при первом входе он у нас пустой)
            if (this.intervalId) {
                //то очищаем айди интервала при нажатии на любой чат из списка чатов
                clearInterval(this.intervalId)
            }
            // если intervalId не пустой, то он его очистит и дальше перейдет на строку ниже, будет вытаскивать данные чата
            this.currentChat = (await this.sendRequest(`chat/${chat_id}`, 'GET')).payload[0]
            // вызываем обновление данных чата каждую секунду
            this.intervalId = setInterval(() => this.update_chat_data(chat_id), 2000)
            // console.log(this.currentChat);

            this.update_chat_data(chat_id)
        },
        update_chat_data: async function (chat_id) {
            const oldChatHistory = this.currentChat.history // здесь история еще не обновилась
            this.currentChat = (await this.sendRequest(`chat/${chat_id}`, 'GET')).payload[0]
            this.currentChat.history // здесь история уже обновилась

            console.log(this.currentChat.history.length, oldChatHistory.length);

            if(this.currentChat.history.length > oldChatHistory.length) {
                this.notifyMe(this.currentChat.history.at(-1)?.text)
            }
        },
        sendRequest: async function (path, method, body) {
            const url = `${this.serverUrl}${path}`;
            if (method === 'GET') {
                return (await axios.get(url)).data
            } else {
                return (await axios.post(url, body)).data
            }
        },
        notifyMe: function (text) {
            if (!("Notification" in window)) {
                // Check if the browser supports notifications
                alert("This browser does not support desktop notification");
            } else if (Notification.permission === "granted") {
                // Check whether notification permissions have already been granted;
                // if so, create a notification
                const notification = new Notification(text);
                // …
            } else if (Notification.permission !== "denied") {
                // We need to ask the user for permission
                Notification.requestPermission().then((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        const notification = new Notification(text);
                        // …
                    }
                })
            }
        }
    },
    async mounted () { // функция вызывается сразу же
        // console.log('test');
        const userId = this.$route.params.id
        this.user = (await this.sendRequest(`user/${userId}`, 'GET')).payload[0]
        // console.log(this.user);
        
        EventBus.$emit('userDataReady', this.user)
        // console.log(EventBus);

        // создаем websocket соединение
        this.webSocket = new WebSocket(`ws://195.49.210.34/ws?login=${this.user.login}`)
        // this.webSocket = new WebSocket(`webSocketServerUrl +`ws?login=${this.user.login}`)
        
        // websocket начитает свою работу когда подключится и дальше когда пользвователь введет свое сообщение, но 
        // если пользователь не введет сообщение, но соединение прерывается через 60 секунд, поэтому нужно делать реконнект 
        // принимаем сообщения от backend, onopen - это событие websocket, вызывается тогда, когда соединение websocket установится с backend
        this.webSocket.onopen = async (event) => {
            // console.log(event);
            // принимаем сообщения от backend, onmessage - это событие websocket, вызывается тогда, когда backend будет присылать нам сообщение
            this.webSocket.onmessage = async (msg) => {
                const serverData = JSON.parse(msg.data)
                console.log({serverData});

                // чтобы не загружать сервер прописываем два условия:
                // на появление нового сообщения и на создание чата
                // type - это тип сообщения
                if (serverData.type === 'newMessage') {
                    console.log('test')
                    this.update_chat_data(serverData.payload.chatId);
                }
                else if (serverData.type === 'newChat') {
                    // type - это тип сообщения
                    // нам нужно теперь вызвать функцию из файла List.vue,
                    // для этого нам нужно использовать EventBus
                    EventBus.$emit('newChat', serverData.payload);
                }                
            }
            // socket соединение держится 1 минуту, поэтому бывает ошибка ниже
            this.webSocket.onclose = async () => {
                console.log('connection closed');
            }
        }
        // когда будет ошибка в соединении
        this.webSocket.onerror = async () => {
            // console.log(error);
        }
    }
}
</script>

<!-- стили -->
<style scoped lang="less">
@font-face {
  font-family: 'Gordita Light';
  src: local('Gordita Light'), local('Gordita Light'),
  url('@/assets/GorditaLight.woff') format('woff'),
}
* {
    font-family: 'Gordita Light';
  }
  .wrapper {
    display: flex;
    // height: 100vh;
    // justify-content: flex-end;
    // align-items: right;
    .chatList {
        width: 100%;
        height: 100vh;
    }
    .chatView {
        width: 64%;
        position: absolute;
        right: 0;
        // left: 420px;
        // top: 58px;
        border-radius: 20px;
        background: linear-gradient(120deg, #17bebb, #f0a6ca);
        // margin: 50px;
        height: 100vh;
        // padding-top: 20px;
        display: inline-flex;
        flex-direction: column;
    }
    .chatSendMessage {
        display: inline-flex;
        flex-direction: row;
        width: 55%;
        position: absolute;
        bottom: 0px;
        right: 0px;
    }
  }
  .createChatModalWrapper {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: left;
    background:rgba(0,0,0,.7);
    z-index: 100;
    transform: translate(-50%, -50%);    
    left: 50%;
    top: 50%;    
  }
</style>