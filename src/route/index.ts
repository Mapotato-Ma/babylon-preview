import { createRouter, createWebHistory } from 'vue-router';
import { LayoutComponent } from '../views';
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: LayoutComponent },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
