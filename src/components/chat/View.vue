<template>
    <div class="wrapper">
        <div class="messageList">
            <!-- если поставить двоеточие после имени класса, то класс будет принимать значение как объект в стандарте Ключ равно Объект -->
            <div
                v-for="message in chat.history"
                class="messageWrapper"
                :class= "{ messageWrapper: true, fromMe: login === message.from, notFromMe: login !== message.from }"
                :key="message.id"
            >

                <div class="from">
                {{message.from}}
                </div>
                <div class="text">
                {{message.text}}
                </div>
                <div class="timestamp">
                15:14
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'View.vue',
    props: {
        chat: {
            type: Object,
            default: {
              history: []
              // у истории чата должно быть пустое значение по умолчанию,
              // потому что не сразу могут придти данные в props
              // и пока данные с backend приходят в View.vue у нас будет 
              // отображаться пустой массив в строке html chat.history
            }
        },
        login: {
            type: String,
            default: ''
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
}
.wrapper {
    display: flex;  
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    position: absolute;
    .messageList {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
    //   justify-content: flex-end;
      align-items: center;
      .messageWrapper {
        max-width: 60%;
        height: auto;
        min-height: 40px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        margin: 20px;
        * {
          width: 100%;
        }
        .text {
          font-size: 1em;
        }
        .from {
          font-size: 1.1em;
          text-align: left;
          font-weight: bold;
          padding-bottom: 5px;
        }
        .timestamp {
          font-size: .9em;
          color: rgba(120, 113, 113, 0.9);
          text-align: right;
        }
      }
      .fromMe {
        background-color: white;
        text-align: right;
        align-self: flex-end;
      }
      .notFromMe {
        background-color: white;
        text-align: left;
        align-self: flex-start;
      }
    }
  }










//         .wrapper {
//     // position: absolute;
//     // display: flex;
//     // width: 80%;
//     // height: 80%;
//     // // justify-content: center;
//     // // align-items: center;
//     // border: 1px solid white;
//     // border-radius: 20px;
//     // background: grey;
//     // // z-index: 100;
//     // // transform: translate(-50%, -50%);    
//     // // left: 50%;
//     // // top: 50%;


//     #chatAndMessage {
//     width: 550px;
//     height: 450px;
//     overflow-y: auto;
//     border: 1px solid grey;
//     border-radius: 20px;
//     background: #ffffff;
    
// }

// .messageInChat {
//     overflow: hidden;
//     margin-bottom: 10px;
//     border-radius: 5px;
//     padding: 5px;
// }

// .messageClient {
//     max-width: 286px;
//     background: white;
//     color: rgb(79, 79, 79);
//     border: 1px solid grey;
//     border-radius: 20px;
//     left: 10px;
//     width: 90%;
//     float: left;
//     padding: 10px;
// }

// .messageManager {
//     max-width: 286px;
//     background: white;
//     color: rgb(79, 79, 79);
//     border: 1px solid grey;
//     border-radius: 20px;
//     right: 10px;
//     width: 90%;
//     float: right;
//     padding: 10px;
// }
// }
</style>