<template>
  <div class="app">
    <Navigation />
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Modals -->
    <Teleport to="body">
      <div class="modals-container">
        <LoginModal v-if="activeModal === 'login'" @close="closeModal" />
        <RegisterModal v-if="activeModal === 'register'" @close="closeModal" />
        <DepositModal 
          v-if="activeModal === 'deposit'" 
          @close="closeModal"
          @submit="handleDeposit"
        />
        <WithdrawModal v-if="activeModal === 'withdraw'" @close="closeModal" />
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue';
import { Store, useStore } from 'vuex';
import Navigation from './components/Navigation.vue';
import LoginModal from './components/LoginModal.vue';
import RegisterModal from './components/RegisterModal.vue';
import DepositModal from './components/DepositModal.vue';
import WithdrawModal from './components/WithdrawModal.vue';

interface DepositData {
  amount: number;
  currency: string;
}

const store: Store<any> = useStore();

// État des modals
const activeModal = ref<string | null>(null);

// Chargement initial des données
onMounted(async () => {
  try {
    await store.dispatch('matches/fetchMatches');
    await store.dispatch('matches/fetchLiveMatches');
  } catch (error) {
    console.error('Erreur lors du chargement des matchs:', error);
  }
});

// Méthodes
const openModal = (modalName: string) => {
  activeModal.value = modalName;
};

const closeModal = () => {
  activeModal.value = null;
};

const handleDeposit = async (depositData: DepositData) => {
  try {
    await store.dispatch('transactions/createDeposit', depositData);
    closeModal();
  } catch (error) {
    console.error('Erreur lors du dépôt:', error);
  }
};

// Fournir les fonctions de contrôle des modaux aux composants enfants
provide('openLoginModal', () => openModal('login'));
provide('openRegisterModal', () => openModal('register'));
provide('openDepositModal', () => openModal('deposit'));
provide('openWithdrawModal', () => openModal('withdraw'));
provide('closeModal', closeModal);
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #121212;
  color: #fff;
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  .main-content {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Scrollbar
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #4CAF50;
  border-radius: 4px;
  
  &:hover {
    background: #45a049;
  }
}

.app-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
}

.navbar {
  background-color: #2d2d2d !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;

  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;

  &:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }
}

.btn-outline-light {
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.modals-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  pointer-events: auto;
}
</style> 