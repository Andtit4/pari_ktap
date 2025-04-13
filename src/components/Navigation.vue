<template>
  <nav class="navigation">
    <div class="nav-brand">
      <router-link to="/" class="logo">
        <span>Oddx</span>
      </router-link>
    </div>
    
    <div class="nav-links">
      <router-link to="/matches" class="nav-link">
        <i class="fas fa-futbol"></i>
        Matches
      </router-link>
      
      <router-link v-if="isAuthenticated" to="/bets" class="nav-link">
        <i class="fas fa-ticket-alt"></i>
        Mes paris
      </router-link>
      
      <router-link v-if="isAdmin" to="/admin" class="nav-link admin-link">
        <i class="fas fa-user-shield"></i>
        Administration
      </router-link>
    </div>

    <div class="nav-auth">
      <template v-if="isAuthenticated">
        <div class="balance">
          <i class="fas fa-wallet"></i>
          {{ formatBalance(balance) }} KTAP
        </div>
        
        <div class="user-menu">
          <button class="deposit-btn" @click="showDepositModal">
            <i class="fas fa-plus"></i>
            Dépôt
          </button>
          <button class="withdraw-btn" @click="showWithdrawModal">
            <i class="fas fa-minus"></i>
            Retrait
          </button>
          <button class="logout-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            Déconnexion
          </button>
        </div>
      </template>
      
      <template v-else>
        <button class="login-btn" @click="showLoginModal">
          <i class="fas fa-sign-in-alt"></i>
          Connexion
        </button>
        <button class="register-btn" @click="showRegisterModal">
          <i class="fas fa-user-plus"></i>
          Inscription
        </button>
      </template>
    </div>
  </nav>
</template>

<script>
import { computed, inject } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Navigation',
  
  setup() {
    const store = useStore();
    const openLoginModal = inject('openLoginModal');
    const openRegisterModal = inject('openRegisterModal');
    const openDepositModal = inject('openDepositModal');
    const openWithdrawModal = inject('openWithdrawModal');
    
    const isAuthenticated = computed(() => {
      try {
        return store.getters['auth/isAuthenticated'] || false;
      } catch (error) {
        console.error('Erreur lors de l\'accès à isAuthenticated:', error);
        return false;
      }
    });
    
    const isAdmin = computed(() => {
      try {
        return store.getters['auth/isAdmin'] || false;
      } catch (error) {
        console.error('Erreur lors de l\'accès à isAdmin:', error);
        return false;
      }
    });
    
    const balance = computed(() => {
      try {
        return store.getters['auth/userBalance'] || 0;
      } catch (error) {
        console.error('Erreur lors de l\'accès au balance:', error);
        return 0;
      }
    });
    
    const formatBalance = (value) => {
      return new Intl.NumberFormat('fr-FR').format(value);
    };
    
    const logout = () => {
      store.dispatch('auth/logout');
    };
    
    return {
      isAuthenticated,
      isAdmin,
      balance,
      formatBalance,
      showLoginModal: openLoginModal,
      showRegisterModal: openRegisterModal,
      showDepositModal: openDepositModal,
      showWithdrawModal: openWithdrawModal,
      logout
    };
  }
};
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1a1a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .nav-brand {
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #fff;
      text-decoration: none;
      
      &:hover {
        color: #4CAF50;
      }
    }
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    
    .nav-link {
      color: #fff;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #333;
      }
      
      &.router-link-active {
        background-color: #4CAF50;
      }
      
      &.admin-link {
        background-color: #2196F3;
        
        &:hover {
          background-color: #1976D2;
        }
      }
    }
  }
  
  .nav-auth {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .balance {
      color: #4CAF50;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .user-menu {
      display: flex;
      gap: 0.5rem;
    }
    
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &.login-btn {
        background-color: #4CAF50;
        color: white;
        
        &:hover {
          background-color: #45a049;
        }
      }
      
      &.register-btn {
        background-color: #2196F3;
        color: white;
        
        &:hover {
          background-color: #1976D2;
        }
      }
      
      &.deposit-btn {
        background-color: #4CAF50;
        color: white;
        
        &:hover {
          background-color: #45a049;
        }
      }
      
      &.withdraw-btn {
        background-color: #ff9800;
        color: white;
        
        &:hover {
          background-color: #f57c00;
        }
      }
      
      &.logout-btn {
        background-color: #f44336;
        color: white;
        
        &:hover {
          background-color: #d32f2f;
        }
      }
    }
  }
}
</style> 
 
 