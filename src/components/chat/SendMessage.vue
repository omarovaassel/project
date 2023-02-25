<template>
    <div class="wrapper">
        <input v-model="textMessage" @keypress.enter="sendMessageButtonHandler"></input>
        <img src="../../assets/sendMessageButton.png" alt="" width="70" height="70" v-on:click="sendMessageButtonHandler">
    </div>
</template>
  
  
<script>
    import axios from 'axios'

    export default {
        name: "SendMessage.vue",
        data: () => ({
            serverUrl: 'http://195.49.210.34/',
            textMessage: '',
        }),
        //props используется постоянно
        props: {
            login: {
                type: String,
                default: ''
            },
            chatId: {
                type: String,
                default: ''
            }            
        },
        methods: {
            sendRequest: async function (path, method, body) {
            const url = `${this.serverUrl}${path}`;
            if (method === 'GET') {
                return (await axios.get(url)).data
            } else {
                return (await axios.post(url, body)).data
            }
            },
            sendMessageButtonHandler: async function () {
                const request_body = {
                    login: this.login,
                    text: this.textMessage,
                    chatId: this.chatId
                }

                // отправляем запрос на отправку сообщения
                const response = await this.sendRequest('chat/send/text', "POST", request_body);

                this.textMessage = ''
                
                // проверяем удалось ли отправить сообщение
                // console.log({response});
            },
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
* {
    font-family: 'Gordita Light';
    font-size: 17px;
    margin: 8px;
}
.wrapper {
    display: flex;  
    width: 90%;
    text-align: center;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
    button {
        // color: white;
        padding-left: 15px;
        text-align: center;
        // font-size: 70px;
        cursor: pointer;
    }
    input {
        border: 1px solid white;
        border-radius: 30px;
        background-color: white;
        width: 100%;
        height: 50px;
        margin-left: 20px;
        padding: 15px;
        resize: none;
    }
}
</style>