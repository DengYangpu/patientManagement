import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: {
            title: '系统首页'
          }
        },
        {
          path: '/404',
          component: resolve => require(['../components/page/404.vue'], resolve),
          meta: {
            title: '404'
          }
        },
        {
          path: '/403',
          component: resolve => require(['../components/page/403.vue'], resolve),
          meta: {
            title: '403'
          }
        },
        {
          path: '/role',
          component: resolve => require(['../components/page/roleManage/Role.vue'], resolve),
          meta: {
            title: '角色管理'
          }
        },
        {
          path: '/jurisdiction',
          component: resolve => require(['../components/page/roleManage/Jurisdiction.vue'], resolve),
          meta: {
            title: '权限管理'
          }
        },
        {
          path: '/roleGroup',
          component: resolve => require(['../components/page/roleManage/RoleGroup.vue'],resolve),
          meta: {
            title: '角色组管理'
          }
        },
        {
          path: '/manage',
          component: resolve => require(['../components/page/hospital/Manage.vue'],resolve),
          meta: {
            title: '医院管理'
          }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})