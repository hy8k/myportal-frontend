import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MemoView from '../views/MemoView.vue'
import LaboratoryManagementSystemView from '../views/LaboratoryManagementSystemView.vue'
import CompoundManager from '@/components/CompoundManager.vue'
import ExperimentManager from '@/components/ExperimentManager.vue'
import SampleManager from '@/components/SampleManager.vue'
import DefaultManager from '@/components/DefaultManager.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/memo',
      name: 'memo',
      component: MemoView
    },
    {
      path: '/lab-management',
      name: 'laboratoryManagementSystem',
      component: LaboratoryManagementSystemView,
      children: [
        {
          path: 'compound',
          component: CompoundManager
        },
        {
          path: 'experiment',
          component: ExperimentManager
        },
        {
          path: 'sample',
          component: SampleManager
        },
      ]
    },
    // {
    //   path: '/expense',
    //   name: 'expense',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: ExpenseView
    // },
  ]
})

export default router
