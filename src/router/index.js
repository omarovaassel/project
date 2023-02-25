import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Auth from '../components/Auth.vue'
import Reg from '../components/Reg.vue'
import Test from '../views/Test.vue'
import ChatList from '../components/chat/List.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth
  },
  {
    path: '/reg',
    name: 'reg',
    component: Reg
  },
  {
    path: '/home/:id',
    name: 'home',
    component: Home
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router