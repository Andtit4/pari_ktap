import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

// Vues
import MatchesView from '../views/MatchesView.vue';
import UserBetsView from '../views/UserBetsView.vue';
import ProfileView from '../views/ProfileView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
  {
    path: '/',
    redirect: '/matches'
  },
  {
    path: '/matches',
    name: 'matches',
    component: MatchesView
  },
  {
    path: '/bets',
    name: 'bets',
    component: UserBetsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const store = useStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];

  if (requiresAuth && !isAuthenticated) {
    next('/matches');
  } else if (requiresAdmin && !isAdmin) {
    next('/matches');
  } else {
    next();
  }
});

export default router; 