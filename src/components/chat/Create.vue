<template>
    <div class="wrapper">
    <!-- https://vuejs.org/guide/essentials/class-and-style.html источник для кода в следующей строке, где можно в html менять классы и стили --> 
    <!-- <div :style="{ color: defaultColor}" или :style="styleObject" :class="{ wrapper: true, active: isActive, 'text-danger': hasError }"> сюда можно передать объект, в котором прописаны стили ниже в data, где мы создали selectMember -->
        <div class="close_modal" v-on:click="closeChatButtonHandler">x</div>

        <!-- чтобы вытащить значение value из инпута пишем v-model -->
        <input v-model="label" placeholder="Название">
        <input v-model="description" placeholder="Описание">

        <div class="members">Выберите участников чата</div>
        <div class="members_block">
            <!-- чтобы показать список участников чата, мы используем созданный ниже id="usersList" в следующей строке как list="usersList" -->
            <input list="usersList" v-model="selectMember" class="members_list" placeholder="Участники">
            <div class="members_button" v-on:click="add_member_button_handler">Добавить</div>
        </div>        
        
        <div class="members_list_choose">Вы выбрали: {{ selectedMembers }}</div>

        <div class="new_chat_button" v-on:click="create_chat_button_handler">Создать чат</div>        

        <datalist id="usersList">
            <option v-for="user in usersList" :key="user._id" :value="user.login"></option> 
            <!-- двоеточие означает, что мы хотим добавить в тег не текст, а переменную -->
        </datalist>
    </div>
</template>
  
  
<script>
import axios from 'axios'

export default {
    name: 'createChat',
    // в data мы объявляем все переменные
    data: () => ({
        serverUrl: 'http://195.49.210.34/',
        label: '',
        description: '',
        // defaultColor: 'black',
        selectMember: '', //
        selectedMembers: [], // пустой массив, это список выбранных участников
        usersList: [] // пустой массив, это полный список вообще всех пользователей в системе, включая выбранных участников
    }),
    async mounted () { // запускаем эту функция, когда открывается этот компонент, список пользователей, который мы будем получать постоянно
        this.usersList = (await this.sendRequest('user', "GET")).payload
        // console.log(this.usersList)
    },
    methods: {
        // создаем слушатель на клик открытия модального окна
        closeChatButtonHandler: function () {
            this.$emit('closeModalCreateChat') // $emit - это значит создать событие и прослушать его
        },
        // здесь мы генерируем цвета, которые используем в стилях в html :style="{ color: defaultColor}
        // generateColor: function () {
        //     return 'rgb(100, 100, 100)'
        // },
        create_chat_button_handler: async function () {
        // проверка
        if(!this.label || !this.description) return alert('Вы не заполнили поля "Название" или "Описание"')
        
        // собираем все данные для создания чата
        const request_body = {
            userId: this.$route.params.id || "63e253d392021356e711e486", // id пользователя который хочет создать новый чат
            label: this.label, // название чата
            members: this.selectedMembers, // массив участников чата
            description: this.description // описание чата, необязательный параметр!
        }

        // отправляем запрос на создание чата
        const response = await this.sendRequest('chat/create', "POST", request_body);
        
        // проверяем удалось ли создать чат
        // console.log({response});
        
        // закрываем модальное окно
        this.$emit('closeModalCreateChat');
    },
    
    add_member_button_handler: async function () {
        // делаем проверку для пользователя
        if (!this.selectMember) return alert('Вы не выбрали участника');
        if (this.selectedMembers.includes(this.selectMember)) return alert('Этого участника вы уже выбрали');

        // ниже в false и true прописываем pattern или еще называется флаг, своего рода переключатель
        // user = { login: ? } = Temirlan это логин в базе usersList
        // selectMember = Temirlan это наш инпут
        // selectedMembers = [Temirlan, Temirlan1. Temirlan2. Temirlan3] это уже выбранные пользователи
        
        let selectedMemberIsExist = false
        let counter = 0

        for(const user of this.usersList) {
            if (user.login === this.selectMember) {
                selectedMemberIsExist = true
            }
            if (this.selectedMembers.includes(user.login)) {
                counter++
            }
        }      
        
        if (!selectedMemberIsExist) return alert(`Пользователя ${this.selectMember} не существует`)
        if (counter !== this.selectedMembers.length) return alert(`Такого пользователя не существует`)
        
        // сюда отправляем массив this.selectedMembers, в котором будет последнее значение массива selectMember
        this.selectedMembers.push(this.selectMember);
        this.selectMember = ''
    },
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
* {
    font-family: 'Gordita Light';
    font-size: 17px;
    margin: 8px;
}
.wrapper {
    border: 1px solid #17bebb;
    border-radius: 20px;
    background-color: white;
    margin: 50px;
    padding: 20px;
    height: 500px;
    width: 500px;
    // padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    position: relative;
    .close_modal {
        text-align: right;
        margin-top: -15px;
        cursor: pointer;
    }
    .members_block {
        display: flex;
    }
    .members_button, .new_chat_button {
        border-radius: 20px;
        background: linear-gradient(120deg, #17bebb, #f0a6ca);
        padding: 5px;
        text-align: center;            
        cursor: pointer;
        color: white;
        font-weight: bold;
    }
    .members_list {
        width: 70%;
        padding: 5px;
    }
    .members_button {
        width: 20%;
        padding: 5px;
    }
    input {
        // display: flex;  
        // width: 100%;
        text-align: center;
        border: 1px solid #17bebb;
        border-radius: 20px;
        padding: 5px;
    }
}
</style>