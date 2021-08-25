import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/Index.vue') },
      { path: 'search', name: 'search', component: () => import('pages/Search.vue') },
      { path: 'setting', name: 'setting', component: () => import('pages/Setting.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
  {
    path: '/popup',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'search', component: () => import('pages/Search.vue') },
      { path: 'setting', component: () => import('pages/Setting.vue') },
    ],
  },
];

export default routes;
