import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import User from '@/components/main/User.vue'
import RightsList from '@/components/rights/RightsList.vue'
import Roles from '@/components/rights/Roles.vue'
import Categories from '@/components/goods/Categories.vue'
import Params from '@/components/goods/Params.vue'
import Goods from '@/components/goods/Goods.vue'
import AddGoods from '@/components/goods/AddGoods.vue'
import Orders from '@/components/Orders.vue'
import Reports from '@/components/reports/Reports.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: RightsList },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/addGoods', component: AddGoods },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    if (window.sessionStorage.getItem('token')) {
      return next()
    } else {
      return next('/login')
    }
  }
})
export default router
