<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>Mon Profil</h1>
      <button class="edit-btn" @click="isEditing = !isEditing">
        <i class="fas" :class="isEditing ? 'fa-times' : 'fa-edit'"></i>
        {{ isEditing ? 'Annuler' : 'Modifier' }}
      </button>
    </div>

    <div class="profile-content">
      <!-- Informations utilisateur -->
      <div class="profile-section">
        <h2>Informations personnelles</h2>
        <div class="user-info">
          <div class="info-group">
            <label>Nom d'utilisateur</label>
            <div v-if="!isEditing" class="info-value">{{ user.username }}</div>
            <input v-else v-model="editedUser.username" type="text" class="form-control" />
          </div>

          <div class="info-group">
            <label>Email</label>
            <div v-if="!isEditing" class="info-value">{{ user.email }}</div>
            <input v-else v-model="editedUser.email" type="email" class="form-control" />
          </div>

          <div class="info-group">
            <label>Téléphone</label>
            <div v-if="!isEditing" class="info-value">{{ user.phone || 'Non renseigné' }}</div>
            <input v-else v-model="editedUser.phone" type="tel" class="form-control" />
          </div>

          <div class="info-group">
            <label>Date d'inscription</label>
            <div class="info-value">{{ formatDate(user.createdAt) }}</div>
          </div>
        </div>

        <div v-if="isEditing" class="actions">
          <button class="save-btn" @click="updateProfile" :disabled="loading">
            <i class="fas fa-save"></i>
            Enregistrer
          </button>
        </div>
      </div>

      <!-- Solde et transactions -->
      <div class="profile-section">
        <h2>Mon compte</h2>
        <div class="balance-card">
          <div class="balance-info">
            <span class="balance-label">Solde KTAP</span>
            <span class="balance-amount">{{ formatBalance(user.ktapBalance) }}</span>
          </div>
          <div class="balance-actions">
            <button class="action-btn deposit" @click="openDepositModal">
              <i class="fas fa-plus"></i>
              Dépôt
            </button>
            <button class="action-btn withdraw" @click="openWithdrawModal">
              <i class="fas fa-minus"></i>
              Retrait
            </button>
          </div>
        </div>
      </div>

      <!-- Statistiques de paris -->
      <div class="profile-section">
        <h2>Statistiques de paris</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalBets }}</div>
            <div class="stat-label">Paris totaux</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.wonBets }}</div>
            <div class="stat-label">Paris gagnés</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.lostBets }}</div>
            <div class="stat-label">Paris perdus</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ formatBalance(stats.totalWinnings) }}</div>
            <div class="stat-label">Gains totaux</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ProfileView',
  
  setup() {
    const store = useStore();
    const openDepositModal = inject('openDepositModal');
    const openWithdrawModal = inject('openWithdrawModal');
    
    const isEditing = ref(false);
    const loading = ref(false);
    const user = computed(() => store.state.auth.user || {});
    const editedUser = ref({});
    
    const stats = computed(() => {
      const bets = store.state.bets.userBets || [];
      return {
        totalBets: bets.length,
        wonBets: bets.filter(bet => bet.status === 'won').length,
        lostBets: bets.filter(bet => bet.status === 'lost').length,
        totalWinnings: bets.reduce((total, bet) => total + (bet.winnings || 0), 0)
      };
    });

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatBalance = (value) => {
      return new Intl.NumberFormat('fr-FR').format(value || 0);
    };

    const updateProfile = async () => {
      try {
        loading.value = true;
        await store.dispatch('auth/updateProfile', editedUser.value);
        isEditing.value = false;
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      try {
        await store.dispatch('auth/fetchProfile');
        await store.dispatch('bets/fetchUserBets');
        editedUser.value = { ...user.value };
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    });

    return {
      isEditing,
      loading,
      user,
      editedUser,
      stats,
      formatDate,
      formatBalance,
      updateProfile,
      openDepositModal,
      openWithdrawModal
    };
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2rem;
      color: #fff;
    }
    
    .edit-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background-color: #4CAF50;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #45a049;
        transform: translateY(-2px);
      }
    }
  }
  
  .profile-content {
    display: grid;
    gap: 2rem;
    
    .profile-section {
      background-color: #1a1a1a;
      border-radius: 8px;
      padding: 1.5rem;
      
      h2 {
        color: #fff;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
      }
      
      .user-info {
        display: grid;
        gap: 1rem;
        
        .info-group {
          display: grid;
          gap: 0.5rem;
          
          label {
            color: #888;
            font-size: 0.9rem;
          }
          
          .info-value {
            color: #fff;
            font-size: 1.1rem;
          }
          
          .form-control {
            padding: 0.5rem;
            border: 1px solid #333;
            border-radius: 4px;
            background-color: #2d2d2d;
            color: #fff;
            
            &:focus {
              outline: none;
              border-color: #4CAF50;
            }
          }
        }
      }
      
      .actions {
        margin-top: 1.5rem;
        display: flex;
        justify-content: flex-end;
        
        .save-btn {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          
          &:hover:not(:disabled) {
            background-color: #45a049;
            transform: translateY(-2px);
          }
          
          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }
    }
    
    .balance-card {
      background-color: #2d2d2d;
      border-radius: 8px;
      padding: 1.5rem;
      
      .balance-info {
        margin-bottom: 1.5rem;
        
        .balance-label {
          display: block;
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .balance-amount {
          font-size: 2rem;
          font-weight: bold;
          color: #4CAF50;
        }
      }
      
      .balance-actions {
        display: flex;
        gap: 1rem;
        
        .action-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
          }
          
          &.deposit {
            background-color: #4CAF50;
            color: white;
            
            &:hover {
              background-color: #45a049;
            }
          }
          
          &.withdraw {
            background-color: #f44336;
            color: white;
            
            &:hover {
              background-color: #da190b;
            }
          }
        }
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      
      .stat-card {
        background-color: #2d2d2d;
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4CAF50;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          color: #888;
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style> 